import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AddUser() {
  const navigate = useNavigate();

  // Assume you store login info (including organizationId) in localStorage/sessionStorage after login
  const orgId = localStorage.getItem("organizationId");  

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "ROLE_ADMIN",          // ✅ default role
    oraganizationId: orgId || "", // ✅ auto-fill from login
    customerId: ""
  });

  useEffect(() => {
    if (orgId) {
      setFormData((prev) => ({ ...prev, oraganizationId: orgId }));
    }
  }, [orgId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:8082/api/v1/users/register", formData);
      alert("User created successfully!");
      navigate("/admindashboard/userProfile"); // redirect back to list
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          margin="normal"
        />
       
        {/* Role is fixed to ROLE_ADMIN, so no input field */}
        {/* OrganizationId is auto-filled from login, so no input field */}
   
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save User
        </Button>
      </form>
    </Box>
  );
}
