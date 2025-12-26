import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "",
    isAvailable: true,
  });

  const resetForm = () =>
    setForm({
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
      category: "",
      isAvailable: true,
    });

  /* ================= LOAD DATA ================= */

  const loadProducts = async () => {
    const res = await axiosClient.get("/api/products?all=true");
    return Array.isArray(res.data) ? res.data : [];
  };

  const loadCategories = async () => {
    const res = await axiosClient.get("/api/categories");
    return Array.isArray(res.data) ? res.data : [];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesData] = await Promise.all([
          loadProducts(),
          loadCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load products or categories", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= CRUD ================= */

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
        await axiosClient.put(`/api/products/${editingId}`, form);
      } else {
        await axiosClient.post("/api/products", form);
      }
      cancelEdit();
      setProducts(await loadProducts());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const remove = async (id) => {
    try {
      await axiosClient.delete(`/api/products/${id}`);
      if (editingId === id) cancelEdit();
      setProducts(await loadProducts());
    } catch {
      setError("Failed to delete product");
    }
  };

  /* ================= FILTER ================= */

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

  /* ================= UI ================= */

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Product Management
            </h1>
            <p className="text-sm text-slate-500">
              Add, edit, or remove products and assign categories.
            </p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-sm text-slate-500">Loading products…</p>
        )}

        {/* FORM */}
        <form
          onSubmit={save}
          className="rounded-2xl border bg-white p-5 shadow-sm space-y-4"
        >
          <p className="text-sm font-semibold">
            {editingId ? "Edit product" : "Add new product"}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              required
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: Number(e.target.value) }))
              }
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, imageUrl: e.target.value }))
              }
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm((p) => ({ ...p, isAvailable: e.target.checked }))
              }
            />
            Available
          </label>

          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold"
          >
            {editingId ? "Save changes" : "Add product"}
          </button>
        </form>

        {/* TABLE */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-auto">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No products found.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">
                      {p.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3">
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p._id)}
                        className="text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
