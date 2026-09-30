import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// Fetch payment methods
async function fetchPaymentMethods() {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/api/v1/billing/payment-methods", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// Add payment method
async function addPaymentMethod(method) {
  const token = localStorage.getItem("token");
  const { data } = await api.post("/api/v1/billing/payment-methods/add", method, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// Delete payment method
async function deletePaymentMethod(id) {
  const token = localStorage.getItem("token");
  const { data } = await api.delete(`/api/v1/billing/payment-methods/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export default function MyPaymentMethods() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch methods
  const { data: methods, isLoading, isError } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: fetchPaymentMethods,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      enqueueSnackbar("Payment method added!", { variant: "success" });
      queryClient.invalidateQueries(["paymentMethods"]);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to add payment method";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      enqueueSnackbar("Payment method removed!", { variant: "success" });
      queryClient.invalidateQueries(["paymentMethods"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to remove payment method", { variant: "error" });
    },
  });

  // Form state
  const [form, setForm] = useState({ cardNumber: "", expiry: "", holderName: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    addMutation.mutate(form);
    setForm({ cardNumber: "", expiry: "", holderName: "" });
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load payment methods</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Payment Methods
      </Typography>

      {/* Add new method */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Add New Method</Typography>
        <TextField
          label="Card Number"
          name="cardNumber"
          value={form.cardNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Expiry (MM/YY)"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Card Holder Name"
          name="holderName"
          value={form.holderName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={addMutation.isLoading}
          sx={{ mt: 2 }}
        >
          {addMutation.isLoading ? <CircularProgress size={24} /> : "Add Method"}
        </Button>
      </Paper>

      {/* Saved methods */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Saved Methods</Typography>
        {methods?.length === 0 ? (
          <Typography color="textSecondary">No payment methods saved</Typography>
        ) : (
          <List>
            {methods.map((m) => (
              <ListItem
                key={m.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteMutation.mutate(m.id)}
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${m.holderName} - ${m.cardNumber}`}
                  secondary={`Expiry: ${m.expiry}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
