import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
const burl = process.env.REACT_APP_BACKURL;

const DisplaySettings = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    // ✅ Fetch existing carousel images from the backend
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(`${burl}/display/carousel`);

        // Add base URL to each image
        const fullImageUrls = response.data.map(
          (image) => `${burl}/display${image}`
        );

        setCarouselImages(fullImageUrls);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchCarouselImages();
  }, []);

  // ✅ Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // ✅ Upload Image
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image to upload.");
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setCarouselImages((prevImages) => [...prevImages, previewUrl]);
      }
    };
    try {
      const response = await axios.post(
        `${burl}/display/upload-carousel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCarouselImages((prevImages) => [
        ...prevImages,
        `${burl}${response.data.imageUrl}`,
      ]);
      handleFileChange();
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // ✅ Delete Image
  const handleDelete = async (imageUrl) => {
    const filename = imageUrl.split("/").pop(); // Extract filename from URL
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }
    try {
      await axios.delete(`${burl}/display/delete-carousel/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarouselImages(carouselImages.filter((img) => img !== imageUrl));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Display Settings (Manage Carousel)
      </Typography>

      {/* 🚀 Image Upload Section */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Input type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile}
            sx={{ ml: 2 }}
          >
            Upload Image
          </Button>
        </Grid>
      </Grid>

      {/* 🚀 Display Carousel Images with Delete Option */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Carousel Images
      </Typography>
      <Grid container spacing={2}>
        {carouselImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                image={image}
                alt={`Carousel ${index}`}
                sx={{ height: 200 }}
              />
              <CardActions>
                <IconButton color="error" onClick={() => handleDelete(image)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DisplaySettings;
