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
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
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
  const [tab, setTab] = useState(0);

  const { data: invoices, isLoading, isError } = useQuery({
    queryKey: ["billing", email],
    queryFn: () => fetchInvoices(email),
    enabled: !!email,
  });

  // ✅ Payment handler
const handlePayment = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");

    // 1. Create order from backend
    const res = await api.post(
      `/api/v1/billing/payments/orders?invoiceId=${invoiceId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const order = res.data;

    // 2. Razorpay options
    const options = {
      key: order.razorpayKeyId,
      amount: order.amount * 100, // Razorpay expects paise
      currency: order.currency,
      name: "SMS LTD",
      description: "Invoice Payment",
      order_id: order.razorpayOrderId,
      handler: function (response) {
        console.log("razorpay_order_id --->", response.razorpay_order_id);
        console.log("razorpay_payment_id --->", response.razorpay_payment_id);
        console.log("razorpay_signature --->", response.razorpay_signature);

        const payload = {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        };

        api.post("/api/v1/billing/payments/verify", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => console.log("Verification result:", res.data))
          .catch((err) => console.error("Verification failed:", err));
      },
      prefill: {
        name: "Customer Name",
        email: order.email,
        contact: "7824044998",
      },
      theme: { color: "#3399cc" },
    };

    // 3. Open Razorpay Checkout
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.description);
    });
    rzp.open();
  } catch (err) {
    console.error("Payment init failed:", err);
  }
};

// ✅ Download handler (fixed)
  const handleDownload = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        `/api/v1/billing/invoices/${invoiceId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Invoice download failed:", err);
    }
  };


  if (!email) return <Typography>No customer email found</Typography>;
  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load billing data</Typography>;

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

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Invoices" />
        <Tab label="Transactions" />
      </Tabs>

      {/* Invoices Tab */}
      {tab === 0 && (
        <TableContainer component={Paper}>
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
                    {inv.status === "PENDING" && (
                        <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handlePayment(inv.id)}
                        >
                        Pay Now
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleDownload(inv.id)}
                    >
                        Download
                    </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Transactions Tab */}
      {tab === 1 && (
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
      )}
    </Box>
  );
}
