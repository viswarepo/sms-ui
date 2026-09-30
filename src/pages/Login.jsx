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

      console.log("token==>", localStorage.getItem("token"));
      console.log("role==>", localStorage.getItem("role"));

      if (res.data.role === "ROLE_ADMIN") {
        navigate("/admindashboard");
      } else if (res.data.role === "ROLE_CUSTOMER") {
         localStorage.setItem("customerId", res.data.customerId);
         console.log("customerId==>", localStorage.getItem("customerId"));
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
              <Link to="/signup">Sign Up</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
