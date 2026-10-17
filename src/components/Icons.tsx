import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P): P => ({
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...p,
});

export const BagIcon = (p: P) => <svg {...base(p)}><path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>;
export const MenuIcon = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const CloseIcon = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const SearchIcon = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const PlusIcon = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const MinusIcon = (p: P) => <svg {...base(p)}><path d="M5 12h14" /></svg>;
export const TrashIcon = (p: P) => <svg {...base(p)}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
export const EditIcon = (p: P) => <svg {...base(p)}><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>;
export const ArrowRightIcon = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowLeftIcon = (p: P) => <svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const PhoneIcon = (p: P) => <svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>;
export const PinIcon = (p: P) => <svg {...base(p)}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>;
export const ClockIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const MailIcon = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
export const CheckIcon = (p: P) => <svg {...base(p)}><path d="m5 12 5 5 9-10" /></svg>;
export const ImageIcon = (p: P) => <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>;
export const BoxIcon = (p: P) => <svg {...base(p)}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="m3 7.5 9 4.5 9-4.5M12 12v9" /></svg>;
export const TagIcon = (p: P) => <svg {...base(p)}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></svg>;
export const SettingsIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></svg>;
export const ReceiptIcon = (p: P) => <svg {...base(p)}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>;
export const LogoutIcon = (p: P) => <svg {...base(p)}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></svg>;
export const TruckIcon = (p: P) => <svg {...base(p)}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
export const ExternalIcon = (p: P) => <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const WhatsAppIcon = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2m4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3" />
  </svg>
);
export const InstagramIcon = (p: P) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
export const FacebookIcon = (p: P) => <svg {...base(p)}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4z" /></svg>;
export const TikTokIcon = (p: P) => <svg {...base(p)}><path d="M15 3c.4 2.6 2 4.2 4.5 4.5v3.3A8 8 0 0 1 15 9.4V15a6 6 0 1 1-6-6v3.4A2.6 2.6 0 1 0 11.6 15V3z" /></svg>;
