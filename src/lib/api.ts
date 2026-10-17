/**
 * One data API for the whole app, with two backends:
 *  - Supabase (real site): shared database, owner login, photo storage.
 *  - Demo (no keys set): starter products, changes saved only in this browser.
 */
import { blobToDataUrl, compressImage } from "./image";
import { defaultSettings, seedCategories, seedProducts } from "./seed";
import { supabase } from "./supabase";
import type { Category, Order, OrderInput, OrderStatus, Product, ProductInput, Settings } from "./types";

export interface Api {
  listProducts(): Promise<Product[]>;
  saveProduct(p: ProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  listCategories(): Promise<Category[]>;
  saveCategory(c: Omit<Category, "id"> & { id?: string }): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  getSettings(): Promise<Settings>;
  saveSettings(s: Settings): Promise<Settings>;
  uploadImage(file: File): Promise<string>;
  createOrder(o: OrderInput): Promise<void>;
  listOrders(): Promise<Order[]>;
  setOrderStatus(id: string, status: OrderStatus): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  /** Calls back with whether the current user is an admin; returns an unsubscribe function. */
  watchAdmin(cb: (isAdmin: boolean, email: string | null) => void): () => void;
}

const fail = (e: { message: string } | null) => {
  if (e) throw new Error(e.message);
};

const toProduct = (r: Record<string, unknown>): Product => ({
  ...(r as unknown as Product),
  price: Number(r.price),
  compare_at_price: r.compare_at_price == null ? null : Number(r.compare_at_price),
  images: (r.images as string[]) ?? [],
});

// ------------------------------------------------------------------ Supabase
function supabaseApi(): Api {
  const db = supabase!;
  const productCols = "id,name,slug,description,price,compare_at_price,category_id,images,in_stock,featured,created_at";

  async function checkAdmin(): Promise<boolean> {
    const { data: u } = await db.auth.getUser();
    if (!u.user) return false;
    const { data } = await db.from("admins").select("user_id").eq("user_id", u.user.id).maybeSingle();
    return !!data;
  }

  return {
    async listProducts() {
      const { data, error } = await db.from("products").select(productCols).order("created_at", { ascending: false });
      fail(error);
      return (data ?? []).map(toProduct);
    },
    async saveProduct(p) {
      const { id, ...fields } = p;
      const q = id
        ? db.from("products").update(fields).eq("id", id).select(productCols).single()
        : db.from("products").insert(fields).select(productCols).single();
      const { data, error } = await q;
      if (error?.code === "23505") throw new Error("Another product already uses this web address (slug). Change the name or slug.");
      fail(error);
      return toProduct(data!);
    },
    async deleteProduct(id) {
      fail((await db.from("products").delete().eq("id", id)).error);
    },
    async listCategories() {
      const { data, error } = await db.from("categories").select("id,name,slug,sort_order").order("sort_order");
      fail(error);
      return data ?? [];
    },
    async saveCategory(c) {
      const { id, ...fields } = c;
      const q = id
        ? db.from("categories").update(fields).eq("id", id).select().single()
        : db.from("categories").insert(fields).select().single();
      const { data, error } = await q;
      if (error?.code === "23505") throw new Error("A category with this name already exists.");
      fail(error);
      return data as Category;
    },
    async deleteCategory(id) {
      fail((await db.from("categories").delete().eq("id", id)).error);
    },
    async getSettings() {
      const { data, error } = await db.from("settings").select("*").eq("id", 1).maybeSingle();
      fail(error);
      return { ...defaultSettings, ...(data ?? {}) };
    },
    async saveSettings(s) {
      const { data, error } = await db.from("settings").upsert({ id: 1, ...s }).select().single();
      fail(error);
      return { ...defaultSettings, ...data };
    },
    async uploadImage(file) {
      const blob = await compressImage(file);
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.jpg`;
      const { error } = await db.storage.from("product-images").upload(path, blob, { contentType: "image/jpeg" });
      fail(error);
      return db.storage.from("product-images").getPublicUrl(path).data.publicUrl;
    },
    async createOrder(o) {
      fail((await db.from("orders").insert(o)).error);
    },
    async listOrders() {
      const { data, error } = await db.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
      fail(error);
      return (data ?? []).map(r => ({ ...r, total: Number(r.total) })) as Order[];
    },
    async setOrderStatus(id, status) {
      fail((await db.from("orders").update({ status }).eq("id", id)).error);
    },
    async signIn(email, password) {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
      if (!(await checkAdmin())) {
        await db.auth.signOut();
        throw new Error("This account is not an admin of the store.");
      }
    },
    async signOut() {
      await db.auth.signOut();
    },
    watchAdmin(cb) {
      let alive = true;
      const run = async () => {
        const { data } = await db.auth.getUser();
        const admin = await checkAdmin();
        if (alive) cb(admin, data.user?.email ?? null);
      };
      run();
      const { data } = db.auth.onAuthStateChange(() => void run());
      return () => {
        alive = false;
        data.subscription.unsubscribe();
      };
    },
  };
}

// ---------------------------------------------------------------------- Demo
const DEMO_KEY = "mye-demo-v1";
export const DEMO_PASSWORD = "demo1234";

interface DemoState {
  products: Product[];
  categories: Category[];
  settings: Settings;
  orders: Order[];
  admin: boolean;
}

function demoApi(): Api {
  const load = (): DemoState => {
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* storage blocked or corrupt: fall back to starter data */
    }
    return { products: seedProducts, categories: seedCategories, settings: defaultSettings, orders: [], admin: false };
  };
  let state = load();
  const listeners = new Set<(a: boolean, e: string | null) => void>();
  const save = () => {
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(state));
    } catch {
      throw new Error("This browser's storage is full. In demo mode photos are kept in the browser; connect Supabase for real use.");
    }
  };
  const requireAdmin = () => {
    if (!state.admin) throw new Error("Please log in first.");
  };
  const tick = () => new Promise(r => setTimeout(r, 120)); // feel like a network call
  const id = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

  return {
    async listProducts() {
      await tick();
      return [...state.products].sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    async saveProduct(p) {
      await tick();
      requireAdmin();
      if (state.products.some(x => x.slug === p.slug && x.id !== p.id))
        throw new Error("Another product already uses this web address (slug). Change the name or slug.");
      let saved: Product;
      if (p.id) {
        const old = state.products.find(x => x.id === p.id);
        if (!old) throw new Error("Product not found.");
        saved = { ...old, ...p, id: old.id };
        state.products = state.products.map(x => (x.id === p.id ? saved : x));
      } else {
        saved = { ...p, id: id(), created_at: new Date().toISOString() };
        state.products = [saved, ...state.products];
      }
      save();
      return saved;
    },
    async deleteProduct(pid) {
      await tick();
      requireAdmin();
      state.products = state.products.filter(x => x.id !== pid);
      save();
    },
    async listCategories() {
      await tick();
      return [...state.categories].sort((a, b) => a.sort_order - b.sort_order);
    },
    async saveCategory(c) {
      await tick();
      requireAdmin();
      if (state.categories.some(x => x.name.toLowerCase() === c.name.toLowerCase() && x.id !== c.id))
        throw new Error("A category with this name already exists.");
      const saved = { ...c, id: c.id ?? id() } as Category;
      state.categories = c.id ? state.categories.map(x => (x.id === c.id ? saved : x)) : [...state.categories, saved];
      save();
      return saved;
    },
    async deleteCategory(cid) {
      await tick();
      requireAdmin();
      state.categories = state.categories.filter(x => x.id !== cid);
      state.products = state.products.map(p => (p.category_id === cid ? { ...p, category_id: null } : p));
      save();
    },
    async getSettings() {
      await tick();
      return { ...defaultSettings, ...state.settings };
    },
    async saveSettings(s) {
      await tick();
      requireAdmin();
      state.settings = s;
      save();
      return s;
    },
    async uploadImage(file) {
      requireAdmin();
      return blobToDataUrl(await compressImage(file, 800, 0.75));
    },
    async createOrder(o) {
      await tick();
      state.orders = [{ ...o, id: id(), status: "new", created_at: new Date().toISOString() }, ...state.orders];
      save();
    },
    async listOrders() {
      await tick();
      requireAdmin();
      return state.orders;
    },
    async setOrderStatus(oid, status) {
      await tick();
      requireAdmin();
      state.orders = state.orders.map(o => (o.id === oid ? { ...o, status } : o));
      save();
    },
    async signIn(_email, password) {
      await tick();
      if (password !== DEMO_PASSWORD) throw new Error("Wrong email or password.");
      state.admin = true;
      save();
      listeners.forEach(l => l(true, "demo@myestores"));
    },
    async signOut() {
      state.admin = false;
      save();
      listeners.forEach(l => l(false, null));
    },
    watchAdmin(cb) {
      state = load();
      cb(state.admin, state.admin ? "demo@myestores" : null);
      listeners.add(cb);
      return () => void listeners.delete(cb);
    },
  };
}

export const api: Api = supabase ? supabaseApi() : demoApi();

/** Demo only: wipe local changes and go back to the starter products. */
export const resetDemo = () => {
  try {
    localStorage.removeItem(DEMO_KEY);
  } catch {
    /* ignore */
  }
  location.reload();
};
