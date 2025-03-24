import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const burl = process.env.REACT_APP_BACKURL;

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${burl}/auth/login`, {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      localStorage.setItem("role", userRole);
      onLogin(userRole);

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
            Login
          </Button>
        </form>
        <Box mt={2}>
          <Link href="/forgot-password" variant="body2">
            Forgot Password?
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
