import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";
import { normaliseWhatsApp } from "../lib/format";
import type { Settings } from "../lib/types";
import { Notice, PageHeading } from "./AdminLayout";

type Field = { key: keyof Settings; label: string; hint?: string; long?: boolean; type?: string };

const groups: { title: string; fields: Field[] }[] = [
  {
    title: "Store",
    fields: [
      { key: "store_name", label: "Store name" },
      { key: "tagline", label: "Short description", hint: "Shown in the footer and in Google results." },
      { key: "announcement", label: "Announcement bar", hint: "A message across the top of every page, e.g. \"Free delivery on campus this week\". Leave empty to hide." },
    ],
  },
  {
    title: "Home page",
    fields: [
      { key: "hero_title", label: "Big headline" },
      { key: "hero_subtitle", label: "Text under the headline", long: true },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "whatsapp", label: "WhatsApp number", hint: "Orders are sent here. e.g. 08170084726 or 2348170084726", type: "tel" },
      { key: "phone", label: "Phone number (shown to customers)", type: "tel" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Address" },
      { key: "hours", label: "Opening hours", hint: "e.g. Mon-Sat, 08:00 - 16:00" },
    ],
  },
  {
    title: "Social media links",
    fields: [
      { key: "instagram", label: "Instagram link", type: "url" },
      { key: "facebook", label: "Facebook link", type: "url" },
      { key: "tiktok", label: "TikTok link", type: "url" },
    ],
  },
];

export default function SettingsPage() {
  const { settings, refresh } = useStore();
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  useEffect(() => setForm(settings), [settings]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const whatsapp = normaliseWhatsApp(form.whatsapp);
    if (form.whatsapp && whatsapp.length < 10) return setMsg({ kind: "error", text: "That WhatsApp number looks too short." });
    if (!form.store_name.trim()) return setMsg({ kind: "error", text: "The store needs a name." });
    setSaving(true);
    try {
      const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])) as unknown as Settings;
      await api.saveSettings({ ...trimmed, whatsapp });
      await refresh();
      setMsg({ kind: "success", text: "Saved. The changes are live on your store." });
    } catch (err) {
      setMsg({ kind: "error", text: err instanceof Error ? err.message : "Could not save." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <PageHeading title="Store settings" subtitle="Your store's name, contact details and home page text." />
      {groups.map(g => (
        <section key={g.title} className="card space-y-4 p-5">
          <h2 className="font-semibold">{g.title}</h2>
          {g.fields.map(f => (
            <div key={f.key}>
              <label className="label" htmlFor={f.key}>{f.label}</label>
              {f.long ? (
                <textarea id={f.key} rows={3} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input" />
              ) : (
                <input id={f.key} type={f.type ?? "text"} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input" />
              )}
              {f.hint && <p className="mt-1 text-xs text-stone-500">{f.hint}</p>}
            </div>
          ))}
        </section>
      ))}
      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
      <div className="sticky bottom-4">
        <button type="submit" disabled={saving} className="btn-primary w-full py-3 shadow-lg sm:w-auto sm:px-10">{saving ? "Saving..." : "Save settings"}</button>
      </div>
    </form>
  );
}
