const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router();

const storageCarousel = multer.diskStorage({
  destination: (req, file, cb) => {
    const carouselPath = path.join(__dirname, "../images/carousel");
    if (!fs.existsSync(carouselPath)) {
      fs.mkdirSync(carouselPath, { recursive: true });
    }
    cb(null, carouselPath); // Save to "images/carousel" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const uploadCarousel = multer({ storage: storageCarousel });

// Directory for carousel images
const carouselDir = path.join(__dirname, "../images/carousel");

// Ensure directory exists
if (!fs.existsSync(carouselDir)) {
  fs.mkdirSync(carouselDir, { recursive: true });
}

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token is missing or invalid" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can perform this action" });
    }

    req.user = decoded; // Store decoded user info in request
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

// Serve static carousel images
router.use("/carousel-images", express.static(carouselDir));

// GET all carousel images
router.get("/carousel", (req, res) => {
  fs.readdir(carouselDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to read carousel images directory" });
    }

    // Generate URLs for the images
    const imageUrls = files.map((file) => `/carousel-images/${file}`);

    res.json(imageUrls);
  });
});

// Upload carousel image
router.post(
  "/upload-carousel",
  verifyAdmin,
  uploadCarousel.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ imageUrl: `/carousel-images/${req.file.filename}` });
  }
);

// Delete a carousel image
router.delete("/delete-carousel/:filename", verifyAdmin, (req, res) => {
  const filePath = path.join(carouselDir, req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "File deletion failed" });
    }
    res.json({ message: "File deleted successfully" });
  });
});

module.exports = router;
