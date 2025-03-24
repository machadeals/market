import React from "react";
import { Box, Typography, Container } from "@mui/material";

const About = () => (
  <Container>
    <Box sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        About Machadeals
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Machadeals is a leading affiliate marketplace that connects buyers with
        the best deals across various platforms. Our mission is to help users
        find top-quality products at competitive prices.
      </Typography>
    </Box>
  </Container>
);

export default About;
