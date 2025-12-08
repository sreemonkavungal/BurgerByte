import User from "../models/User.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addOrUpdateCartItem = async (req, res) => {
  try {
    const { product, quantity = 1, customization = {} } = req.body;
    if (!product) return res.status(400).json({ message: "Product is required" });
    const exists = await Product.findById(product);
    if (!exists) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex(
      (item) =>
        item.product.toString() === product &&
        JSON.stringify(item.customization || {}) === JSON.stringify(customization || {})
    );

    if (idx >= 0) {
      user.cart[idx].quantity = quantity;
      user.cart[idx].customization = customization;
    } else {
      user.cart.push({ product, quantity, customization });
    }

    await user.save();
    await user.populate("cart.product");
    res.status(201).json(user.cart);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update cart" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((item) => item._id.toString() !== req.params.itemId);
    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

