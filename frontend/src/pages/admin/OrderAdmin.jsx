import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.get("/api/admin/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load admin orders", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosClient.patch(
        `/api/admin/orders/${id}/status`,
        { status }
      );
      loadOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
      setError("Failed to update order status");
    }
  };

  const statuses = [
    "accepted",
    "rejected",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Orders
            </h1>
            <p className="text-sm text-slate-500">
              Review incoming orders and update their status in real time.
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
          <p className="text-sm text-slate-500">Loading orders…</p>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              No orders available
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New orders will appear here as customers place them.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Top row */}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order._id.slice(-6)}
                    </p>

                    {order.user && (
                      <p className="text-xs text-slate-600">
                        {order.user.name}
                        {order.user.email && (
                          <span className="text-slate-500">
                            {" "}({order.user.email})
                          </span>
                        )}
                      </p>
                    )}

                    <p className="text-xs text-slate-500">
                      Status:{" "}
                      <span className="font-semibold capitalize">
                        {order.status}
                      </span>
                    </p>

                    {order.createdAt && (
                      <p className="text-xs text-slate-400">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total amount</p>
                    <p className="text-xl font-bold text-slate-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Status controls */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Update status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => {
                      const active = order.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(order._id, s)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                            active
                              ? "border-amber-500 bg-amber-50 text-amber-700"
                              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
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
