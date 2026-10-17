import { Link } from "react-router-dom";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "../components/Icons";
import { useTitle } from "../components/Layout";
import { useStore } from "../context/StoreContext";
import { whatsappLink } from "../lib/format";

export function About() {
  useTitle("About");
  const { settings, categories } = useStore();
  return (
    <div className="container-x max-w-4xl py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">About us</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Everyday essentials, made easy to buy</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-stone-600">
        <p>
          {settings.store_name} is a versatile vendor with a wide range of products for your kitchen, home and personal
          care: plates and dinner sets, kettles and hotplates, shoe racks, foot mats and much more.
        </p>
        <p>We take pride in offering a diverse range of options to meet the needs of all our customers, at prices that make sense.</p>
        <p>We're available to help whenever you need us, so your questions are answered and your orders are handled promptly.</p>
      </div>
      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map(c => <Link key={c.id} to={`/shop?category=${c.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-stone-200 hover:ring-brand-600">{c.name}</Link>)}
        </div>
      )}
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/shop" className="btn-primary px-7 py-3">Browse the shop</Link>
        <Link to="/contact" className="btn-outline px-7 py-3">Contact us</Link>
      </div>
    </div>
  );
}

export function Contact() {
  useTitle("Contact");
  const { settings } = useStore();
  const rows = [
    settings.whatsapp && { Icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with us", href: whatsappLink(settings.whatsapp, `Hello ${settings.store_name}!`) },
    settings.phone && { Icon: PhoneIcon, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.email && { Icon: MailIcon, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { Icon: PinIcon, label: "Address", value: settings.address },
    settings.hours && { Icon: ClockIcon, label: "Opening hours", value: settings.hours },
  ].filter(Boolean) as { Icon: typeof PhoneIcon; label: string; value: string; href?: string }[];

  return (
    <div className="container-x max-w-4xl py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Contact</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">We'd love to hear from you</h1>
      <p className="mt-4 text-lg text-stone-600">Questions about a product, an order or delivery? The fastest way to reach us is WhatsApp.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {rows.map(({ Icon, label, value, href }) => {
          const inner = (
            <>
              <span className="rounded-xl bg-brand-50 p-3 text-brand-700"><Icon width={22} height={22} /></span>
              <div className="min-w-0">
                <p className="text-sm text-stone-500">{label}</p>
                <p className="break-words font-semibold">{value}</p>
              </div>
            </>
          );
          return href ? (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card flex items-center gap-4 p-5 transition hover:border-brand-600">{inner}</a>
          ) : (
            <div key={label} className="card flex items-center gap-4 p-5">{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
