import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, BagIcon, CheckIcon, WhatsAppIcon } from "../components/Icons";
import { useTitle } from "../components/Layout";
import { ProductGrid } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { QtyStepper } from "../components/QtyStepper";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { formatPrice, whatsappLink } from "../lib/format";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { slug } = useParams();
  const { products, settings, loading, categoryOf } = useStore();
  const { add, open } = useCart();
  const product = products.find(p => p.slug === slug);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  useTitle(product?.name);

  if (loading) return <div className="container-x py-20 text-center text-stone-500">Loading...</div>;
  if (!product) return <NotFound />;

  const category = categoryOf(product);
  const related = products.filter(p => p.id !== product.id && p.in_stock && p.category_id === product.category_id).slice(0, 4);
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const image = product.images[Math.min(active, product.images.length - 1)];
  const enquiry = `Hello ${settings.store_name}, I'd like to order:\n${qty} x ${product.name} (${formatPrice(product.price)})\n${location.href}`;

  const addToCart = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    open();
  };

  return (
    <div className="container-x py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link to="/shop" className="flex items-center gap-1.5 hover:text-ink"><ArrowLeftIcon width={16} height={16} /> Shop</Link>
        {category && <><span>/</span><Link to={`/shop?category=${category.slug}`} className="hover:text-ink">{category.name}</Link></>}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-3xl bg-stone-100 ring-1 ring-stone-200">
            <ProductImage src={image} name={product.name} />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((src, i) => (
                <button key={src + i} type="button" onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`}
                  className={`aspect-square overflow-hidden rounded-xl bg-stone-100 ring-2 transition ${i === active ? "ring-brand-600" : "ring-transparent hover:ring-stone-300"}`}>
                  <ProductImage src={src} name={product.name} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:py-4">
          {category && <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{category.name}</p>}
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-800">{formatPrice(product.price)}</span>
            {onSale && <span className="text-lg text-stone-400 line-through">{formatPrice(product.compare_at_price!)}</span>}
          </div>
          <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${product.in_stock ? "bg-brand-50 text-brand-700" : "bg-stone-100 text-stone-600"}`}>
            {product.in_stock ? <><CheckIcon width={16} height={16} /> In stock</> : "Sold out"}
          </p>
          {product.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-stone-600">{product.description}</p>}

          {product.in_stock ? (
            <div className="mt-8 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <QtyStepper value={qty} onChange={setQty} />
                <button type="button" onClick={addToCart} className="btn-primary flex-1 py-3.5 text-base">
                  {added ? <><CheckIcon /> Added</> : <><BagIcon /> Add to cart</>}
                </button>
              </div>
              {settings.whatsapp && (
                <a href={whatsappLink(settings.whatsapp, enquiry)} target="_blank" rel="noreferrer" className="btn-whatsapp w-full py-3.5 text-base">
                  <WhatsAppIcon /> Order this on WhatsApp
                </a>
              )}
            </div>
          ) : settings.whatsapp && (
            <a href={whatsappLink(settings.whatsapp, `Hello, is "${product.name}" coming back in stock?`)} target="_blank" rel="noreferrer" className="btn-outline mt-8 w-full py-3.5">
              <WhatsAppIcon /> Ask when it's back
            </a>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
