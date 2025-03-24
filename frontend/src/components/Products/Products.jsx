import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Container, Typography } from "@mui/material";
import ProductCard from "../ProductCard/ProductCard";
const burl = process.env.REACT_APP_BACKURL;

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${burl}/auth/user-role`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch role");
        }

        const data = await response.json();
        setRole(data.role); // Securely store role
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    fetch(`${burl}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        filterProducts(data);
      });
  }, [location.search]);

  const filterProducts = (data) => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    if (searchQuery) {
      // Split the search query into individual words
      const searchWords = searchQuery.split(" ");

      const filtered = data.filter((product) => {
        // Convert product name, description, and tags to lowercase for comparison
        const productName = product.name.toLowerCase();
        const productDescription = product.description.toLowerCase();
        const productTags = product.tags.map((tag) => tag.toLowerCase());

        // Check if at least one search word exists in tags, name, or description
        return searchWords.some(
          (word) =>
            productTags.some((tag) => tag.includes(word)) || // Match in tags
            productName.includes(word) || // Match in name
            productDescription.includes(word) // Match in description
        );
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(data);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6" color="error">
          No products found for this tag.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdmin={role === "admin"}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Products;
