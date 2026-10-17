import { Link } from "react-router-dom";
import { ArrowRightIcon, BagIcon, ClockIcon, TruckIcon, WhatsAppIcon } from "../components/Icons";
import { useTitle } from "../components/Layout";
import { ProductGrid, ProductGridSkeleton } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { useStore } from "../context/StoreContext";
import { whatsappLink } from "../lib/format";

function SectionHeader({ title, subtitle, to }: { title: string; subtitle?: string; to?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-stone-500">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 sm:flex">
          View all <ArrowRightIcon width={16} height={16} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  useTitle();
  const { products, categories, settings, loading } = useStore();
  const inStock = products.filter(p => p.in_stock);
  const featured = (inStock.filter(p => p.featured).length ? inStock.filter(p => p.featured) : inStock).slice(0, 8);
  const latest = inStock.slice(0, 8);
  const heroProducts = featured.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-800 text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
              <BagIcon width={14} height={14} /> {settings.store_name}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">{settings.hero_title}</h1>
            <p className="mt-5 max-w-lg text-lg text-brand-100/90">{settings.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-accent px-7 py-3.5 text-base">Shop now <ArrowRightIcon width={18} height={18} /></Link>
              {settings.whatsapp && (
                <a href={whatsappLink(settings.whatsapp, `Hello ${settings.store_name}!`)} target="_blank" rel="noreferrer"
                  className="btn border border-white/30 px-7 py-3.5 text-base text-white hover:bg-white/10">
                  <WhatsAppIcon /> Chat with us
                </a>
              )}
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-4 lg:grid">
            {heroProducts.map((p, i) => (
              <Link key={p.id} to={`/product/${p.slug}`}
                className={`group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 ${i % 2 ? "translate-y-8" : ""}`}>
                <div className="aspect-square overflow-hidden"><ProductImage src={p.images[0]} name={p.name} className="transition duration-500 group-hover:scale-105" /></div>
                <div className="truncate px-4 py-3 text-sm font-semibold">{p.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x -mt-px">
        <div className="grid gap-3 py-8 sm:grid-cols-3">
          {[
            { Icon: BagIcon, title: "Pick your items", text: "Browse and add products to your cart." },
            { Icon: WhatsAppIcon, title: "Order on WhatsApp", text: "Send your order to us in one tap." },
            { Icon: TruckIcon, title: "We arrange delivery", text: "We confirm price, payment and pickup or delivery with you." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
              <span className="rounded-xl bg-brand-50 p-2.5 text-brand-700"><Icon width={22} height={22} /></span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-stone-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-x mt-8">
          <SectionHeader title="Shop by category" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map(c => {
              const items = inStock.filter(p => p.category_id === c.id);
              const cover = items.find(p => p.images[0]) ?? items[0];
              return (
                <Link key={c.id} to={`/shop?category=${c.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200">
                  {cover ? <ProductImage src={cover.images[0]} name={c.name} className="transition duration-500 group-hover:scale-105" /> : <ProductImage name={c.name} />}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-bold leading-tight sm:text-lg">{c.name}</h3>
                    <p className="text-xs text-white/80 sm:text-sm">{items.length} {items.length === 1 ? "item" : "items"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="container-x mt-16">
        <SectionHeader title="Featured products" subtitle="Our customers' favourites" to="/shop" />
        {loading ? <ProductGridSkeleton /> : featured.length ? <ProductGrid products={featured} /> : (
          <p className="rounded-2xl bg-white p-8 text-center text-stone-500 ring-1 ring-stone-200">New products are coming soon.</p>
        )}
      </section>

      {/* WhatsApp banner */}
      {settings.whatsapp && (
        <section className="container-x mt-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-accent-400 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Can't find what you need?</h2>
              <p className="mt-2 max-w-xl text-ink/80">Send us a message: we may have it in stock or be able to get it for you.</p>
              {settings.hours && <p className="mt-3 flex items-center gap-2 text-sm font-medium text-ink/70"><ClockIcon width={16} height={16} /> We reply {settings.hours}</p>}
            </div>
            <a href={whatsappLink(settings.whatsapp, `Hello ${settings.store_name}, I'm looking for `)} target="_blank" rel="noreferrer" className="btn bg-ink px-7 py-3.5 text-base text-white hover:bg-black">
              <WhatsAppIcon /> Ask on WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Latest */}
      {latest.length > 0 && (
        <section className="container-x mt-16">
          <SectionHeader title="New in store" subtitle="The latest additions" to="/shop?sort=newest" />
          <ProductGrid products={latest} />
        </section>
      )}
    </>
  );
}
