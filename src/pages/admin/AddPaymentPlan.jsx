// src/pages/AddPaymentPlan.jsx
import { useState } from "react";
import {
  Container, Paper, Typography, Box, TextField, Button, MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

export default function AddPaymentPlan() {
  const [form, setForm] = useState({
    name: "",
    amount: 0,
    currency: "",
    billingCycle: "MONTHLY",
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/bp/plans/create", form);
      enqueueSnackbar("Payment plan created successfully!", { variant: "success" });
      navigate("/admindashboard/payment");
    } catch (err) {
      console.error("Payment plan creation failed:", err);
      enqueueSnackbar("Failed to create payment plan", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Add New Payment Plan
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Plan Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            select
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="INR">INR</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
            <MenuItem value="JPY">JPY</MenuItem>
          </TextField>
          <TextField
            select
            label="Billing Cycle"
            name="billingCycle"
            value={form.billingCycle}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="DAILY">Daily</MenuItem>
            <MenuItem value="WEEKLY">Weekly</MenuItem>
            <MenuItem value="MONTHLY">Monthly</MenuItem>
            <MenuItem value="YEARLY">Yearly</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Payment Plan
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
