const express = require("express");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images")); // Save images to "images" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});
const upload = multer({ storage });

// Add a product (Admin Only) with image upload
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
    console.log(req.body, req.headers);
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
      imageUrl: `/images/${req.file.filename}`, // Save the file path
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

// Serve static images
router.use("/images", express.static(path.join(__dirname, "../images")));

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Additional routes like Update, Delete, etc., remain unchanged but can now handle imageUrl if needed.
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    // Authorization check
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

    // Convert "tags" from JSON string back to an array if present
    if (updates.tags) {
      try {
        updates.tags = JSON.parse(updates.tags);
      } catch (error) {
        return res.status(400).json({ message: "Invalid tags format" });
      }
    }

    // Handle image update if provided
    if (req.file) {
      updates.imageUrl = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    // Find and update product
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

router.delete("/:id", async (req, res) => {
  try {
    // Authorization check
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

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Correct Image Path
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, "..", product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete file from server
      }
    }

    // Remove product from DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
