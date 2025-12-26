import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.get("/api/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleBadgeClasses = (role) => {
    if (role === "admin") {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border border-slate-200";
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500">
              View registered customers and admins in the system.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-sm text-slate-500">Loading users…</p>
        )}

        {/* Empty state */}
        {!loading && users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              No users found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Users will appear here once they register or place an order.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">
                    {u.name || "Unnamed user"}
                  </p>
                  {u.email && (
                    <p className="text-xs text-slate-500 sm:text-sm">
                      {u.email}
                    </p>
                  )}
                </div>

                <span
                  className={`ml-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${getRoleBadgeClasses(
                    u.role
                  )}`}
                >
                  {u.role || "user"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
