import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ImageIcon, TrashIcon } from "../components/Icons";
import { ProductImage } from "../components/ProductImage";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";
import { slugify } from "../lib/format";
import type { ProductInput } from "../lib/types";
import { Notice, PageHeading } from "./AdminLayout";

const MAX_IMAGES = 8;
const empty: ProductInput = {
  name: "", slug: "", description: "", price: 0, compare_at_price: null, category_id: null,
  images: [], in_stock: true, featured: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { products, categories, refresh, loading } = useStore();
  const existing = products.find(p => p.id === id);
  const [form, setForm] = useState<ProductInput>(empty);
  const [priceText, setPriceText] = useState("");
  const [compareText, setCompareText] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !existing) return;
    const { created_at: _c, ...rest } = existing;
    setForm(rest);
    setPriceText(String(existing.price));
    setCompareText(existing.compare_at_price == null ? "" : String(existing.compare_at_price));
    setSlugTouched(true);
    loaded.current = true;
  }, [existing]);

  if (!isNew && !existing) {
    return loading ? <p className="text-stone-500">Loading...</p> : (
      <div className="card p-10 text-center">
        <p className="font-semibold">This product no longer exists.</p>
        <Link to="/admin" className="btn-outline mt-4">Back to products</Link>
      </div>
    );
  }

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setForm(f => ({ ...f, [k]: v }));

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const room = MAX_IMAGES - form.images.length;
    const chosen = [...files].slice(0, room);
    if (files.length > room) setError(`Only ${MAX_IMAGES} photos per product; extra photos were skipped.`);
    setUploading(n => n + chosen.length);
    for (const file of chosen) {
      try {
        const url = await api.uploadImage(file);
        setForm(f => ({ ...f, images: [...f.images, url] }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "A photo failed to upload.");
      } finally {
        setUploading(n => n - 1);
      }
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const moveImage = (i: number, dir: -1 | 1) => {
    const imgs = [...form.images];
    const j = i + dir;
    if (j < 0 || j >= imgs.length) return;
    [imgs[i], imgs[j]] = [imgs[j]!, imgs[i]!];
    set("images", imgs);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const price = Number(priceText.replace(/[,\s₦]/g, ""));
    const compare = compareText.trim() ? Number(compareText.replace(/[,\s₦]/g, "")) : null;
    if (!form.name.trim()) return setError("Please enter a product name.");
    if (!Number.isFinite(price) || price < 0) return setError("Please enter a valid price, e.g. 4500.");
    if (compare !== null && (!Number.isFinite(compare) || compare < 0)) return setError("The 'was' price must be a number, or left empty.");
    if (compare !== null && compare <= price) return setError("The 'was' price should be higher than the current price (or leave it empty).");
    if (uploading) return setError("Please wait for the photos to finish uploading.");
    setSaving(true);
    try {
      await api.saveProduct({ ...form, name: form.name.trim(), description: form.description.trim(), slug: slugify(form.slug || form.name), price, compare_at_price: compare });
      await refresh();
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing || !confirm(`Delete "${existing.name}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await api.deleteProduct(existing.id);
      await refresh();
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the product.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save}>
      <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-ink"><ArrowLeftIcon width={16} height={16} /> All products</Link>
      <PageHeading title={isNew ? "Add a product" : "Edit product"} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card space-y-4 p-5">
            <div>
              <label className="label" htmlFor="name">Product name</label>
              <input id="name" required maxLength={120} value={form.name} className="input"
                onChange={e => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
            </div>
            <div>
              <label className="label" htmlFor="description">Description <span className="font-normal text-stone-400">(optional)</span></label>
              <textarea id="description" rows={5} maxLength={4000} value={form.description} onChange={e => set("description", e.target.value)} className="input"
                placeholder="Size, colour, material, what's in the box..." />
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Photos</h2>
              <span className="text-xs text-stone-500">{form.images.length}/{MAX_IMAGES} · first photo is the main one</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.images.map((src, i) => (
                <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200">
                  <ProductImage src={src} name={`Photo ${i + 1}`} />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/75 px-2 py-0.5 text-[10px] font-semibold text-white">Main</span>}
                  <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                    className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-stone-700 shadow hover:text-red-600" aria-label={`Remove photo ${i + 1}`}>
                    <CloseIcon width={14} height={14} />
                  </button>
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                    <button type="button" disabled={i === 0} onClick={() => moveImage(i, -1)} className="rounded-full bg-white/90 p-1 shadow disabled:invisible" aria-label="Move left"><ArrowLeftIcon width={14} height={14} /></button>
                    <button type="button" disabled={i === form.images.length - 1} onClick={() => moveImage(i, 1)} className="rounded-full bg-white/90 p-1 shadow disabled:invisible" aria-label="Move right"><ArrowRightIcon width={14} height={14} /></button>
                  </div>
                </div>
              ))}
              {Array.from({ length: uploading }, (_, i) => <div key={`up${i}`} className="aspect-square animate-pulse rounded-xl bg-stone-200" />)}
              {form.images.length + uploading < MAX_IMAGES && (
                <button type="button" onClick={() => fileInput.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-brand-600 hover:text-brand-700">
                  <ImageIcon /><span className="text-xs font-medium">Add photos</span>
                </button>
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={e => void addFiles(e.target.files)} />
            <p className="text-xs text-stone-500">Photos are resized automatically so the shop loads fast on mobile data.</p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card space-y-4 p-5">
            <div>
              <label className="label" htmlFor="price">Price (₦)</label>
              <input id="price" required inputMode="decimal" value={priceText} onChange={e => setPriceText(e.target.value)} className="input" placeholder="e.g. 4500" />
            </div>
            <div>
              <label className="label" htmlFor="compare">Was price (₦) <span className="font-normal text-stone-400">(optional, shows "Sale")</span></label>
              <input id="compare" inputMode="decimal" value={compareText} onChange={e => setCompareText(e.target.value)} className="input" placeholder="e.g. 6000" />
            </div>
            <div>
              <label className="label" htmlFor="category">Category</label>
              <select id="category" value={form.category_id ?? ""} onChange={e => set("category_id", e.target.value || null)} className="input">
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-stone-50 p-3">
              <span><span className="block text-sm font-medium">In stock</span><span className="text-xs text-stone-500">Customers can order it</span></span>
              <input type="checkbox" checked={form.in_stock} onChange={e => set("in_stock", e.target.checked)} className="h-5 w-5 accent-brand-700" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-stone-50 p-3">
              <span><span className="block text-sm font-medium">Featured</span><span className="text-xs text-stone-500">Shown on the home page</span></span>
              <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="h-5 w-5 accent-brand-700" />
            </label>
          </section>

          <section className="card space-y-2 p-5">
            <label className="label" htmlFor="slug">Web address</label>
            <div className="flex items-center rounded-xl border border-stone-300 bg-white text-sm focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
              <span className="pl-3.5 text-stone-400">/product/</span>
              <input id="slug" value={form.slug} onChange={e => { setSlugTouched(true); set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")); }}
                className="w-full min-w-0 rounded-xl bg-transparent py-2.5 pr-3 outline-none" />
            </div>
            <p className="text-xs text-stone-500">Filled in from the name. Changing it breaks old links to this product.</p>
          </section>

          {error && <Notice kind="error">{error}</Notice>}
          <div className="flex flex-col gap-2">
            <button type="submit" disabled={saving || uploading > 0} className="btn-primary w-full py-3">{saving ? "Saving..." : isNew ? "Add product" : "Save changes"}</button>
            {!isNew && <button type="button" disabled={saving} onClick={remove} className="btn w-full text-red-600 hover:bg-red-50"><TrashIcon width={16} height={16} /> Delete product</button>}
          </div>
        </div>
      </div>
    </form>
  );
}
