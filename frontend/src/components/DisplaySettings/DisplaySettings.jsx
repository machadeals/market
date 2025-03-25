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

  // Fetch carousel images
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(`${burl}/display/carousel`);
        setCarouselImages(response.data);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchCarouselImages();
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload Image
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

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

      const { imageUrl, publicId } = response.data;

      setCarouselImages((prevImages) => [
        ...prevImages,
        { url: imageUrl, public_id: publicId },
      ]);

      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // Delete Image
  const handleDelete = async (publicId) => {
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    try {
      console.log("Deleting image with public_id:", publicId);

      await axios.delete(
        `${burl}/display/delete-carousel/${encodeURIComponent(publicId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state by removing deleted image
      setCarouselImages((prevImages) =>
        prevImages.filter((img) => img.public_id !== publicId)
      );

      console.log("Image deleted successfully.");
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Display Settings (Manage Carousel)
      </Typography>

      {/* Image Upload Section */}
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

      {/* Display Carousel Images with Delete Option */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Carousel Images
      </Typography>
      <Grid container spacing={2}>
        {carouselImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                image={image.url}
                sx={{ height: 200 }}
              />
              <CardActions>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(image.public_id)}
                >
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
