import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "../components/Icons";
import { ProductImage } from "../components/ProductImage";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";
import { Notice, PageHeading } from "./AdminLayout";

export default function Products() {
  const { products, categories, categoryOf, refresh, loading } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const list = useMemo(() => {
    const t = q.toLowerCase();
    return products.filter(p => (!cat || p.category_id === cat || (cat === "none" && !p.category_id)) && p.name.toLowerCase().includes(t));
  }, [products, q, cat]);

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const toggle = (p: Product, key: "in_stock" | "featured") => {
    const { id, created_at: _created, ...rest } = p;
    return run(p.id, () => api.saveProduct({ ...rest, id, [key]: !p[key] }));
  };
  const remove = (p: Product) => {
    if (confirm(`Delete "${p.name}"? This can't be undone.`)) void run(p.id, () => api.deleteProduct(p.id));
  };

  const soldOut = products.filter(p => !p.in_stock).length;

  return (
    <>
      <PageHeading
        title="Products"
        subtitle={`${products.length} products${soldOut ? `, ${soldOut} sold out` : ""}`}
        action={<Link to="/admin/products/new" className="btn-primary"><PlusIcon width={18} height={18} /> Add product</Link>}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" width={18} height={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name" className="input pl-10" />
        </label>
        <select value={cat} onChange={e => setCat(e.target.value)} className="input sm:w-56" aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          <option value="none">No category</option>
        </select>
      </div>
      {error && <div className="mb-4"><Notice kind="error">{error}</Notice></div>}

      {loading ? <p className="text-stone-500">Loading...</p> : list.length === 0 ? (
        <div className="card p-10 text-center text-stone-500">No products found.</div>
      ) : (
        <ul className="card divide-y divide-stone-100">
          {list.map(p => (
            <li key={p.id} className={`flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap sm:gap-4 sm:p-4 ${busy === p.id ? "opacity-50" : ""}`}>
              <Link to={`/admin/products/${p.id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <ProductImage src={p.images[0]} name={p.name} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/admin/products/${p.id}`} className="block truncate font-semibold hover:text-brand-700">{p.name}</Link>
                <p className="text-sm text-stone-500">{formatPrice(p.price)} · {categoryOf(p)?.name ?? "No category"}</p>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button type="button" disabled={!!busy} onClick={() => toggle(p, "in_stock")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${p.in_stock ? "bg-brand-50 text-brand-700" : "bg-stone-200 text-stone-600"}`}
                  title="Tap to switch">{p.in_stock ? "In stock" : "Sold out"}</button>
                <button type="button" disabled={!!busy} onClick={() => toggle(p, "featured")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${p.featured ? "bg-accent-400 text-ink" : "bg-stone-100 text-stone-500"}`}
                  title="Featured products show on the home page">{p.featured ? "Featured" : "Not featured"}</button>
                <span className="flex-1 sm:hidden" />
                <Link to={`/admin/products/${p.id}`} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-ink" aria-label={`Edit ${p.name}`}><EditIcon width={18} height={18} /></Link>
                <button type="button" disabled={!!busy} onClick={() => remove(p)} className="rounded-full p-2 text-stone-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${p.name}`}><TrashIcon width={18} height={18} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
