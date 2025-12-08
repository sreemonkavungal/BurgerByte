import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }, // snapshot of price
  customization: {
    patty: String,
    extras: [String],
    sauces: [String],
    notes: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentId: String,       // from gateway
    refundRequested: { type: Boolean, default: false },
    refundStatus: {
      type: String,
      enum: ["none", "requested", "processing", "completed", "rejected"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
