import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

export default function CreateSubscription() {
  const [form, setForm] = useState({
    customerId: localStorage.getItem("customerId"),
    productCode: "",
    planCode: "",
    planVersion: "",
    currency: "",
    billingCycle: "",
    unitAmount: 0,
    trialDays: 0,
  });

  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planVersions, setPlanVersions] = useState([]);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Load all products initially
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await api.get("/api/v1/products/all");
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        enqueueSnackbar("Failed to load products", { variant: "error" });
      }
    }
    fetchProducts();
  }, [enqueueSnackbar]);

  // When productCode changes, fetch its plans
  useEffect(() => {
    async function fetchPlans() {
      if (!form.productCode) {
        setPlans([]);
        return;
      }
      try {
        const { data } = await api.get(`/api/v1/plans/${form.productCode}`);
        // ✅ data is already an array of plans
        setPlans(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load plans:", err);
        enqueueSnackbar("Failed to load plans", { variant: "error" });
      }
    }
    fetchPlans();
  }, [form.productCode, enqueueSnackbar]);

  // When planCode changes, extract details directly from plans
  useEffect(() => {
  if (!form.planCode) {
    setPlanVersions([]);
    return;
  }
  const selectedPlan = plans.find(p => p.planCode === form.planCode);
  if (selectedPlan) {
    setPlanVersions([{ version: selectedPlan.version }]);

    const pricePoint = selectedPlan.pricePoints?.[0] || {};
    setForm(prev => ({
      ...prev,
      currency: pricePoint.currency || "",
      billingCycle: pricePoint.billingCycle || "",
      trialDays: pricePoint.trialDays ?? 0,   // ✅ fix here
      unitAmount: pricePoint.amount || 0,
    }));
  }
}, [form.planCode, plans]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/subscriptions/create", form);
      enqueueSnackbar("Subscription created successfully!", { variant: "success" });
      navigate("/admindashboard/subscriptions");
    } catch (err) {
      console.error("Subscription creation failed:", err);
      enqueueSnackbar("Failed to create subscription", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Create Subscription
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          
          {/* Product dropdown */}
          <TextField
            select
            label="Product"
            name="productCode"
            value={form.productCode}
            onChange={handleChange}
            required
            fullWidth
          >
            {Array.isArray(products) && products.map((prod) => (
              <MenuItem key={prod.productCode} value={prod.productCode}>
                {prod.productCode} — {prod.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Plan dropdown */}
          <TextField
            select
            label="Plan"
            name="planCode"
            value={form.planCode}
            onChange={handleChange}
            required
            fullWidth
            disabled={!form.productCode}
          >
            {Array.isArray(plans) && plans.map((p) => (
              <MenuItem key={p.planCode} value={p.planCode}>
                {p.planCode} — {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Plan Version dropdown */}
          <TextField
            select
            label="Plan Version"
            name="planVersion"
            value={form.planVersion}
            onChange={handleChange}
            required
            fullWidth
            disabled={!form.planCode}
          >
            {Array.isArray(planVersions) && planVersions.map((v) => (
              <MenuItem key={v.version} value={v.version}>
                Version {v.version}
              </MenuItem>
            ))}
          </TextField>

          {/* Auto-filled fields */}
          <TextField label="Currency" value={form.currency} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Unit Amount" value={form.unitAmount} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Billing Cycle" value={form.billingCycle} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Trial Days" value={form.trialDays} InputProps={{ readOnly: true }} fullWidth />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Subscription
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
