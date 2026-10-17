import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { isDemo } from "../lib/supabase";
import { whatsappLink } from "../lib/format";
import { CartDrawer } from "./CartDrawer";
import { BagIcon, ClockIcon, CloseIcon, FacebookIcon, InstagramIcon, MailIcon, MenuIcon, PhoneIcon, PinIcon, SearchIcon, TikTokIcon, WhatsAppIcon } from "./Icons";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/** Sets the browser tab title. */
export function useTitle(title?: string) {
  const { settings } = useStore();
  useEffect(() => {
    document.title = title ? `${title} | ${settings.store_name}` : `${settings.store_name} - ${settings.tagline}`;
  }, [title, settings.store_name, settings.tagline]);
}

export function Logo({ light = false }: { light?: boolean }) {
  const { settings } = useStore();
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${settings.store_name} home`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700">
        <BagIcon className="text-accent-400" width={20} height={20} />
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>{settings.store_name}</span>
    </Link>
  );
}

function Header() {
  const { count, open } = useCart();
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => setMenu(false), [pathname]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
    setQ("");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-paper/90 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-4">
        <button type="button" className="-ml-2 rounded-lg p-2 md:hidden" onClick={() => setMenu(m => !m)} aria-label="Menu" aria-expanded={menu}>
          {menu ? <CloseIcon /> : <MenuIcon />}
        </button>
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-medium transition ${isActive ? "bg-brand-50 text-brand-700" : "text-stone-600 hover:text-ink"}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <form onSubmit={search} className="ml-auto hidden max-w-xs flex-1 lg:block" role="search">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" width={18} height={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products" className="input rounded-full pl-10" />
          </label>
        </form>
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Link to="/shop" className="rounded-full p-2.5 text-stone-700 hover:bg-stone-100 lg:hidden" aria-label="Search products"><SearchIcon /></Link>
          <button type="button" onClick={open} className="relative rounded-full p-2.5 text-stone-700 hover:bg-stone-100" aria-label={`Cart, ${count} items`}>
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-400 px-1 text-[11px] font-bold text-ink">{count}</span>
            )}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="border-t border-stone-200 bg-paper md:hidden">
          <div className="container-x flex flex-col py-2">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `rounded-xl px-3 py-3 text-base font-medium ${isActive ? "bg-brand-50 text-brand-700" : "text-stone-700"}`}>
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { settings, categories } = useStore();
  const socials = [
    { url: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { url: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { url: settings.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter(s => /^https?:\/\//i.test(s.url)); // only real web links (never javascript: etc.)
  return (
    <footer className="mt-20 bg-brand-900 text-brand-100">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm text-brand-200/80">{settings.tagline}</p>
          {socials.length > 0 && (
            <div className="flex gap-2">
              {socials.map(({ url, label, Icon }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"><Icon width={18} height={18} /></a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-white">All products</Link></li>
            {categories.map(c => <li key={c.id}><Link to={`/shop?category=${c.slug}`} className="hover:text-white">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Help</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white">About us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/cart" className="hover:text-white">Your cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Get in touch</h3>
          <ul className="space-y-3 text-sm">
            {settings.address && <li className="flex gap-2.5"><PinIcon className="mt-0.5 shrink-0" width={18} height={18} />{settings.address}</li>}
            {settings.phone && <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex gap-2.5 hover:text-white"><PhoneIcon className="shrink-0" width={18} height={18} />{settings.phone}</a></li>}
            {settings.email && <li><a href={`mailto:${settings.email}`} className="flex gap-2.5 break-all hover:text-white"><MailIcon className="shrink-0" width={18} height={18} />{settings.email}</a></li>}
            {settings.hours && <li className="flex gap-2.5"><ClockIcon className="shrink-0" width={18} height={18} />{settings.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-brand-200/70 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
          <Link to="/admin" className="hover:text-white">Store owner login</Link>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const { settings } = useStore();
  const { pathname } = useLocation();
  // Product and cart pages have their own WhatsApp buttons; the floating one would cover "Add to cart" on phones.
  if (!settings.whatsapp || pathname.startsWith("/product/") || pathname === "/cart") return null;
  return (
    <a href={whatsappLink(settings.whatsapp, `Hello ${settings.store_name}, I have a question.`)} target="_blank" rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105">
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}

export function Layout() {
  const { settings, error } = useStore();
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      {isDemo && (
        <div className="bg-amber-100 px-4 py-1.5 text-center text-xs text-amber-900">
          Demo mode: sample data, changes are saved only in this browser. See README to connect the real database.
        </div>
      )}
      {settings.announcement && <div className="bg-brand-800 px-4 py-2 text-center text-sm font-medium text-white">{settings.announcement}</div>}
      <Header />
      {error && <div className="container-x mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">Sorry, the store couldn't load ({error}). Please refresh the page.</div>}
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingWhatsApp />
      <CartDrawer />
    </div>
  );
}
