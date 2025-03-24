require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adRoutes = require("./routes/ads");
const productRoutes = require("./routes/products");
const carouselRoutes = require("./routes/carousel");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://market-frontend-lovat.vercel.app", // Allow frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true  // Allow cookies, authentication headers
}));
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/ads", adRoutes);
app.use("/products", productRoutes);
app.use("/display", carouselRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process if DB connection fails
  });
