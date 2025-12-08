import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => setForm({ name: "", description: "" });

  const load = () =>
    axiosClient
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/categories/${editingId}`, form);
      } else {
        await axiosClient.post("/categories", form);
      }
      setEditingId("");
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || "" });
  };

  const cancelEdit = () => {
    setEditingId("");
    resetForm();
  };

  const remove = async (id) => {
    await axiosClient.delete(`/categories/${id}`);
    if (editingId === id) cancelEdit();
    load();
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
            <p className="text-sm text-slate-500">
              Define and manage burger categories for your menu.
            </p>
          </div>
        </div>

        {/* Error */}
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
              {editingId ? "Edit category" : "Add category"}
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
                placeholder="e.g. Signature Burgers"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <input
                placeholder="Short description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400 transition w-full sm:w-auto"
            >
              {editingId ? "Save changes" : "Add category"}
            </button>
          </div>
        </form>

        {/* Table card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 sm:text-sm">
                      {c.description || (
                        <span className="text-slate-400">No description</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(c._id)}
                        className="text-xs font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!categories.length && (
              <p className="py-4 text-center text-sm text-slate-500">
                No categories yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
