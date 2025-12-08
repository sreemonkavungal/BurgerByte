import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () =>
    axiosClient
      .get("/cart")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load cart"));

  useEffect(() => {
    load();
  }, []);

  const removeItem = async (id) => {
    await axiosClient.delete(`/cart/${id}`);
    load();
  };

  const clearCart = async () => {
    await axiosClient.delete("/cart");
    load();
  };

  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Your Cart</h1>
            <p className="text-sm text-slate-500">
              Review your selections before placing the order.
            </p>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            ← Continue shopping
          </Link>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Empty state */}
        {!items.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              Your cart is empty
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add burgers from the menu to see them here.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            {/* Items list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty:{" "}
                      <span className="font-medium text-slate-700">
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

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </p>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Items
                </span>
                <span className="text-sm text-slate-700">
                  {items.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Total payable
                </span>
                <span className="text-xl font-bold text-slate-900">
                  ₹{total}
                </span>
              </div>

              <hr className="border-slate-200" />

              <button
                onClick={clearCart}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
