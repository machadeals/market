import React from "react";
import { Box, Typography, Container } from "@mui/material";

const TermsOfUse = () => (
  <Container>
    <Box sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Terms of Use
      </Typography>
      <Typography variant="body1" color="text.secondary">
        By using Machadeals, you agree to comply with our terms and conditions.
        We are not responsible for the products or services provided by
        affiliate partners. When you click on 'Buy Now', you will be redirected
        to external affiliate websites, such as Amazon or Meesho, where you can
        complete your purchase. Please note that these are affiliate links, and
        we may earn a small commission if you make a purchase through these
        links, at no extra cost to you.
      </Typography>
    </Box>
  </Container>
);

export default TermsOfUse;
