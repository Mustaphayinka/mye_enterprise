import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon, EditIcon, TrashIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";
import { slugify } from "../lib/format";
import type { Category } from "../lib/types";
import { Notice, PageHeading } from "./AdminLayout";

export default function Categories() {
  const { categories, products, refresh } = useStore();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    const order = Math.max(-1, ...categories.map(c => c.sort_order)) + 1;
    if (await run(() => api.saveCategory({ name: n, slug: slugify(n), sort_order: order }))) setName("");
  };

  const rename = async (c: Category) => {
    const n = editing?.name.trim();
    if (!n) return;
    if (await run(() => api.saveCategory({ ...c, name: n, slug: slugify(n) }))) setEditing(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const a = categories[i], b = categories[i + dir];
    if (!a || !b) return;
    void run(async () => {
      await api.saveCategory({ ...a, sort_order: b.sort_order });
      await api.saveCategory({ ...b, sort_order: a.sort_order });
    });
  };

  const remove = (c: Category) => {
    const n = products.filter(p => p.category_id === c.id).length;
    const msg = n ? `Delete "${c.name}"? Its ${n} products will be kept but have no category.` : `Delete "${c.name}"?`;
    if (confirm(msg)) void run(() => api.deleteCategory(c.id));
  };

  return (
    <div className="max-w-2xl">
      <PageHeading title="Categories" subtitle="Group your products so customers find them easily. Use the arrows to change the order." />
      <form onSubmit={add} className="mb-4 flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)} maxLength={60} placeholder="New category name" className="input" aria-label="New category name" />
        <button type="submit" disabled={busy || !name.trim()} className="btn-primary shrink-0">Add</button>
      </form>
      {error && <div className="mb-4"><Notice kind="error">{error}</Notice></div>}
      <ul className={`card divide-y divide-stone-100 ${busy ? "opacity-60" : ""}`}>
        {categories.length === 0 && <li className="p-6 text-center text-sm text-stone-500">No categories yet.</li>}
        {categories.map((c, i) => (
          <li key={c.id} className="flex items-center gap-2 p-3 sm:p-4">
            <div className="flex flex-col">
              <button type="button" disabled={busy || i === 0} onClick={() => move(i, -1)} className="rounded p-0.5 text-stone-400 hover:text-ink disabled:invisible" aria-label="Move up"><ArrowLeftIcon width={14} height={14} className="rotate-90" /></button>
              <button type="button" disabled={busy || i === categories.length - 1} onClick={() => move(i, 1)} className="rounded p-0.5 text-stone-400 hover:text-ink disabled:invisible" aria-label="Move down"><ArrowRightIcon width={14} height={14} className="rotate-90" /></button>
            </div>
            {editing?.id === c.id ? (
              <form className="flex flex-1 gap-2" onSubmit={e => { e.preventDefault(); void rename(c); }}>
                <input autoFocus value={editing.name} maxLength={60} onChange={e => setEditing({ id: c.id, name: e.target.value })} className="input py-1.5" aria-label="Category name" />
                <button type="submit" disabled={busy} className="rounded-full p-2 text-brand-700 hover:bg-brand-50" aria-label="Save"><CheckIcon width={18} height={18} /></button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Cancel"><CloseIcon width={18} height={18} /></button>
              </form>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="text-xs text-stone-500">{products.filter(p => p.category_id === c.id).length} products</p>
                </div>
                <button type="button" disabled={busy} onClick={() => setEditing({ id: c.id, name: c.name })} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-ink" aria-label={`Rename ${c.name}`}><EditIcon width={18} height={18} /></button>
                <button type="button" disabled={busy} onClick={() => remove(c)} className="rounded-full p-2 text-stone-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${c.name}`}><TrashIcon width={18} height={18} /></button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
