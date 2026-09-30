import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// Refund API call
async function requestRefund({ paymentId, amount, reason }) {
  const token = localStorage.getItem("token");
  const { data } = await api.post(`/api/v1/billing/payments/${paymentId}/refund`, {
    amount: amount || null,   // null means full refund
    reason,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export default function Refund() {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    paymentId: "",
    amount: "",
    reason: "",
  });

  const mutation = useMutation({
    mutationFn: requestRefund,
    onSuccess: () => {
      enqueueSnackbar("Refund request submitted!", { variant: "success" });
      setForm({ paymentId: "", amount: "", reason: "" });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Refund request failed";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate({
      paymentId: form.paymentId,
      amount: form.amount ? Number(form.amount) : null,
      reason: form.reason,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Request Refund
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TextField
          label="Payment ID"
          name="paymentId"
          value={form.paymentId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount (leave blank for full refund)"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          sx={{ mt: 2 }}
        >
          {mutation.isLoading ? <CircularProgress size={24} /> : "Submit Refund"}
        </Button>
      </Paper>
    </Box>
  );
}
