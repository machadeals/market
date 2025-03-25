const express = require("express");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product_images", // Cloudinary folder
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

const upload = multer({ storage });

// Add a product (Admin Only) with Cloudinary image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add products" });
    }

    const newProduct = new Product({
      name: req.body.name.trim().toLowerCase(),
      price: req.body.price,
      category: req.body.category.trim(),
      quality: req.body.quality.trim().toLowerCase(),
      rating: req.body.rating,
      platform: req.body.platform.trim().toLowerCase(),
      affiliateLink: req.body.affiliateLink.trim(),
      description: req.body.description.trim(),
      inStock: req.body.inStock,
      discount: req.body.discount,
      tags: Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(",").map((tag) => tag.trim()),
      isFeatured: req.body.isFeatured,
      imageUrl: req.file.path || req.file.secure_url,
      cloudinaryId: req.file.filename || req.file.public_id,
      createdAt: new Date(),
    });

    await newProduct.save();

    res
      .status(200)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Stored Image URL:", product.imageUrl);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update products" });
    }

    const { id } = req.params;
    const updates = req.body;

    if (updates.tags) {
      try {
        updates.tags = JSON.parse(updates.tags);
      } catch (error) {
        return res.status(400).json({ message: "Invalid tags format" });
      }
    }

    // Handle image update if provided
    if (req.file) {
      const product = await Product.findById(id);
      if (product && product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId); // Delete old image from Cloudinary
      }

      updates.imageUrl = req.file.path; // New image URL
      updates.cloudinaryId = req.file.filename; // New public_id
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete products" });
    }

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId); // Delete image from Cloudinary
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
