import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { BagIcon, CloseIcon } from "./Icons";
import { ProductImage } from "./ProductImage";
import { QtyStepper } from "./QtyStepper";

export function CartDrawer() {
  const { items, total, count, isOpen, close, setQty, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div className={`fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div onClick={close} className={`absolute inset-0 bg-ink/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-modal="true" aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="text-lg font-bold">Your cart {count > 0 && <span className="text-stone-400">({count})</span>}</h2>
          <button type="button" onClick={close} className="rounded-full p-2 hover:bg-stone-100" aria-label="Close cart"><CloseIcon /></button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="rounded-full bg-brand-50 p-4 text-brand-700"><BagIcon width={28} height={28} /></span>
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm text-stone-500">Browse the shop and add something you like.</p>
            <Link to="/shop" onClick={close} className="btn-primary mt-2">Start shopping</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-stone-100 overflow-y-auto px-5">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 py-4">
                  <Link to={`/product/${product.slug}`} onClick={close} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <ProductImage src={product.images[0]} name={product.name} />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link to={`/product/${product.slug}`} onClick={close} className="line-clamp-2 text-sm font-semibold hover:text-brand-700">{product.name}</Link>
                    <span className="text-sm text-stone-500">{formatPrice(product.price)}</span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper value={qty} onChange={n => setQty(product.id, n)} small />
                      <button type="button" onClick={() => remove(product.id)} className="text-xs font-medium text-stone-500 underline-offset-2 hover:text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-stone-200 p-5">
              <div className="flex items-center justify-between text-base">
                <span className="text-stone-600">Total</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-stone-500">Delivery is arranged with you on WhatsApp after you place the order.</p>
              <Link to="/cart" onClick={close} className="btn-primary w-full py-3">Checkout</Link>
              <button type="button" onClick={close} className="btn-outline w-full">Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
