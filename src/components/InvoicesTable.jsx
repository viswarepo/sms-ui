// src/components/InvoicesTable.jsx
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../api/axios";

async function fetchLatestInvoices() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const { data } = await api.get("/api/v1/billing/invoices/history/"+userRole, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // assuming backend returns invoices sorted by date (latest first)
  return data.slice(0, 5);
}

export default function InvoicesTable() {
  const { data: invoices = [], isLoading, isError } = useQuery({
    queryKey: ["latestInvoices"],
    queryFn: fetchLatestInvoices,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load invoices</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Latest Invoices
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.id}</TableCell>
              <TableCell>{inv.customerName || inv.customerId}</TableCell>
              <TableCell>
                {inv.amount} {inv.currency}
              </TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    api
                      .get(`/api/v1/billing/invoices/${inv.id}/download`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
                  <DownloadIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
