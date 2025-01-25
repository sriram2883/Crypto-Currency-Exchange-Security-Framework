import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const API_BASE_URL = "http://localhost:5000/api/auth";

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (event) => {
    event.preventDefault();

    // Trim values to handle spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!trimmedEmail || !trimmedPassword) {
      setMessage("Email and password are required!");
      setErrorOpen(true);
      return;
    }

    try {
      if (isLogin) {
        // Login API call
        const response = await axios.post(`${API_BASE_URL}/login`, {
          username: trimmedEmail,
          password: trimmedPassword,
        });

        const { token } = response.data;

        // Store token in localStorage
        localStorage.setItem("authToken", token);
        onLoginSuccess(); // Trigger login success callback
      } else {
        // Register API call
        await axios.post(`${API_BASE_URL}/register`, {
          username: trimmedEmail,
          password: trimmedPassword,
        });

        setMessage("Registration successful! Please log in.");
        setSuccessOpen(true); // Open success Snackbar
        setIsLogin(true); // Switch to login view
      }

      // Clear form
      setEmail("");
      setPassword("");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : isLogin
          ? "Login failed! Please check your credentials."
          : "Registration failed! Please try again.";
      setMessage(errorMessage);
      setErrorOpen(true); // Open error Snackbar
    }
  };

  const handleClose = () => {
    setErrorOpen(false);
    setSuccessOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "2rem",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {isLogin ? "Login" : "Register"}
        </Typography>
        <Box component="form" onSubmit={handleAuth} sx={{ width: "100%", mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            {isLogin ? "Login" : "Register"}
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: "pointer", color: "blue" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Typography>
      </Box>

      {/* Snackbar for error messages */}
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {message}
        </Alert>
      </Snackbar>

      {/* Snackbar for success messages */}
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Auth;
