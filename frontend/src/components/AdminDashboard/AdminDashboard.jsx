import React from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate("/products")}
          >
            View Products
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate("/admin/add-product")}
          >
            Add Product
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/admin/add-admin")}
          >
            Add Admin
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="info"
            onClick={() => navigate("/admin/display-settings")}
          >
            Display Settings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
