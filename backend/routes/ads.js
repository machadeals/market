const express = require("express");
const Ad = require("../models/Ads");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Add Ad (Admin Only)
// Create Ad route (only for admin)
router.post("/", async (req, res) => {
  try {
    // Check if the Authorization header exists and is correctly formatted
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the logged-in user is an admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create ads" });
    }

    // Proceed with ad creation
    const { title, imageUrl, link } = req.body;
    const newAd = new Ad({ title, imageUrl, link });
    await newAd.save();

    res.status(200).json({ message: "Ad created successfully", ad: newAd });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Ads
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
