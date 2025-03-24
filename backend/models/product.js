const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    quality: { type: String, required: true }, // Example: "New", "Refurbished"
    rating: { type: Number, required: true, min: 0, max: 5 },
    platform: { type: String, required: true }, // Example: "Amazon", "Flipkart"
    affiliateLink: { type: String, required: true },
    description: { type: String, required: false }, // Optional: Detailed info
    inStock: { type: Boolean, default: true }, // Stock availability
    discount: { type: Number, default: 0 }, // Percentage discount
    tags: { type: [String], default: [] }, // Array of tags for searching
    isFeatured: { type: Boolean, default: false }, // Featured status
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
