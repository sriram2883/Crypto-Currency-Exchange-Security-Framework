import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Dialog } from "@mui/material";
import axios from "axios";
import Login from "./Login";
import { use } from "react";

const API_BASE_URL = "http://localhost:5000/api/auth";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);
  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      // Logout Logic
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Call server to log out
          await axios.post(
            `${API_BASE_URL}/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        // Clear localStorage and state
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate("/home");
      } catch (error) {
        console.error("Logout failed:", error);
        // Handle logout error (optional)
      }
    } else {
      setLoginOpen(true); // Open the login dialog
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => handleNavigation("/home")}
              selected={isActive("/home")}
            >
              Home
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/market")}
              selected={isActive("/market")}
            >
              Market
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/portfolio")}
              selected={isActive("/portfolio")}
            >
              Portfolio
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/about")}
              selected={isActive("/about")}
            >
              About
            </MenuItem>
          </Menu>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CryptoExchange
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color={isActive("/home") ? "secondary" : "inherit"}
              onClick={() => navigate("/home")}
            >
              Home
            </Button>
            <Button
              color={isActive("/market") ? "secondary" : "inherit"}
              onClick={() => navigate("/market")}
            >
              Market
            </Button>
            <Button
              color={isActive("/portfolio") ? "secondary" : "inherit"}
              onClick={() => navigate("/portfolio")}
            >
              Portfolio
            </Button>
            <Button
              color={isActive("/about") ? "secondary" : "inherit"}
              onClick={() => navigate("/about")}
            >
              About
            </Button>
          </Box>
          <Button color="inherit" onClick={handleLoginLogout}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dialog for Login */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <Login onLoginSuccess={handleLoginSuccess} />
      </Dialog>
    </>
  );
}

export default NavBar;
