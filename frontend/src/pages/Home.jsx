import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient
      .get("/api/products")
      .then((res) => setProducts(res.data || []))
      .catch(() => setError("Failed to load products"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        {/* Hero section */}
        <section className="grid gap-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white shadow-lg md:grid-cols-2 md:px-10 md:py-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              BurgerByte
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Build your perfect burger,
              <br />
              <span className="text-amber-400">in just a few clicks.</span>
            </h1>
            <p className="text-sm text-slate-200 sm:text-base">
              Choose your burger, customise patties, extras, and sauces, then
              place your order directly from this POS-friendly interface.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-md hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                View Cart
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Order History
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900/70 p-5 shadow-inner backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Menu snapshot
              </p>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-sm text-slate-300">
                  Items available to order
                </p>
                <p className="text-2xl font-bold text-amber-400">
                  {products.length}
                </p>
              </div>
              <hr className="my-4 border-slate-700" />
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• Browse burgers below</li>
                <li>• Customise them on the next screen</li>
                <li>• Add to cart and place order</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Products header */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Popular picks
              </h2>
              <p className="text-xs text-slate-500 sm:text-sm">
                Select a burger to customise and order.
              </p>
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              {products.length} item{products.length === 1 ? "" : "s"} on the
              menu
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {p.imageUrl && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {p.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">
                    {p.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      ₹{p.price}
                    </p>
                    <span className="text-[11px] font-medium text-amber-600">
                      Customise →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
