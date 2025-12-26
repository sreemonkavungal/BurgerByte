import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosClient.get("/api/cart");
        setCart(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load cart", err);
        setError("Failed to load cart");
      }
    };

    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/api/orders", {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          customization: item.customization,
        })),
        paymentStatus: "paid", // demo flow
      });

      await axiosClient.delete("/api/cart");
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed", err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
            <p className="text-sm text-slate-500">
              Review your order and confirm to place it.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Left: Items */}
          <div className="space-y-4">
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {!cart.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <p className="text-base font-medium text-slate-800">
                  No items in cart
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add burgers to your cart before checking out.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-700">
                  Order summary
                </h2>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-slate-900">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty:{" "}
                          <span className="font-semibold text-slate-700">
                            {item.quantity}
                          </span>
                        </p>

                        {item.customization?.patty && (
                          <p className="text-xs text-slate-500">
                            Patty:{" "}
                            <span className="font-medium text-slate-700">
                              {item.customization.patty}
                            </span>
                          </p>
                        )}

                        {item.customization?.extras?.length > 0 && (
                          <p className="text-xs text-slate-500">
                            Extras:{" "}
                            <span className="font-medium text-slate-700">
                              {item.customization.extras.join(", ")}
                            </span>
                          </p>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-900">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Payment */}
          <div className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Payment summary
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Total payable
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  ₹{total}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              This demo assumes payment is successful and marks the order as{" "}
              <span className="font-medium">paid</span>.
            </p>

            <button
              onClick={placeOrder}
              disabled={loading || !cart.length}
              className={`w-full rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
                loading || !cart.length
                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                  : "bg-amber-500 text-slate-900 hover:bg-amber-400"
              }`}
            >
              {loading ? "Placing..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
