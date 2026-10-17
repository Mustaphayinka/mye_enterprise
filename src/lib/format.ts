const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2, minimumFractionDigits: 0 });

export const formatPrice = (n: number) => naira.format(n);

export const slugify = (text: string) =>
  text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Digits only, Nigerian local numbers (080...) turned into 234... for wa.me links. */
export const normaliseWhatsApp = (raw: string) => {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) return "234" + d.slice(1);
  return d;
};

export const whatsappLink = (number: string, text?: string) =>
  `https://wa.me/${normaliseWhatsApp(number)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
