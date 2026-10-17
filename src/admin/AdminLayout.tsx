import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { BoxIcon, ExternalIcon, LogoutIcon, ReceiptIcon, SettingsIcon, TagIcon } from "../components/Icons";
import { Logo, useTitle } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { api, resetDemo } from "../lib/api";
import { isDemo } from "../lib/supabase";

const links = [
  { to: "/admin", label: "Products", Icon: BoxIcon, end: true },
  { to: "/admin/orders", label: "Orders", Icon: ReceiptIcon },
  { to: "/admin/categories", label: "Categories", Icon: TagIcon },
  { to: "/admin/settings", label: "Store settings", Icon: SettingsIcon },
];

export function AdminLayout() {
  useTitle("Admin");
  const { ready, isAdmin, email } = useAuth();
  const location = useLocation();
  const [leaving, setLeaving] = useState(false);

  if (!ready) return <div className="flex min-h-screen items-center justify-center text-stone-500">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  return (
    <div className="min-h-screen bg-stone-50 lg:flex">
      <aside className="border-b border-stone-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-3 lg:px-5 lg:py-5">
          <Logo />
          <button type="button" disabled={leaving} onClick={async () => { setLeaving(true); await api.signOut(); }}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 lg:hidden" aria-label="Log out"><LogoutIcon /></button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:px-3">
          {links.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? "bg-brand-50 text-brand-700" : "text-stone-600 hover:bg-stone-100"}`}>
              <Icon width={18} height={18} /> {label}
            </NavLink>
          ))}
          <Link to="/" target="_blank" className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100">
            <ExternalIcon width={18} height={18} /> View store
          </Link>
        </nav>
        <div className="hidden border-t border-stone-200 p-4 lg:block">
          <p className="truncate text-xs text-stone-500" title={email ?? ""}>Signed in as {email}</p>
          <button type="button" disabled={leaving} onClick={async () => { setLeaving(true); await api.signOut(); }} className="btn-outline mt-3 w-full"><LogoutIcon width={16} height={16} /> Log out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        {isDemo && (
          <div className="flex flex-wrap items-center justify-center gap-x-3 bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
            Demo mode: changes are saved only in this browser.
            <button type="button" onClick={() => confirm("Reset all demo data back to the starter products?") && resetDemo()} className="font-semibold underline">Reset demo data</button>
          </div>
        )}
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8"><Outlet /></div>
      </main>
    </div>
  );
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  return <p role={kind === "error" ? "alert" : "status"} className={`rounded-xl p-3 text-sm ${kind === "error" ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-800"}`}>{children}</p>;
}
