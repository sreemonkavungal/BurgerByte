import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addOrUpdateCartItem);
router.delete("/", clearCart);
router.delete("/:itemId", removeCartItem);

export default router;

