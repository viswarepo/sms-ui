import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Typography } from "@mui/material";
import api from "../../api/axios";

async function fetchRazorpayOrder(planId) {
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");

  // Call backend to create Razorpay order
  const { data } = await api.post(
    "/api/v1/payments/create-order",
    { customerId, planId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data; // should contain { orderId, amount, currency, key }
}

export default function PaymentCheckout() {
  const { planId } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["razorpayOrder", planId],
    queryFn: () => fetchRazorpayOrder(planId),
  });

  useEffect(() => {
    if (!order) return;

    const options = {
      key: order.key, // Razorpay key from backend
      amount: order.amount,
      currency: order.currency,
      name: "SMS Billing",
      description: "Subscription Payment",
      order_id: order.orderId,
      handler: function (response) {
        // Send payment verification to backend
        api.post(
          "/api/v1/payments/verify",
          {
            orderId: order.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      },
      prefill: {
        email: localStorage.getItem("email"),
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [order]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to create order</Typography>;

  return <Typography>Redirecting to payment...</Typography>;
}
