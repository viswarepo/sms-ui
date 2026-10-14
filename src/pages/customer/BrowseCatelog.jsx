import {
  Box, Typography, Grid, Paper, Button, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow,
  Checkbox, FormControlLabel, Chip,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

async function fetchCatalog() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const { data } = await api.get(`/api/v1/catalog/${userRole}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data?.items || [];
}

async function subscribeToPlan(planId) {
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");
  const { data } = await api.post(
    `/api/v1/subscriptions/create`,
    { customerId, planId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export default function BrowseCatelog() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPlans, setSelectedPlans] = useState([]);
  const navigate = useNavigate();

  const { data: catalog = [], isLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
  });

  const mutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      enqueueSnackbar("Subscribed successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
    },
    onError: () => {
      enqueueSnackbar("Failed to subscribe", { variant: "error" });
    },
  });

  if (isLoading) return <CircularProgress />;

  const handleSelectPlan = (planId) => {
    setSelectedPlans((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((p) => p !== planId);
      }
      if (prev.length >= 3) {
        enqueueSnackbar("You can only compare up to 3 plans.", { variant: "warning" });
        return prev;
      }
      return [...prev, planId];
    });
  };

  // Role-based navigation
  const handleSubscribe = (planId) => {
    const userRole = localStorage.getItem("role");
    if (userRole === "ROLE_ADMIN_SUPER") {
      navigate(`/superadmin-dashboard/superadmin-new-subscription/${planId}`);
    } else if (userRole === "ROLE_CUSTOMER") {
      navigate(`/customerdashboard/new-subscription/${planId}`);
    } else {
      enqueueSnackbar("Unauthorized role", { variant: "error" });
    }
  };

  const plansToCompare = catalog.filter((item) =>
    selectedPlans.includes(item.planId)
  );

  const allFeatures = [
    ...new Set(
      plansToCompare.flatMap((p) => p.entitlements?.map((e) => e.featureName) || [])
    ),
  ];

  const normalizeValue = (val) => {
    if (val === "true") return "Available";
    if (val === "false") return "Not available";
    return val;
  };

  const cheapestPlanId = (() => {
    let cheapest = null;
    let minPrice = Infinity;
    plansToCompare.forEach((plan) => {
      plan.pricePoints?.forEach((pp) => {
        if (pp.amount < minPrice) {
          minPrice = pp.amount;
          cheapest = plan.planId;
        }
      });
    });
    return cheapest;
  })();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Browse Catalog
      </Typography>
      <Grid container spacing={3}>
        {/* Left side: Plans */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {catalog.map((item) => (
              <Grid item xs={12} key={item.planId}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  {item.pricePoints?.map((pp, idx) => (
                    <Typography key={idx} variant="subtitle2">
                      {pp.billingCycle}: {pp.amount} {pp.currency}
                    </Typography>
                  ))}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPlans.includes(item.planId)}
                        onChange={() => handleSelectPlan(item.planId)}
                      />
                    }
                    label="Compare this plan"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleSubscribe(item.planId)}
                  >
                    Subscribe
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right side: Comparison */}
        <Grid item xs={12} md={6}>
          {plansToCompare.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Compare Selected Plans
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    {plansToCompare.map((plan) => (
                      <TableCell key={plan.planId} align="center">
                        {plan.name}
                        {plan.planId === cheapestPlanId && (
                          <Chip
                            label="Best Value"
                            color="success"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                        <br />
                        {plan.pricePoints?.map((pp, idx) => (
                          <Typography key={idx} variant="caption">
                            {pp.billingCycle}: {pp.amount} {pp.currency}
                          </Typography>
                        ))}
                        <br />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSubscribe(plan.planId)}
                        >
                          Subscribe
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allFeatures.map((feature) => (
                    <TableRow key={feature}>
                      <TableCell>{feature}</TableCell>
                      {plansToCompare.map((plan) => {
                        const ent = plan.entitlements?.find(
                          (e) => e.featureName === feature
                        );
                        return (
                          <TableCell key={plan.planId} align="center">
                            {ent ? (
                              <>
                                <Typography variant="body2">✔</Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {normalizeValue(ent.value)}
                                </Typography>
                              </>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ✖ Not included
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
