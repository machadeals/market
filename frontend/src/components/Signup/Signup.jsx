import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://localhost:5000/auth/register`, formData);
      alert("Signup successful! Please log in.");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="username"
            label="Username"
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="password"
            type="password"
            label="Password"
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Signup
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
