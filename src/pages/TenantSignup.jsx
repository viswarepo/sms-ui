import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button
} from "@mui/material";
import axios from "axios"; // use axios directly

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orgIdFromLink = queryParams.get("orgId"); // capture orgId from URL

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    mobile: "",
    orgname: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(
      "http://localhost:8090/api/v1/org/register/ROLE_OWNER",
      formData
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
          Tenant Signup
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* OrgId auto-filled from link */}
          <TextField
            label="Organization Name"
            name="orgname"
            value={formData.orgname}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: true }}
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            component={Link}
            to="/login"
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
