import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const burl = process.env.REACT_APP_BACKURL;

const ProductCard = ({ product, isAdmin }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${burl}/products/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Product deleted successfully!");
        window.location.reload(); // Refresh to update product list
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <Grid item xs={6} sm={4} md={3}>
      <Card
        sx={{
          maxWidth: 320,
          margin: "auto",
          position: "relative",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        {/* Admin Edit Button (Top Right) */}
        {isAdmin && (
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5, color: "black" }}
            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
          >
            <EditIcon />
          </IconButton>
        )}
        {/* Discount Badge (Top Left) */}
        {product.discount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "red",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            {product.discount}% OFF
          </Box>
        )}

        {/* Product Image */}
        <CardMedia
          component="img"
          sx={{
            height: 300,
            objectFit: "contain",
            width: "100%",
            cursor: "pointer",
            background: "#f5f5f5",
          }}
          image={`${product.imageUrl}`}
          alt={product.name}
          onClick={() => navigate(`/product/${product._id}`)}
        />
        <CardContent
          sx={{
            height: 195,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Product Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2, // Limits to 2 lines
              overflow: "hidden",
              textOverflow: "ellipsis",
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => navigate(`/product/${product._id}`)}
          >
            {product.name}
          </Typography>

          {/* Price & Rating */}
          <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
            ₹{product.price}
          </Typography>
          <Typography variant="body2">{`Rating: ${product.rating} ⭐`}</Typography>

          {/* Buy Now Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2, fontSize: "1rem", fontWeight: "bold" }}
            onClick={() => window.open(product.affiliateLink, "_blank")}
          >
            Buy Now
          </Button>

          {/* Admin Delete Button (Below Buy Now) */}
          {isAdmin && (
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 1, fontSize: "1rem", fontWeight: "bold" }}
              onClick={handleDelete}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Delete
            </Button>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
