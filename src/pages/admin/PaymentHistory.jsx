import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import api from "../../api/axios";
import { useState } from "react";

async function fetchPayments() {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("organizationId");
  const userRole = localStorage.getItem("role");
  const { data } = await api.get("/api/v1/billing/payments/history/"+userRole, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Organization-Id": orgId,
    },
  });
  return data; // array of PaymentResponse
}

export default function PaymentHistory() {
  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  // ✅ pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load payments</Typography>;

  // ✅ slice for pagination
  const paginatedPayments = payments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment History
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Razorpay Order ID</TableCell>
              <TableCell>Failure Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((p) => (
              <TableRow key={p.paymentId}>
                <TableCell>{p.paymentId}</TableCell>
                <TableCell>{p.invoiceId}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell>{p.currency}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.razorpayOrderId}</TableCell>
                <TableCell>{p.failureReason || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ✅ Pagination */}
        <TablePagination
          component="div"
          count={payments.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}
