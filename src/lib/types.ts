export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at"> & { id?: string };

export interface Settings {
  store_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  announcement: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

export type OrderInput = Omit<Order, "id" | "created_at" | "status">;
