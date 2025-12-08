import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  updateOrderStatus,
  getSalesReport,
  getUsers,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/reports/sales", getSalesReport);
router.get("/users", getUsers);

export default router;