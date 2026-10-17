import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CloseIcon, SearchIcon } from "../components/Icons";
import { useTitle } from "../components/Layout";
import { ProductGrid, ProductGridSkeleton } from "../components/ProductCard";
import { useStore } from "../context/StoreContext";

const sorts = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name A-Z",
} as const;
type Sort = keyof typeof sorts;

export default function Shop() {
  const { products, categories, loading } = useStore();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = params.get("category") ?? "";
  const sort = (params.get("sort") as Sort) in sorts ? (params.get("sort") as Sort) : "featured";
  const inStockOnly = params.get("instock") === "1";
  const category = categories.find(c => c.slug === cat);
  useTitle(category?.name ?? "Shop");

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const out = products.filter(p =>
      (!category || p.category_id === category.id) &&
      (!inStockOnly || p.in_stock) &&
      words.every(w => `${p.name} ${p.description}`.toLowerCase().includes(w)));
    const by: Record<Sort, (a: typeof out[number], b: typeof out[number]) => number> = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.in_stock) - Number(a.in_stock) || b.created_at.localeCompare(a.created_at),
      newest: (a, b) => b.created_at.localeCompare(a.created_at),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return out.sort(by[sort]);
  }, [products, q, category, inStockOnly, sort]);

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{category?.name ?? "All products"}</h1>
        <p className="mt-1 text-stone-500">{loading ? "Loading..." : `${list.length} ${list.length === 1 ? "product" : "products"}`}</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" width={18} height={18} />
            <input value={q} onChange={e => set("q", e.target.value)} placeholder="Search products..." className="input rounded-full pl-10" />
            {q && (
              <button type="button" onClick={() => set("q", "")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-stone-400 hover:bg-stone-100" aria-label="Clear search">
                <CloseIcon width={16} height={16} />
              </button>
            )}
          </label>
          <div className="flex gap-3">
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={e => set("sort", e.target.value === "featured" ? "" : e.target.value)} className="input rounded-full pr-8">
                {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-stone-300 bg-white px-4 text-sm">
              <input type="checkbox" checked={inStockOnly} onChange={e => set("instock", e.target.checked ? "1" : "")} className="accent-brand-700" />
              In stock
            </label>
          </div>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "", name: "All" }, ...categories].map(c => (
            <button key={c.slug} type="button" onClick={() => set("category", c.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${cat === c.slug ? "bg-brand-700 text-white" : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-brand-600"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? <ProductGridSkeleton /> : list.length ? <ProductGrid products={list} /> : (
        <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-stone-200">
          <p className="font-semibold">No products match your search.</p>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="btn-outline mt-4">Clear filters</button>
        </div>
      )}
    </div>
  );
}
