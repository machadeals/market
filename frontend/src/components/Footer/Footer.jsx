import React from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      textAlign: "center",
      py: 3,
      mt: "auto",
      backgroundColor: "#f8f8f8",
      borderTop: "1px solid #e7e7e7",
      width: "100%",
    }}
  >
    <Grid container spacing={3} justifyContent="center">
      {/* Contact Section */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: machadealsecom@gmail.com <br />
        </Typography>
      </Grid>

      {/* Social Media Section */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Follow Us
        </Typography>
        <Box>
          <IconButton
            color="primary"
            component="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook />
          </IconButton>
          <IconButton
            color="primary"
            component="a"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </IconButton>
          <IconButton
            color="primary"
            component="a"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </IconButton>
          <IconButton
            color="primary"
            component="a"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedIn />
          </IconButton>
        </Box>
      </Grid>
    </Grid>

    <Typography variant="body2" color="text.secondary">
      <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
      <Link to="/terms-of-use">Terms of Use</Link>
    </Typography>

    <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
      © 2025 Machadeals. All Rights Reserved.
    </Typography>
  </Box>
);

export default Footer;
