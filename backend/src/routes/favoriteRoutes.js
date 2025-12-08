import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.use(protect);

router.get("/", getFavorites);
router.post("/:productId", addFavorite);
router.delete("/:productId", removeFavorite);

export default router;

