import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../lib/types";
import { useStore } from "./StoreContext";

interface CartLine { productId: string; qty: number }
export interface CartItem { product: Product; qty: number }

interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const KEY = "mye-cart-v1";
const MAX_QTY = 99;
const CartContext = createContext<CartState | null>(null);

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(l => typeof l.productId === "string" && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useStore();
  const [lines, setLines] = useState<CartLine[]>(loadLines);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* cart just won't persist */
    }
  }, [lines]);

  // Prices and names always come from the live product list, so a price change by the owner
  // is reflected in carts. Products that were deleted or sold out are hidden (the saved line is kept, so
  // nothing is lost while the product list is still loading).
  const value = useMemo<CartState>(() => {
    const byId = new Map(products.map(p => [p.id, p]));
    const items = lines
      .map(l => ({ product: byId.get(l.productId)!, qty: l.qty }))
      .filter(i => i.product && i.product.in_stock);
    const change = (fn: (ls: CartLine[]) => CartLine[]) => setLines(ls => fn(ls));
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (p, qty = 1) =>
        change(ls => {
          const found = ls.find(l => l.productId === p.id);
          return found
            ? ls.map(l => (l.productId === p.id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
            : [...ls, { productId: p.id, qty: Math.min(MAX_QTY, qty) }];
        }),
      setQty: (id, qty) =>
        change(ls => (qty <= 0 ? ls.filter(l => l.productId !== id) : ls.map(l => (l.productId === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)))),
      remove: id => change(ls => ls.filter(l => l.productId !== id)),
      clear: () => setLines([]),
    };
  }, [lines, products, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
