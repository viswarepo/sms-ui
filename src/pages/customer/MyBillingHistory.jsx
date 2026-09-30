import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from "@mui/material";
import api from "../../api/axios";

// Fetch invoices
async function fetchInvoices() {
  const token = localStorage.getItem("token");
  const custid = localStorage.getItem("customerId");
  const { data } = await api.get(`/api/v1/invoices/my/${custid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data?.invoices || [];
}

export default function MyInvoices() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["myInvoices"],
    queryFn: fetchInvoices,
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Invoices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Subscription ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Period Start</TableCell>
              <TableCell>Period End</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices?.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.subscriptionId}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>{inv.currency}</TableCell>
                <TableCell>{inv.status}</TableCell>
                <TableCell>{inv.periodStart}</TableCell>
                <TableCell>{inv.periodEnd}</TableCell>
                <TableCell>{inv.dueDate}</TableCell>
                <TableCell>{inv.paidAt}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
