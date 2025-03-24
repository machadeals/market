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
        affiliate partners.
      </Typography>
    </Box>
  </Container>
);

export default TermsOfUse;
