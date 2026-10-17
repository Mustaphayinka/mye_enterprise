import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { About, Contact } from "./pages/InfoPages";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import Shop from "./pages/Shop";

// The owner's admin area is loaded only when someone opens /admin.
const AdminLayout = lazy(() => import("./admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const Login = lazy(() => import("./admin/Login"));
const Products = lazy(() => import("./admin/Products"));
const ProductForm = lazy(() => import("./admin/ProductForm"));
const Categories = lazy(() => import("./admin/Categories"));
const Orders = lazy(() => import("./admin/Orders"));
const SettingsPage = lazy(() => import("./admin/SettingsPage"));

const Loading = () => <div className="flex min-h-[50vh] items-center justify-center text-stone-500">Loading...</div>;

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <AuthProvider>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:slug" element={<ProductPage />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="admin/login" element={<Login />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Products />} />
                  <Route path="products/new" element={<ProductForm key="new" />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
