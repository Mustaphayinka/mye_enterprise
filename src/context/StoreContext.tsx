import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import { defaultSettings } from "../lib/seed";
import type { Category, Product, Settings } from "../lib/types";

interface StoreState {
  products: Product[];
  categories: Category[];
  settings: Settings;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  categoryOf: (p: Product) => Category | undefined;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [p, c, s] = await Promise.all([api.listProducts(), api.listCategories(), api.getSettings()]);
      setProducts(p);
      setCategories(c);
      setSettings(s);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the store.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<StoreState>(() => {
    const byId = new Map(categories.map(c => [c.id, c]));
    return {
      products, categories, settings, loading, error, refresh,
      categoryOf: p => (p.category_id ? byId.get(p.category_id) : undefined),
    };
  }, [products, categories, settings, loading, error, refresh]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
