import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isAvailable: { type: Boolean, default: true },

    // customization options
    customizationOptions: {
      patties: [String], // e.g. ["Veg", "Chicken", "Beef"]
      extras: [String], // e.g. ["Cheese", "Bacon", "Onion Rings"]
      sauces: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
