import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const burl = process.env.REACT_APP_BACKURL;

const ProductForm = ({ isEdit }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    quality: "",
    rating: "",
    platform: "",
    affiliateLink: "",
    description: "",
    inStock: true,
    discount: "",
    tags: "",
    isFeatured: false,
  });
  const categories = [
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
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`${burl}/products/${id}`)
        .then((response) => {
          const productData = response.data;
          setProduct({
            ...productData,
            category: categories.includes(productData.category)
              ? productData.category
              : "", // Ensure category exists in the list
            tags: productData.tags?.join(", ") || "",
          });
          setImage(productData.imageUrl);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, [isEdit, id]);

  // const handleCategoryChange = (event) => {
  //   setCategory(event.target.value);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === "tags") {
        formData.append(
          key,
          JSON.stringify(value.split(",").map((tag) => tag.trim()))
        );
      } else {
        formData.append(key, value);
      }
    });

    if (image instanceof File) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("token"); // Assuming you store the JWT in localStorage

    try {
      if (isEdit) {
        await axios.put(`${burl}/products/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add Bearer token here
          },
        });
      } else {
        console.log("formdata", formData);
        await axios.post(`${burl}/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add Bearer token here
          },
        });
      }
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Error saving product");
      alert(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? "Edit Product" : "Add Product"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Price"
            margin="normal"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Category"
            margin="normal"
            select
            value={product.category || ""} // Ensure value is not undefined
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Quality"
            margin="normal"
            value={product.quality}
            onChange={(e) =>
              setProduct({ ...product, quality: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Rating"
            margin="normal"
            type="number"
            value={product.rating}
            onChange={(e) => setProduct({ ...product, rating: e.target.value })}
          />
          <TextField
            fullWidth
            label="Platform"
            margin="normal"
            value={product.platform}
            onChange={(e) =>
              setProduct({ ...product, platform: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Affiliate Link"
            margin="normal"
            value={product.affiliateLink}
            onChange={(e) =>
              setProduct({ ...product, affiliateLink: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={product.inStock}
                onChange={(e) =>
                  setProduct({ ...product, inStock: e.target.checked })
                }
              />
            }
            label="In Stock"
          />
          <TextField
            fullWidth
            label="Discount"
            margin="normal"
            value={product.discount}
            onChange={(e) =>
              setProduct({ ...product, discount: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            margin="normal"
            value={product.tags}
            onChange={(e) => setProduct({ ...product, tags: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={product.isFeatured}
                onChange={(e) =>
                  setProduct({ ...product, isFeatured: e.target.checked })
                }
              />
            }
            label="Featured"
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
          {image && (
            <Typography variant="body2" mt={1}>
              {image instanceof File ? image.name : "Current Image: " + image}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProductForm;
