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
  Button,
  TablePagination,
} from "@mui/material";
import api from "../../api/axios";
import { useState } from "react";

async function fetchAllInvoices() {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/api/v1/billing/invoices/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // expected array of invoices
}

export default function InvoiceHistory() {
  const { data: invoices = [], isLoading, isError } = useQuery({
    queryKey: ["allInvoices"],
    queryFn: fetchAllInvoices,
  });

  // ✅ pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load invoices</Typography>;

  // ✅ slice for pagination
  const paginatedInvoices = invoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Invoice History
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Subs.ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInvoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.customerName || inv.customerId}</TableCell>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.subscriptionId}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>{inv.currency}</TableCell>
                <TableCell>{inv.status}</TableCell>
                <TableCell>{inv.dueDate}</TableCell>
                <TableCell>{inv.paidAt || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      api
                        .get(`/api/v1/billing/invoices/${inv.id}/download`, {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          responseType: "blob",
                        })
                        .then((res) => {
                          const url = window.URL.createObjectURL(new Blob([res.data]));
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `invoice-${inv.id}.pdf`);
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        });
                    }}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ✅ Pagination */}
        <TablePagination
          component="div"
          count={invoices.length}
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
