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

  /* ===============================
     LOAD PRODUCT
  ================================ */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  /* ===============================
     CUSTOMIZATION HANDLERS
  ================================ */
  const toggleExtra = (value) => {
    setCustomization((prev) => ({
      ...prev,
      extras: prev.extras.includes(value)
        ? prev.extras.filter((x) => x !== value)
        : [...prev.extras, value],
    }));
  };

  const toggleSauce = (value) => {
    setCustomization((prev) => ({
      ...prev,
      sauces: prev.sauces.includes(value)
        ? prev.sauces.filter((x) => x !== value)
        : [...prev.sauces, value],
    }));
  };

  /* ===============================
     ACTIONS
  ================================ */
  const handleAddToCart = async () => {
    if (!user) return navigate("/login");

    try {
      setSaving(true);
      await axiosClient.post("/api/cart", {
        product: id,
        quantity,
        customization,
      });
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed", err);
      setError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setSaving(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) return navigate("/login");

    try {
      if (fav) {
        await axiosClient.delete(`/api/favorites/${id}`);
        setFav(false);
      } else {
        await axiosClient.post(`/api/favorites/${id}`);
        setFav(true);
      }
    } catch (err) {
      console.error("Favorite update failed", err);
      setError(err.response?.data?.message || "Failed to update favorite");
    }
  };

  /* ===============================
     LOADING / ERROR
  ================================ */
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
          {/* Left */}
          <div className="lg:col-span-2 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {product.imageUrl && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="text-sm text-slate-600">{product.description}</p>
              <p className="pt-1 text-xl font-bold text-slate-900">
                ₹{product.price}
              </p>
            </div>

            {/* Quantity */}
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
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Customization */}
            {customizationOptions.patties?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700">Patty</p>
                <div className="flex flex-wrap gap-2">
                  {customizationOptions.patties.map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, patty: p }))
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs ${
                        customization.patty === p
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {/* Right */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              ₹{product.price * quantity}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={saving}
              className={`w-full rounded-lg px-4 py-2 text-sm font-semibold ${
                saving
                  ? "bg-slate-200 text-slate-500"
                  : "bg-amber-500 text-slate-900 hover:bg-amber-400"
              }`}
            >
              {saving ? "Adding..." : "Add to cart"}
            </button>

            <button
              onClick={handleFavorite}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              {fav ? "Remove favorite" : "Add to favorites"}
            </button>

            {!user && (
              <Link
                to="/login"
                className="text-center text-xs font-medium text-amber-700"
              >
                Login to save preferences
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
