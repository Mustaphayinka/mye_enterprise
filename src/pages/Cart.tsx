import { useState } from "react";
import { Link } from "react-router-dom";
import { BagIcon, CheckIcon, WhatsAppIcon } from "../components/Icons";
import { useTitle } from "../components/Layout";
import { ProductImage } from "../components/ProductImage";
import { QtyStepper } from "../components/QtyStepper";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";
import { formatPrice, whatsappLink } from "../lib/format";

const DETAILS_KEY = "mye-customer-v1";

function loadDetails() {
  try {
    return { name: "", phone: "", address: "", note: "", ...JSON.parse(localStorage.getItem(DETAILS_KEY) ?? "{}") };
  } catch {
    return { name: "", phone: "", address: "", note: "" };
  }
}

export default function Cart() {
  useTitle("Cart");
  const { items, total, setQty, remove, clear } = useCart();
  const { settings } = useStore();
  const [form, setForm] = useState(loadDetails);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value }),
  });

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!settings.whatsapp) return setError("The store hasn't set a WhatsApp number yet. Please call us instead.");
    const lines = items.map((i, n) => `${n + 1}. ${i.product.name} x ${i.qty} = ${formatPrice(i.product.price * i.qty)}`);
    const message = [
      `Hello ${settings.store_name}, I'd like to place an order:`, "", ...lines, "", `*Total: ${formatPrice(total)}*`, "",
      `Name: ${form.name.trim()}`, `Phone: ${form.phone.trim()}`,
      ...(form.address.trim() ? [`Delivery address: ${form.address.trim()}`] : []),
      ...(form.note.trim() ? [`Note: ${form.note.trim()}`] : []),
    ].join("\n");

    // Open WhatsApp first (inside the click, so phones don't block the pop-up), then log the order.
    const win = window.open(whatsappLink(settings.whatsapp, message), "_blank");
    if (!win) location.href = whatsappLink(settings.whatsapp, message);
    setSending(true);
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify({ ...form, note: "" }));
    } catch {
      /* not essential */
    }
    try {
      await api.createOrder({
        customer_name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), note: form.note.trim(),
        items: items.map(i => ({ product_id: i.product.id, name: i.product.name, price: i.product.price, qty: i.qty })), total,
      });
    } catch {
      /* the WhatsApp message is the real order; the saved copy is a convenience for the owner */
    }
    setSending(false);
    setSent(true);
    clear();
  };

  if (sent)
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <span className="rounded-full bg-brand-50 p-4 text-brand-700"><CheckIcon width={32} height={32} /></span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Thank you!</h1>
        <p className="mt-2 max-w-md text-stone-600">Your order has been prepared in WhatsApp. Please make sure you pressed <b>Send</b> there, and we'll reply to confirm.</p>
        <Link to="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </div>
    );

  if (!items.length)
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <span className="rounded-full bg-brand-50 p-4 text-brand-700"><BagIcon width={32} height={32} /></span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Find something you like in the shop.</p>
        <Link to="/shop" className="btn-primary mt-8">Go to shop</Link>
      </div>
    );

  return (
    <div className="container-x py-10">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <ul className="card divide-y divide-stone-100 self-start">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <ProductImage src={product.images[0]} name={product.name} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${product.slug}`} className="font-semibold hover:text-brand-700">{product.name}</Link>
                  <p className="text-sm text-stone-500">{formatPrice(product.price)} each</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <QtyStepper value={qty} onChange={n => setQty(product.id, n)} small />
                  <span className="w-28 text-right font-bold">{formatPrice(product.price * qty)}</span>
                </div>
                <button type="button" onClick={() => remove(product.id)} className="self-start text-xs font-medium text-stone-500 hover:text-red-600 sm:self-center">Remove</button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={checkout} className="card space-y-4 self-start p-5 sm:p-6">
          <h2 className="text-lg font-bold">Your details</h2>
          <div><label className="label" htmlFor="name">Full name</label><input id="name" required maxLength={100} autoComplete="name" className="input" {...field("name")} /></div>
          <div><label className="label" htmlFor="phone">Phone number</label><input id="phone" required type="tel" maxLength={30} pattern="[0-9+ \(\)\-]{7,}" title="Digits, spaces, + ( ) and - only" autoComplete="tel" placeholder="e.g. 0801 234 5678" className="input" {...field("phone")} /></div>
          <div><label className="label" htmlFor="address">Delivery address or pickup point <span className="font-normal text-stone-400">(optional)</span></label><textarea id="address" rows={2} maxLength={500} autoComplete="street-address" className="input" {...field("address")} /></div>
          <div><label className="label" htmlFor="note">Note <span className="font-normal text-stone-400">(optional)</span></label><textarea id="note" rows={2} maxLength={1000} placeholder="Colour, size, best time to reach you..." className="input" {...field("note")} /></div>
          <div className="space-y-2 border-t border-stone-200 pt-4">
            <div className="flex justify-between text-stone-600"><span>Items</span><span>{items.reduce((n, i) => n + i.qty, 0)}</span></div>
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
            <p className="text-xs text-stone-500">Delivery cost and payment are confirmed with you on WhatsApp.</p>
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={sending} className="btn-whatsapp w-full py-3.5 text-base"><WhatsAppIcon /> Send order on WhatsApp</button>
        </form>
      </div>
    </div>
  );
}
