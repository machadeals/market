import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const AddAdmin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isGrandAdmin, setIsGrandAdmin] = useState(false);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole === "grand_admin") {
      setIsGrandAdmin(true);
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isGrandAdmin) {
      setMessage("Only the Grand Admin can add new admins!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        { username, email, password, role: "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding admin");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Add Admin
        </Typography>
        {isGrandAdmin ? (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Admin
            </Button>
          </form>
        ) : (
          <Typography color="error">
            You do not have permission to add admins.
          </Typography>
        )}
        {message && <Typography color="error">{message}</Typography>}
      </Box>
    </Container>
  );
};

export default AddAdmin;
