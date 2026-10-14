import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Paper, Typography, Box, TextField, Button } from "@mui/material";
import axios from "axios";

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orgIdFromLink = queryParams.get("orgId"); // capture orgId from URL

  const userRole = "ROLE_CUSTOMER";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    mobile: "",
    orgId: orgIdFromLink || "" // pre-fill orgId
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:9097/api/v1/customers/create/ROLE_CUSTOMER`,
        formData,
        {
          headers: { "X-Organization-Id": orgIdFromLink }
        }
      );
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Customer Signup
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* OrgId is auto-filled from link */}
          <TextField
            label="Organization Id"
            name="orgId"
            value={formData.orgId}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Username *"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Password *"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            component={Link}
            to="/login"
          >
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
