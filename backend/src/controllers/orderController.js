import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Helper to calculate total and enrich items with price snapshots
const buildItemsWithPricing = async (items) => {
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));

  return items.map((item) => {
    const price = priceMap.get(item.product);
    if (price === undefined) throw new Error("Product not found");
    return {
      product: item.product,
      quantity: item.quantity || 1,
      price,
      customization: item.customization || {},
    };
  });
};

export const createOrder = async (req, res) => {
  try {
    const items = req.body.items || [];
    if (!items.length) return res.status(400).json({ message: "No items provided" });

    const itemsWithPrice = await buildItemsWithPricing(items);
    const totalAmount = itemsWithPrice.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: itemsWithPrice,
      totalAmount,
      paymentId: req.body.paymentId,
      paymentStatus: req.body.paymentStatus || "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to place order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.refundRequested) {
      return res.status(400).json({ message: "Refund already requested" });
    }
    order.refundRequested = true;
    order.refundStatus = "requested";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to request refund" });
  }
};

