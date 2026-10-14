import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.accessToken);
      
      // ✅ Save fields
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("organizationId", res.data.organizationId);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("customerId", res.data.customerId);
      localStorage.setItem("organizationName", res.data.organizationName);

      console.log("customer id==>",localStorage.getItem("customerId"))

      console.log("organizationId==>",localStorage.getItem("organizationId"))
      console.log("organizationName==>",localStorage.getItem("organizationName"))

      const custid = localStorage.getItem("customerId");
      const role = localStorage.getItem("role");

     
      console.log("role==>", role);
      console.log("custid==>", custid);

      if (role === "ROLE_OWNER") {
        // Owner doesn’t need customerId
        console.log("email==>", localStorage.getItem("email"));
        console.log("after tenant login org id ==>", localStorage.getItem("organizationId"));
        navigate("/ownerdashboard");

      } else if (role === "ROLE_ADMIN_SUPER" && custid) {
        // SuperAdmin must have a customerId
        navigate("/superadmin-dashboard");

      } else if (role === "ROLE_ADMIN") {
        // Tenant Admin must also have a customerId
        navigate("/admindashboard");

      } else if (role === "ROLE_CUSTOMER" && custid) {
        console.log("customerId==>", custid);
        console.log("email==>", localStorage.getItem("email"));
        navigate("/customerdashboard");

      } else {
        navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials or server error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Login
          </Button>

          {/* Forgot Password + Signup links */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="body2">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Typography>
            <Typography variant="body2">
              <Link to="/tenant-signup">Sign Up</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
