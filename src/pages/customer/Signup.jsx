import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container, Paper, Typography, Box, TextField, Button
} from "@mui/material";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

export default function Signup() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orgIdFromLink = queryParams.get("orgId");   // <-- capture orgId from URL

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    orgId: orgIdFromLink || ""   // <-- pre-fill orgId
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", { ...formData, role: "ROLE_CUSTOMER" });
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Tenant Signup
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* OrgId is auto-filled from link */}
          <TextField
            label="Organization Name"
            name="orgname"
            value={formData.orgname}
            onChange={handleChange}
            fu
            InputProps={{ readOnly: true }}   // <-- prevent editing
          />
         
          <TextField label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
          <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
          <TextField label="Username *" name="username" value={formData.username} onChange={handleChange} required fullWidth />
          <TextField label="Password *" name="password" type="password" value={formData.password} onChange={handleChange} required fullWidth />
      
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
           <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} component={Link}
        to="login">
            LogIn
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
