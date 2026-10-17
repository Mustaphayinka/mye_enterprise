import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";
import { PlusIcon } from "./Icons";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { add, open } = useCart();
  const { categoryOf } = useStore();
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-200/70">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        <ProductImage src={product.images[0]} name={product.name} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {onSale && <span className="rounded-full bg-accent-400 px-2.5 py-1 text-xs font-bold text-ink">Sale</span>}
          {!product.in_stock && <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">Sold out</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3.5 sm:p-4">
        <span className="truncate text-xs font-medium text-stone-500">{categoryOf(product)?.name ?? " "}</span>
        <Link to={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand-700 sm:text-[15px]">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <div className="font-bold text-brand-800">{formatPrice(product.price)}</div>
            {onSale && <div className="text-xs text-stone-400 line-through">{formatPrice(product.compare_at_price!)}</div>}
          </div>
          <button
            type="button"
            disabled={!product.in_stock}
            onClick={() => { add(product); open(); }}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800 disabled:bg-stone-300"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="aspect-square animate-pulse bg-stone-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-stone-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
