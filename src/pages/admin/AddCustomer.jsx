import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  TextField, Button, Paper, Typography, Box
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

async function createCustomer(customer) {
  const { data } = await api.post("/api/v1/customers/create", customer);
  return data;
}

export default function AddCustomer() {
  const [form, setForm] = useState(
    { name: "", email: "", phone: "",organizationId: localStorage.getItem("organizationId"), });
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      enqueueSnackbar("Customer added successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/admindashboard/customers");
    },
    onError: () => enqueueSnackbar("Failed to add customer", { variant: "error" }),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate(form);
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Add Customer</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Paper>
  );
}
