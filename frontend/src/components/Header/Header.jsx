import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  InputBase,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    onLogout();
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/products?search=${searchQuery.trim().toLowerCase()}`);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
        >
          {/* Company Name */}
          <Typography variant="h6" sx={{ fontWeight: "bold", flexShrink: 0 }}>
            Macha Deals
          </Typography>

          {/* Full-Width Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "white",
              borderRadius: "20px",
              padding: "4px 10px",
              flex: 1, // Makes it occupy full available space
              maxWidth: "600px", // Set a reasonable max width
            }}
          >
            <SearchIcon color="action" />
            <InputBase
              placeholder="Search products..."
              sx={{ ml: 1, flex: 1 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </Box>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button component={Link} to="/" color="inherit">
              Home
            </Button>
            <Button component={Link} to="/products" color="inherit">
              Products
            </Button>
            <Button component={Link} to="/about" color="inherit">
              About
            </Button>
            <Button component={Link} to="/terms-of-use" color="inherit">
              Terms of Use
            </Button>
            {isLoggedIn ? (
              <>
                <Button component={Link} to="/admin" color="inherit">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            )}
          </Stack>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            color="inherit"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/products"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/about"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="About" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/terms-of-use"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="Terms of Use" />
          </ListItem>

          {isLoggedIn ? (
            <>
              <ListItem
                button
                component={Link}
                to="/admin"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
