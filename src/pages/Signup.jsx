import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import api from "../api/axios";

export default function Signup() {
    const { enqueueSnackbar } = useSnackbar();
   const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const [organizationId, setOrganizationId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
 
const payload = { username, email, password, name,organizationId};
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      
      await api.post("http://localhost:9093/api/customers/signup", payload, {
        headers: { "X-Organization-Id": "f1b419af-ea20-4f38-b3fe-5d38bfacdfde" },
      });
      enqueueSnackbar("Customer + User created successfully!", { variant: "success" });
      setOrganizationId("f1b419af-ea20-4f38-b3fe-5d38bfacdfde");
      setUsername("");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      enqueueSnackbar("Failed to create customer", { variant: "error" });
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="organizationId"
            name="organizationId"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
