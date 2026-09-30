// src/pages/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Container, Paper, Typography, TextField, Button, Box
} from "@mui/material";
import { useSnackbar } from "notistack";

async function createProduct(product) {
  const { data } = await api.post("/api/v1/products/create", product);
  return data;
}

export default function Addproduct() {
  const [form, setForm] = useState({
    productCode: "",
    name: "",
    description: "",
    organizationId: localStorage.getItem("organizationId"),
    active: true,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      enqueueSnackbar("Product added successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admindashboard/products"); // redirect back to product list
    },
    onError: () => {
      enqueueSnackbar("Failed to add product", { variant: "error" });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Product Code"
            name="productCode"
            value={form.productCode}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Product Name"
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
         
          <Button type="submit" variant="contained" color="success">
            Save Product
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
