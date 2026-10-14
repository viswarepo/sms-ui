import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,   // ✅ import added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

export default function CreateFeature() {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    type: "",   // ✅ fixed typo
    //organizationId: localStorage.getItem("organizationId") || "", // ✅ safe fallback
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("role--->",localStorage.getItem("role"));
      await api.post("/api/v1/features/add", form);
      enqueueSnackbar("Feature created successfully!", { variant: "success" });
  
      const userRole = localStorage.getItem("role"); // or from context/auth
      if (userRole === "ROLE_ADMIN") {
        navigate("/admindashboard/features");
      } else if (userRole === "ROLE_OWNER") {
        navigate("/ownerdashboard/owner-features");
      } else {
        enqueueSnackbar("Unauthorized role", { variant: "error" });
      }
    } catch (err) {
      console.error("Feature creation failed:", err);
      enqueueSnackbar("Failed to create feature", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Create New Feature
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Feature Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            select
            label="Feature Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
            <MenuItem value="NUMERIC">NUMERIC</MenuItem>
            <MenuItem value="TIERED">TIERED</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Create Feature
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
