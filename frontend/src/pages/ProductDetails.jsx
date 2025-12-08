import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [customization, setCustomization] = useState({
    patty: "",
    extras: [],
    sauces: [],
    notes: "",
  });

  useEffect(() => {
    axiosClient
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Failed to load product"));
  }, [id]);

  const toggleExtra = (value) => {
    setCustomization((prev) => {
      const extras = prev.extras.includes(value)
        ? prev.extras.filter((x) => x !== value)
        : [...prev.extras, value];
      return { ...prev, extras };
    });
  };

  const toggleSauce = (value) => {
    setCustomization((prev) => {
      const sauces = prev.sauces.includes(value)
        ? prev.sauces.filter((x) => x !== value)
        : [...prev.sauces, value];
      return { ...prev, sauces };
    });
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    try {
      setSaving(true);
      await axiosClient.post("/cart", { product: id, quantity, customization });
      navigate("/cart");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setSaving(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) return navigate("/login");
    try {
      if (fav) {
        await axiosClient.delete(`/favorites/${id}`);
        setFav(false);
      } else {
        await axiosClient.post(`/favorites/${id}`);
        setFav(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update favorite");
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : (
              <p className="text-sm text-slate-600">Loading product…</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { customizationOptions = {} } = product;

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: image + details + customization */}
          <div className="lg:col-span-2 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Image */}
            {product.imageUrl && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            {/* Basic info */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Burger
              </p>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                {product.description}
              </p>
              <p className="pt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                ₹{product.price}
              </p>
            </div>

            {/* Quantity + notes */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  value={customization.notes}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                  placeholder="Any special instructions? (optional)"
                />
              </div>
            </div>

            {/* Patty options */}
            {customizationOptions.patties?.length ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Patty</p>
                <div className="flex flex-wrap gap-2">
                  {customizationOptions.patties.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, patty: p }))
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                        customization.patty === p
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Extras */}
            {customizationOptions.extras?.length ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Extras</p>
                <div className="flex flex-wrap gap-2">
                  {customizationOptions.extras.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => toggleExtra(e)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                        customization.extras.includes(e)
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Sauces */}
            {customizationOptions.sauces?.length ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Sauces</p>
                <div className="flex flex-wrap gap-2">
                  {customizationOptions.sauces.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSauce(s)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                        customization.sauces.includes(s)
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {/* Right: summary + actions */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Summary
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{product.price * quantity}
              </p>
              <p className="text-xs text-slate-500">
                Includes your selected patty, extras, and sauces. Taxes and
                additional charges (if any) are applied at final billing in the
                POS.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={saving}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  saving
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "bg-amber-500 text-slate-900 hover:bg-amber-400"
                }`}
              >
                {saving ? "Adding..." : "Add to cart"}
              </button>

              <button
                type="button"
                onClick={handleFavorite}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {fav ? "Remove favorite" : "Add to favorites"}
              </button>

              {!user && (
                <Link
                  to="/login"
                  className="mt-1 text-center text-xs font-medium text-amber-700 hover:text-amber-600"
                >
                  Login to save preferences
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
