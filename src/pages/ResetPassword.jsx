import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const orgId = localStorage.getItem("organizationId");
  const userRole = localStorage.getItem("role");

  // Capture username from query string (?username=xyz)
  const queryParams = new URLSearchParams(location.search);
  const usernameFromLink = queryParams.get("username") || "";

  const [formData, setFormData] = useState({
    username: username,
    orgId: orgId,
    newPassword: "",
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Call backend reset password API
      const { data } = await api.post(
        "http://localhost:8090/api/v1/users/reset-password/"+username,
        {
          username: formData.username,
          orgId:formData.orgId,
          newPassword: formData.newPassword
        }
      );

      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      console.error("Reset failed:", err);
      const backendMessage =
        err.response?.data?.message || "Failed to reset password";
      setErrorMessage(backendMessage);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Username auto-filled and read-only */}
          <TextField
            label="Organization Id"
            name="orgId"
            value={formData.orgId}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          {/* Username auto-filled and read-only */}
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ minLength: 8 }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ minLength: 8 }}
          />

          {errorMessage && (
            <Typography color="error" variant="body2" align="center">
              {errorMessage}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
