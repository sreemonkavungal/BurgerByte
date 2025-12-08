import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    axiosClient
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"));

  useEffect(() => {
    load();
  }, []);

  const requestRefund = async (id) => {
    await axiosClient.post(`/orders/${id}/refund`);
    load();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-500">
              Track your recent orders and request refunds when needed.
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
        {!orders.length ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Place your first order and it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
              >
                {/* Top row: ID, date, total */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        Status:{" "}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        Payment:{" "}
                        <span className="ml-1 capitalize">
                          {order.paymentStatus}
                        </span>
                      </span>
                      {order.refundStatus !== "none" && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                          Refund:{" "}
                          <span className="ml-1 capitalize">
                            {order.refundStatus}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">
                      Total amount
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Items
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {order.items.map((item) => (
                      <li
                        key={item._id}
                        className="flex items-center justify-between text-xs sm:text-sm"
                      >
                        <span>
                          {item.product?.name}{" "}
                          <span className="text-slate-500">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="text-slate-900">
                          ₹{(item.price || item.product?.price || 0) * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                {!order.refundRequested && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => requestRefund(order._id)}
                      className="text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-600"
                    >
                      Request refund
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
