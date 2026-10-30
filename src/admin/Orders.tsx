import { useCallback, useEffect, useState } from "react";
import { PhoneIcon, WhatsAppIcon } from "../components/Icons";
import { api } from "../lib/api";
import { formatDate, formatPrice, whatsappLink } from "../lib/format";
import type { Order, OrderStatus } from "../lib/types";
import { Notice, PageHeading } from "./AdminLayout";

const statuses: { value: OrderStatus; label: string; style: string }[] = [
  { value: "new", label: "New", style: "bg-accent-400 text-ink" },
  { value: "confirmed", label: "Confirmed", style: "bg-sky-100 text-sky-800" },
  { value: "delivered", label: "Delivered", style: "bg-brand-50 text-brand-700" },
  { value: "cancelled", label: "Cancelled", style: "bg-stone-200 text-stone-600" },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setOrders(await api.listOrders());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders.");
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const setStatus = async (o: Order, status: OrderStatus) => {
    setOrders(os => os?.map(x => (x.id === o.id ? { ...x, status } : x)) ?? null);
    try {
      await api.setOrderStatus(o.id, status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the order.");
      void load();
    }
  };

  const list = orders?.filter(o => !filter || o.status === filter) ?? [];
  const count = (s: OrderStatus) => orders?.filter(o => o.status === s).length ?? 0;

  return (
    <>
      <PageHeading title="Orders" subtitle="A copy of every order customers send you on WhatsApp. Update the status as you go." />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {[{ value: "" as const, label: "All", n: orders?.length ?? 0 }, ...statuses.map(s => ({ ...s, n: count(s.value) }))].map(s => (
          <button key={s.value} type="button" onClick={() => setFilter(s.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${filter === s.value ? "bg-brand-700 text-white" : "bg-white ring-1 ring-stone-200"}`}>
            {s.label} <span className="opacity-60">{s.n}</span>
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Notice kind="error">{error}</Notice></div>}
      {orders === null ? <p className="text-stone-500">Loading...</p> : list.length === 0 ? (
        <div className="card p-10 text-center text-stone-500">No orders here yet.</div>
      ) : (
        <ul className="space-y-3">
          {list.map(o => {
            const st = statuses.find(s => s.value === o.status) ?? statuses[0]!;
            return (
              <li key={o.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{o.customer_name}</p>
                    <p className="text-xs text-stone-500">{formatDate(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.style}`}>{st.label}</span>
                    <select value={o.status} onChange={e => void setStatus(o, e.target.value as OrderStatus)} className="input w-auto py-1.5 text-xs" aria-label="Change status">
                      {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-4"><span>{it.qty} × {it.name}</span><span className="text-stone-500">{formatPrice(it.price * it.qty)}</span></li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-between border-t border-stone-100 pt-2 font-bold"><span>Total</span><span>{formatPrice(o.total)}</span></div>
                {(o.address || o.note) && (
                  <div className="mt-3 space-y-1 rounded-xl bg-stone-50 p-3 text-sm">
                    {o.address && <p><span className="text-stone-500">Address: </span>{o.address}</p>}
                    {o.note && <p><span className="text-stone-500">Note: </span>{o.note}</p>}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={whatsappLink(o.phone, `Hello ${o.customer_name}, thank you for your order!`)} target="_blank" rel="noreferrer" className="btn-whatsapp px-4 py-2"><WhatsAppIcon width={16} height={16} /> WhatsApp</a>
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="btn-outline px-4 py-2"><PhoneIcon width={16} height={16} /> {o.phone}</a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
