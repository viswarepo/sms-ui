import { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {
  const [formData, setFormData] = useState({ identifier: "" }); // username or email
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ identifier: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/forgot-password", {
        identifier: formData.identifier
      });
      setMessage(data.message || "Check your email for the reset link.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to process request");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username or Email"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained" color="primary">
          Send Reset Link
        </Button>
        <Button type="submit" variant="contained" color="primary" 
        component={Link}
            to="/login" >
          LogIn
        </Button>
      </Box>

      {message && (
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
}

export default ForgotPassword;
