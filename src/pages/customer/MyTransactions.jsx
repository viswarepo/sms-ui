import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import api from "../../api/axios";

// Fetch invoices for a customer
async function fetchInvoices(email) {
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/api/v1/billing/invoices/customer/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data?.invoices || [];
}

// Helper to color-code status
function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
    case "PAID":
      return "green";
    case "FAILED":
      return "red";
    case "REFUNDED":
      return "orange";
    case "PENDING":
      return "blue";
    default:
      return "gray";
  }
}

export default function BillingDashboard() {
  const email = localStorage.getItem("email");

  const { data: invoices, isLoading, isError } = useQuery({
    queryKey: ["billing", email],
    queryFn: () => fetchInvoices(email),
    enabled: !!email,
  });

  if (!email) return <Typography>No customer email found</Typography>;
  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load billing data</Typography>;

  // Split invoices into pending vs completed transactions
  const pendingInvoices = (invoices || []).filter(inv => inv.status === "PENDING");
  const transactions = (invoices || []).map(inv => ({
    id: inv.id,
    invoiceId: inv.id,
    paymentId: inv.paymentId || "-",
    amount: inv.amount,
    currency: inv.currency,
    status: inv.status,
    date: inv.paidAt || inv.dueDate,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing & Payments
      </Typography>

      {/* Pending Invoices Section */}
      <Typography variant="h6" gutterBottom>
        Pending Invoices
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending invoices 🎉
                </TableCell>
              </TableRow>
            ) : (
              pendingInvoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>{inv.currency}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold", color: getStatusColor(inv.status) }}>
                      {inv.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary">
                      Pay Now
                    </Button>
                    <Button variant="outlined" color="primary" sx={{ ml: 1 }}>
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transactions Section */}
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(transactions || []).map(txn => (
              <TableRow key={txn.id}>
                <TableCell>{txn.id}</TableCell>
                <TableCell>{txn.invoiceId}</TableCell>
                <TableCell>{txn.paymentId}</TableCell>
                <TableCell>{txn.amount}</TableCell>
                <TableCell>{txn.currency}</TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: "bold", color: getStatusColor(txn.status) }}>
                    {txn.status}
                  </Typography>
                </TableCell>
                <TableCell>{txn.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
