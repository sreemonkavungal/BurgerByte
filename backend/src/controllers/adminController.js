import Order from "../models/Order.js";
import User from "../models/User.js";

export const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status || order.status;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    if (req.body.refundStatus) order.refundStatus = req.body.refundStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update order" });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const report = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to build sales report" });
  }
};

