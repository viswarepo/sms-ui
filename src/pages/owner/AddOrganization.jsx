import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

// ✅ API call
async function createOrganization(orgData) {
  const userRole = localStorage.getItem("role") || "ROLE_OWNER";
  const { data } = await api.post(`/api/v1/org/register/${userRole}`, orgData);
  return data;
}

export default function AddOrganization() {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    orgname: "",
    email: "",
    mobile: "",
    username: "",
    customerType: "TENANT", // default
    password: ""
  });

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      enqueueSnackbar("Organization created successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      navigate("/admindashboard/org/list"); // redirect after success
    },
    onError: (err) => {
      console.error("Failed to create organization:", err);
      const backendMessage = err.response?.data?.message || "Failed to create organization";
      setErrorMessage(backendMessage);
      enqueueSnackbar(backendMessage, { variant: "error" });
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create Organization
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField label="Organization Name" name="orgname" value={formData.orgname} onChange={handleChange} required />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
        <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required fullWidth />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required fullWidth inputProps={{ minLength: 8 }} />

        {/* Show backend error message */}
        {errorMessage && (
          <Typography color="error" variant="body2" align="center">
            {errorMessage}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Paper>
  );
}
