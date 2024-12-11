import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Dialog } from "@mui/material";
import Login from "./Login";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.clear();
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
            <MenuItem onClick={() => handleNavigation("/home")}>Home</MenuItem>
            <MenuItem onClick={() => handleNavigation("/market")}>Market</MenuItem>
            <MenuItem onClick={() => handleNavigation("/portfolio")}>Portfolio</MenuItem>
            <MenuItem onClick={() => handleNavigation("/about")}>About</MenuItem>
          </Menu>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CryptoExchange
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" onClick={() => navigate("/home")}>Home</Button>
            <Button color="inherit" onClick={() => navigate("/market")}>Market</Button>
            <Button color="inherit" onClick={() => navigate("/portfolio")}>Portfolio</Button>
            <Button color="inherit" onClick={() => navigate("/about")}>About</Button>
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
