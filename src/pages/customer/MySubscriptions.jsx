import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// Fetch subscriptions
async function fetchSubscriptions() {
  const token = localStorage.getItem("token");
  const custid = localStorage.getItem("customerId");
  const { data } = await api.get(`/api/v1/subscriptions/my/${custid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data?.subscriptions || [];
}

export default function MySubscriptions() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [atPeriodEnd, setAtPeriodEnd] = useState(false);

  const [changeOpen, setChangeOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [planCode, setPlanCode] = useState("");
  const [planVersion, setPlanVersion] = useState(1);
  const [unitAmount, setUnitAmount] = useState(0);
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [immediate, setImmediate] = useState(false);



  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: fetchSubscriptions,
  });

  // Cancel subscription
  async function cancelSubscription({ id, atPeriodEnd }) {
    const token = localStorage.getItem("token");
    const { data } = await api.post(
      `/api/v1/subscriptions/${id}/cancel`,
      { atPeriodEnd }, // body
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      enqueueSnackbar("Subscription cancelled successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      setOpen(false);
    },
    onError: () => {
      enqueueSnackbar("Failed to cancel subscription", { variant: "error" });
    },
  });

  // Renew subscription
  async function renewSubscription(id) {
    const token = localStorage.getItem("token");
    const { data } = await api.post(
      `/api/v1/subscriptions/${id}/renew`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }

  const renewMutation = useMutation({
    mutationFn: renewSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      enqueueSnackbar("Subscription renewed successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to renew subscription", { variant: "error" });
    },
  });

  // Pause subscription
  async function pauseSubscription(id) {
    const token = localStorage.getItem("token");
    const { data } = await api.post(
      `/api/v1/subscriptions/${id}/pause`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }

  const pauseMutation = useMutation({
    mutationFn: pauseSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      enqueueSnackbar("Subscription paused successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to pause subscription", { variant: "error" });
    },
  });

  // Resume subscription
  async function resumeSubscription(id) {
    const token = localStorage.getItem("token");
    const { data } = await api.post(
      `/api/v1/subscriptions/${id}/resume`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }

  const resumeMutation = useMutation({
    mutationFn: resumeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      enqueueSnackbar("Subscription resume successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to resume subscription", { variant: "error" });
    },
  });

  // Reactivate subscription
  async function reactivateSubscription(id) {
    const token = localStorage.getItem("token");
    const { data } = await api.post(
      `/api/v1/subscriptions/${id}/reactivate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }

  
  const reactivateMutation = useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      enqueueSnackbar("Subscription reactivate successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to renew subscription", { variant: "error" });
    },
  });

  //Change plan

  async function changePlanRequest(payload) {
    const token = localStorage.getItem("token");
    const { data } = await api.post(
      `/api/v1/subscriptions/${payload.subscriptionId}/change-plan`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }

  const changePlanMutation = useMutation({
    mutationFn: changePlanRequest,
    onSuccess: () => {
      enqueueSnackbar("Plan changed successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      setChangeOpen(false);
    },
    onError: () => {
      enqueueSnackbar("Failed to change plan", { variant: "error" });
    },
  });

  //Fetch plan for change plan dialog
  

  const { data: plans = [] } = useQuery({
  queryKey: ["plans"],
  queryFn: async () => {
    const token = localStorage.getItem("token");
    const { data } = await api.get("/api/v1/catalog", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : data?.items || [];
  },
});

  if (isLoading) return <CircularProgress />;

  const handleCancelClick = (id) => {
    setSelectedId(id);
    setAtPeriodEnd(false); // reset checkbox
    setOpen(true);
  };

  const handleSubmit = () => {
    cancelMutation.mutate({ id: selectedId, atPeriodEnd });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Subscriptions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Next Billing Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {subscriptions?.map((s) => (
    <>
      <TableRow key={s.id}>
        <TableCell>{s.productCode}</TableCell>
        <TableCell>{s.planCode}</TableCell>
        <TableCell>{s.planVersion}</TableCell>
        <TableCell>{s.currency}</TableCell>
        <TableCell>{s.unitAmount}</TableCell>
        <TableCell>{s.status}</TableCell>
        <TableCell>{s.nextBillingDate}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleCancelClick(s.id)}
            disabled={s.status !== "ACTIVE"}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
            disabled={s.status == "ACTIVE" || s.status !== "TRIALING " || s.status !== "PAST_DUE"}  // use disabled, not enabled
            onClick={() => {
              setSelectedSub(s);
              setPlanCode(s.planCode);
              setPlanVersion(s.planVersion);
              setUnitAmount(s.unitAmount);
              setBillingCycle(s.billingCycle);
              setImmediate(false);
              setChangeOpen(true);
            }}
          >
            Change Plan
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => renewMutation.mutate(s.id)}
            disabled={s.status !== "ACTIVE"}
            sx={{ mr: 1 }}
          >
            Renew
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => reactivateMutation.mutate(s.id)}
            disabled={s.status === "ACTIVE" || s.status === "TRIALING" || s.status === "PAST_DUE"} // use disabled, not enabled
          >
            ReActivate
          </Button>
           <Button
            variant="outlined"
            color="secondary"
            onClick={() => pauseMutation.mutate(s.id)}
            disabled={s.status !== "ACTIVE"}  // use disabled, not enabled
          >
            Pause
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => resumeMutation.mutate(s.id)}
            disabled={s.status !== "PAUSED"} // use disabled, not enabled
          >
            Resume
          </Button>
        </TableCell>
      </TableRow>
    </>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {/* Single Dialog outside map */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={atPeriodEnd}
                onChange={(e) => setAtPeriodEnd(e.target.checked)}
              />
            }
            label="Cancel at end of billing period"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleSubmit} color="error" variant="contained">
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>


      {/* Change plan dialog */}

      <Dialog open={changeOpen} onClose={() => setChangeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Plan</DialogTitle>
        <DialogContent dividers>
          {selectedSub && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2">Subscription ID: {selectedSub.id}</Typography>


              <TextField
                select
                label="Select Plan"
                value={planCode || ""}
                onChange={(e) => {
                  const selectedCode = e.target.value;
                  setPlanCode(selectedCode);

                  // find plan details from backend list
                  const selectedPlan = plans.find((p) => p.planCode === selectedCode);
                  if (selectedPlan) {
                    // ✅ update planVersion dynamically
                    setPlanVersion(selectedPlan.planVersion || 1);
                    setUnitAmount(selectedPlan.pricePoints?.[0]?.amount || 0);
                    setBillingCycle(selectedPlan.pricePoints?.[0]?.billingCycle || "");
                  }
                }}
                fullWidth
                margin="normal"
              >
                {plans.map((p) => (
                  <MenuItem key={p.planCode} value={p.planCode}>
                    {p.name} ({p.planCode})
                  </MenuItem>
                ))}
              </TextField>


              <TextField
                select
                label="Plan Version"
                value={planVersion || ""}
                onChange={(e) => setPlanVersion(Number(e.target.value))}
                fullWidth
                margin="normal"
              >
                <MenuItem value="1">1</MenuItem>
                                            <MenuItem value="2">2</MenuItem>
                                            <MenuItem value="3">3</MenuItem>
                                            <MenuItem value="4">4</MenuItem>
                                            <MenuItem value="5">5</MenuItem>
                                            <MenuItem value="6">6</MenuItem>
              </TextField>

              <TextField
                label="Unit Amount"
                type="number"
                value={unitAmount}
                onChange={(e) => setUnitAmount(Number(e.target.value))}
                fullWidth
                margin="normal"
              />

              <TextField
                select
                label="Billing Cycle"
                value={billingCycle || ""}   // fallback to empty string
                onChange={(e) => setBillingCycle(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="DAILY">Daily</MenuItem>
                              <MenuItem value="DAILY">Weekly</MenuItem>
                              <MenuItem value="WEEKLY">Weekly</MenuItem>
                              <MenuItem value="MONTHLY">Monthly</MenuItem>
                              <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                              <MenuItem value="ANNUAL">Yearly</MenuItem>
              </TextField>


              <FormControlLabel
                control={
                  <Checkbox
                    checked={immediate}
                    onChange={(e) => setImmediate(e.target.checked)}
                  />
                }
                label="Apply Immediately"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeOpen(false)}>Close</Button>
          <Button
            onClick={() =>
              changePlanMutation.mutate({
                subscriptionId: selectedSub.id,
                planCode,
                planVersion,
                unitAmount,
                billingCycle,
                immediate,
              })
            }
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>



    </Box>
  );
}
