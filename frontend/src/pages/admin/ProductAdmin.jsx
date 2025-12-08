import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "",
    isAvailable: true,
  });
  const [error, setError] = useState("");

  const resetForm = () =>
    setForm({
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
      category: "",
      isAvailable: true,
    });

  const loadProducts = () =>
    axiosClient
      .get("/products?all=true")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to load products"));

  const loadCategories = () =>
    axiosClient
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      category: product.category?._id || "",
      isAvailable: product.isAvailable ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId("");
    resetForm();
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/products/${editingId}`, form);
      } else {
        await axiosClient.post("/products", form);
      }
      cancelEdit();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const remove = async (id) => {
    await axiosClient.delete(`/products/${id}`);
    if (editingId === id) cancelEdit();
    loadProducts();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.name?.toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header + search */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Product management
            </h1>
            <p className="text-sm text-slate-500">
              Add, edit, or remove products. Attach images, prices, and
              categories.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Search
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or category"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Form card */}
        <form
          onSubmit={save}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-900">
              {editingId ? "Edit product" : "Add new product"}
            </p>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-medium text-amber-700 hover:text-amber-600"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Image URL
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
            />
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    isAvailable: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              Available
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400 transition w-full sm:w-auto"
            >
              {editingId ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-12 w-12 rounded-md border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-[11px] text-slate-500">
                            No image
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-slate-900">
                            {p.name}
                          </p>
                          <p className="line-clamp-2 text-xs text-slate-500">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {p.category?.name || (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      ₹{p.price}
                    </td>
                    <td className="px-4 py-3">
                      {p.isAvailable ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p._id)}
                        className="text-xs font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!filtered.length && (
              <p className="py-4 text-center text-sm text-slate-500">
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
