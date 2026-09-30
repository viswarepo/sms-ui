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
import { useEffect } from "react";

// Fetch all invoices for a customer by email
async function fetchInvoices(email) {
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/api/v1/billing/invoices/customer/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data?.invoices || [];
}

export default function MyInvoices() {
  const email = localStorage.getItem("email");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const { data: invoices, isLoading, isError } = useQuery({
    queryKey: ["invoices", email],
    queryFn: () => fetchInvoices(email),
    enabled: !!email,
  });

  if (!email) return <Typography>No customer email found</Typography>;
  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load invoices</Typography>;

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
        amount: order.amount * 100,
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
              <TableCell>Due Date</TableCell>
              <TableCell>Paid At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(invoices || []).map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.subscriptionId}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>{inv.currency}</TableCell>
                <TableCell>{inv.status}</TableCell>
                <TableCell>{inv.dueDate}</TableCell>
                <TableCell>{inv.paidAt || "-"}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
