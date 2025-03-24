import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
const burl = process.env.REACT_APP_BACKURL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${burl}/auth/forgot-password`, {
        email,
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage("Error sending reset email. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleForgotPassword}>
          <TextField
            fullWidth
            label="Enter your email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Send Reset Link
          </Button>
        </form>
        {message && (
          <Typography variant="body2" color="textSecondary" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
