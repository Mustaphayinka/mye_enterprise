import { Link } from "react-router-dom";
import { useTitle } from "../components/Layout";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-4 text-2xl font-bold">We couldn't find that page</h1>
      <p className="mt-2 text-stone-500">It may have been moved, or the product is no longer available.</p>
      <Link to="/shop" className="btn-primary mt-8">Go to the shop</Link>
    </div>
  );
}
