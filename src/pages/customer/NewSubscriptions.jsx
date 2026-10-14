import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Grid,
} from "@mui/material";
import { useSnackbar } from "notistack";   // ✅ Correct import
import api from "../../api/axios";

// Fetch plan details
async function fetchPlanDetails(planId) {
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/api/v1/plans/info/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// Create subscription
async function createSubscription(payload) {
  const token = localStorage.getItem("token");
  const { data } = await api.post(`/api/v1/subscriptions/create`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // should include invoiceId
}

export default function NewSubscriptions() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();   // ✅ Hook usage

  // Fetch plan details
  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["planDetails", planId],
    queryFn: () => fetchPlanDetails(planId),
    enabled: !!planId,
  });

  // Subscription mutation
const subscriptionMutation = useMutation({
  mutationFn: createSubscription,
  onSuccess: (data) => {
    enqueueSnackbar("Subscription created successfully!", { variant: "success" });

    // ✅ Redirect after 2 seconds to BillingDashboard.jsx
    setTimeout(() => {
      navigate("/superadmin-dashboard/superadmin-billingdashboard"); 
    }, 2000);
  },
  onError: () => {
    enqueueSnackbar("Failed to create subscription", { variant: "error" });
  },
});

  if (!planId) return <Typography>No plan selected</Typography>;
  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load plan details</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Subscription
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Product Code"
          value={plan?.productCode || ""}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              label="Plan Code"
              value={plan?.planCode || ""}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Plan Name: {plan?.name}
            </Typography>
          </Grid>
        </Grid>

        <TextField
          label="Version"
          value={plan?.version || ""}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        {plan?.pricePoints?.map((pp, idx) => (
          <Box key={idx} sx={{ mt: 2 }}>
            <TextField
              label="Currency"
              value={pp.currency}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Billing Cycle"
              value={pp.billingCycle}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Amount"
              value={pp.amount}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Trial Days"
              value={pp.trialDays}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Box>
        ))}
      </Paper>

      {/* Step 1: Create subscription */}
      <Button
        variant="contained"
        color="primary"
        disabled={subscriptionMutation.isSuccess}
        onClick={() => {
          const payload = {
            customerId: localStorage.getItem("customerId"),
            productCode: plan?.productCode,
            planCode: plan?.planCode,
            planVersion: plan?.version,
            currency: plan?.pricePoints?.[0]?.currency,
            billingCycle: plan?.pricePoints?.[0]?.billingCycle,
            unitAmount: plan?.pricePoints?.[0]?.amount,
            trialDays: plan?.pricePoints?.[0]?.trialDays,
          };
          subscriptionMutation.mutate(payload);
        }}
      >
        Confirm Subscription
      </Button>
    </Box>
  );
}
