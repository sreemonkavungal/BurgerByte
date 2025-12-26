import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const resetForm = () => setForm({ name: "", description: "" });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.get("/api/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/api/categories/${editingId}`, form);
      } else {
        await axiosClient.post("/api/categories", form);
      }
      setEditingId("");
      resetForm();
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId("");
    resetForm();
  };

  const remove = async (id) => {
    try {
      await axiosClient.delete(`/api/categories/${id}`);
      if (editingId === id) cancelEdit();
      loadCategories();
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Categories
          </h1>
          <p className="text-sm text-slate-500">
            Define and manage burger categories for your menu.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={save}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {editingId ? "Edit category" : "Add category"}
            </p>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-medium text-amber-700"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Category name"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold"
          >
            {editingId ? "Save changes" : "Add category"}
          </button>
        </form>

        {/* Table */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-auto">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Loading categories…
            </p>
          ) : categories.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No categories yet.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="px-4 py-3 font-semibold">
                      {c.name}
                    </td>
                    <td className="px-4 py-3">
                      {c.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-xs text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(c._id)}
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
