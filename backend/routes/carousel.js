const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "carousel_images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can perform this action" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

// Upload carousel image
router.post(
  "/upload-carousel",
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "No image provided" });
      }

      res.json({ imageUrl: req.file.path, publicId: req.file.filename });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);

// Get all carousel images
router.get("/carousel", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:carousel_images")
      .sort_by("created_at", "desc")
      .max_results(10)
      .execute();

    const images = result.resources.map((file) => ({
      url: file.secure_url,
      public_id: file.public_id, // Ensure correct public_id
    }));

    res.json(images);
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    res.status(500).json({ error: "Failed to fetch carousel images" });
  }
});

// Delete a carousel image by public ID
router.delete("/delete-carousel/:publicId", verifyAdmin, async (req, res) => {
  try {
    let { publicId } = req.params;

    // Ensure publicId is correctly formatted
    if (!publicId.startsWith("carousel_images/")) {
      publicId = `carousel_images/${publicId}`;
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res
        .status(400)
        .json({ message: "Failed to delete image. It may not exist." });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Deletion Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
