import User from "../models/User.js";
import Product from "../models/Product.js";

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const productId = req.params.productId;
    const exists = await Product.findById(productId);
    if (!exists) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    if (!user.favorites.find((id) => id.toString() === productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    await user.populate("favorites");
    res.status(201).json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();
    await user.populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

