import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      const res = await axiosClient.get("/api/favorites");
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load favorites", err);
      setError("Failed to load favorites");
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await axiosClient.delete(`/api/favorites/${id}`);
      loadFavorites();
    } catch (err) {
      console.error("Failed to remove favorite", err);
      setError("Failed to remove favorite");
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Favorites</h1>
            <p className="text-sm text-slate-500">
              Your saved burgers for quick ordering.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Empty state */}
        {!favorites.length ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              No favourites yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Mark burgers as favourites from the menu or product details page.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p) => (
              <div
                key={p._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Image */}
                {p.imageUrl && (
                  <Link
                    to={`/product/${p._id}`}
                    className="relative h-40 w-full overflow-hidden"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  </Link>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                  <Link
                    to={`/product/${p._id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-amber-600 sm:text-base"
                  >
                    {p.name}
                  </Link>

                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                      {p.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 sm:text-base">
                      ₹{p.price}
                    </span>
                    <button
                      onClick={() => removeFavorite(p._id)}
                      className="text-xs font-medium text-red-600 hover:text-red-500 sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
