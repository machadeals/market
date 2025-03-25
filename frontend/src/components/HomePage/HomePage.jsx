import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import ProductCard from "../ProductCard/ProductCard"; // Ensure this component exists
const burl = process.env.REACT_APP_BACKURL;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(`${burl}/display/carousel`);

        // Add base URL to each image path
        const fullImageUrls = response.data.map((image) => `${image.url}`);

        setCarouselImages(fullImageUrls);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchCarouselImages();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${burl}/auth/user-role`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRole(response.data.role); // Securely store role
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${burl}/products`);
        setProducts(response.data);

        // Initialize visibility for each category
        const initialVisibility = {};
        response.data.forEach((product) => {
          if (!initialVisibility[product.category]) {
            initialVisibility[product.category] = 9; // Default to 9 products
          }
        });
        setVisibleProducts(initialVisibility);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSeeMore = (category) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [category]: prev[category] + 9, // Load 9 more products per click
    }));
  };

  const categories = [
    "All",
    "Clothing",
    "Electronics",
    "Home & Kitchen",
    "Beauty & Wellness",
    "Footwear",
    "Food & Beverages",
    "Sports & Fitness",
    "Toys & Baby Products",
    "Books & Stationery",
  ];

  const reviews = [
    "Great products! The quality exceeded my expectations, and the pricing is very reasonable. Highly recommend this site for all your shopping needs!",
    "Amazing service! The delivery was super quick, and the packaging was secure. I also loved the variety of products available.",
    "Will shop again! My experience was smooth from browsing to checkout. The product descriptions were accurate, and I got exactly what I wanted.",
  ];

  // const carouselImages = [
  //   "http://localhost:5000/products/images/c1.png",
  //   "http://localhost:5000/products/images/c2.jpg",
  //   "http://localhost:5000/products/images/c3.png",
  // ];

  return (
    <Box>
      {/* 🚀 Carousel Section */}
      <Carousel>
        {carouselImages.map((image, index) => (
          <Paper key={index} elevation={3}>
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                maxHeight: { xs: 200, sm: 300, md: 500 }, // Responsive height
                objectFit: "cover",
              }}
              image={image}
              alt={`Advertisement ${index + 1}`}
            />
          </Paper>
        ))}
      </Carousel>

      {/* 🚀 Category Bar */}
      <Grid
        container
        spacing={1}
        sx={{
          mt: 2,
          mb: 2,
          p: 1,
          bgcolor: "#f5f5f5",
          justifyContent: "center",
        }}
      >
        {categories.map((category) => (
          <Grid item xs={6} sm={4} md={2} key={category}>
            <Button
              fullWidth
              variant={selectedCategory === category ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Product Categories */}
      <Box sx={{ margin: 3 }}>
        <Typography variant="h5" gutterBottom>
          {selectedCategory === "All" ? "All Products" : selectedCategory}
        </Typography>
        <Grid container spacing={3}>
          {products
            .filter(
              (product) =>
                selectedCategory === "All" ||
                product.category === selectedCategory
            )
            .slice(0, visibleProducts[selectedCategory] || 9)
            .map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAdmin={role === "admin"}
              />
            ))}
        </Grid>
        {products.filter(
          (product) =>
            selectedCategory === "All" || product.category === selectedCategory
        ).length > (visibleProducts[selectedCategory] || 9) && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() =>
              setVisibleProducts((prev) => ({
                ...prev,
                [selectedCategory]: (prev[selectedCategory] || 9) + 9, // Add 9 more on click
              }))
            }
          >
            See More
          </Button>
        )}
      </Box>

      {/* 🚀 Customer Reviews */}
      <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h5" align="center" gutterBottom>
          What Our Customers Say
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {reviews.map((review, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="body1" align="center">
                    {review}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
