import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
  Container,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const burl = process.env.REACT_APP_BACKURL;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${burl}/products/${id}`);
        setProduct(response.data);

        const allProductsResponse = await axios.get(`${burl}/products`);
        const filtered = allProductsResponse.data.filter(
          (prod) => prod.category === response.data.category && prod._id !== id
        );
        setSimilarProducts(filtered);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when id changes
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Typography variant="h6" color="error" textAlign="center">
        Product not found.
      </Typography>
    );
  }

  const { name, price, description, affiliateLink, rating, imageUrl } = product;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Product Title */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          {name}
        </Typography>

        {/* Product Image */}
        <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="400"
            image={`${imageUrl}`}
            alt={name}
            sx={{ objectFit: "contain", background: "#f5f5f5" }}
          />
        </Card>

        {/* Product Information */}
        <Card sx={{ mt: 3, p: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              Price: ₹{price}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mt: 1, fontSize: "1.1rem" }}
            >
              <strong>Rating:</strong> {rating} ⭐
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.7, fontSize: "1.1rem" }}
            >
              <strong>Why Choose {name}?</strong> <br />
              {description} <br />
              This {name} is highly rated for its quality and performance.
              Whether you're a first-time buyer or a seasoned user, it offers
              incredible value for money. Order yours today and experience the
              difference!
            </Typography>

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
              onClick={() => window.open(affiliateLink, "_blank")}
            >
              🔥 Buy Now – Limited Stock Available!
            </Button>
          </CardContent>
        </Card>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Similar Products
            </Typography>
            <Grid container spacing={3}>
              {similarProducts.map((prod) => (
                <Grid item xs={12} sm={6} md={4} key={prod._id}>
                  <Card
                    sx={{ cursor: "pointer", boxShadow: 2, borderRadius: 2 }}
                    onClick={() => navigate(`/product/${prod._id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${prod.imageUrl}`}
                      alt={prod.name}
                      sx={{ objectFit: "contain", background: "#f5f5f5" }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {prod.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ textAlign: "center" }}
                      >
                        ${prod.price} | ⭐ {prod.rating}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetails;
