// src/pages/PaymentPlans.jsx
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button
} from "@mui/material";
import { Link } from "react-router-dom";

async function fetchPaymentPlans() {
  const { data } = await api.get("/api/v1/bp/plans/all");
  return Array.isArray(data) ? data : data?.plans || [];
}

export default function PaymentPlans() {
  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ["paymentPlans"],
    queryFn: fetchPaymentPlans,
  });

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <Typography color="error">Error loading payment plans</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ p: 2 }}>Payment Plans</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Billing Cycle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="textSecondary">No payment plans available</Typography>
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.amount}</TableCell>
                <TableCell>{plan.currency}</TableCell>
                <TableCell>{plan.billingCycle}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Button
        sx={{ m: 2 }}
        variant="contained"
        color="success"
        component={Link}
        to="/paymentplan/add"
      >
        Add New Payment Plan
      </Button>
    </TableContainer>
  );
}
