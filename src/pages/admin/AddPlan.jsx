import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

export default function CreatePlan() {
  const [form, setForm] = useState({
    productCode: "",
    planCode: "",
    name: "",
    description: "",
    effectiveFrom: "",
    effectiveTo: "",
    pricePoints: [
      { currency: "", amount: 0, billingCycle: "", trialDays: 0 }
    ],
    entitlements: [],
  });

  const [products, setProducts] = useState([]);
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch products and features
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, featRes] = await Promise.all([
          api.get("/api/v1/products/all"),
          api.get("/api/v1/features/list"),
        ]);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.products || []);
        setFeatures(Array.isArray(featRes.data) ? featRes.data : featRes.data?.features || []);
      } catch (err) {
        console.error("Failed to load products/features:", err);
        enqueueSnackbar("Failed to load products or features", { variant: "error" });
      }
    }
    fetchData();
  }, [enqueueSnackbar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Checkbox toggle for features
  const handleFeatureToggle = (featureCode) => {
    let newEntitlements = [...form.entitlements];
    if (newEntitlements.some(ent => ent.featureCode === featureCode)) {
      // remove if already selected
      newEntitlements = newEntitlements.filter(ent => ent.featureCode !== featureCode);
    } else {
      // add new entitlement
      newEntitlements.push({ featureCode, value: "" });
    }
    setForm({ ...form, entitlements: newEntitlements });
  };

  const handlePricePointChange = (index, e) => {
    const newPricePoints = [...form.pricePoints];
    newPricePoints[index][e.target.name] = e.target.value;
    setForm({ ...form, pricePoints: newPricePoints });
  };

  const handleEntitlementChange = (index, e) => {
    const newEntitlements = [...form.entitlements];
    newEntitlements[index][e.target.name] = e.target.value;
    setForm({ ...form, entitlements: newEntitlements });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/plans/create/draft", form);
      enqueueSnackbar("Plan created successfully!", { variant: "success" });
      navigate("/admindashboard/plans");
    } catch (err) {
      console.error("Plan creation failed:", err);
      enqueueSnackbar("Failed to create plan", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Create New Plan
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
            {products.map((p) => (
              <MenuItem key={p.productCode} value={p.productCode}>
                {p.productCode} — {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Plan Code"
            name="planCode"
            value={form.planCode}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Effective From"
            name="effectiveFrom"
            type="date"
            value={form.effectiveFrom}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Effective To"
            name="effectiveTo"
            type="date"
            value={form.effectiveTo}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Price Points */}
          <Typography variant="subtitle1">Price Points</Typography>
          {form.pricePoints.map((pp, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                label="Currency"
                name="currency"
                value={pp.currency}
                onChange={(e) => handlePricePointChange(idx, e)}
                required
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
              </TextField>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={pp.amount}
                onChange={(e) => handlePricePointChange(idx, e)}
                required
              />
              <TextField
                select
                label="Billing Cycle"
                name="billingCycle"
                value={pp.billingCycle}
                onChange={(e) => handlePricePointChange(idx, e)}
                required
                fullWidth
              >
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                <MenuItem value="YEARLY">Yearly</MenuItem>
              </TextField>
              <TextField
                label="Trial Days"
                name="trialDays"
                type="number"
                value={pp.trialDays}
                onChange={(e) => handlePricePointChange(idx, e)}
                fullWidth
              />
            </Box>
          ))}

          {/* Entitlements with checkboxes + value field in same row */}
<Typography variant="subtitle1">Entitlements (Features)</Typography>
{features.map((f) => {
  const selectedEnt = form.entitlements.find(ent => ent.featureCode === f.code);
  return (
    <Box key={f.code} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!selectedEnt}
            onChange={() => handleFeatureToggle(f.code)}
          />
        }
        label={`${f.code} — ${f.name}`}
      />
      {selectedEnt && (
        <TextField
          label="Value"
          name="value"
          value={selectedEnt.value}
          onChange={(e) => handleEntitlementChange(
            form.entitlements.findIndex(ent => ent.featureCode === f.code),
            e
          )}
          sx={{ flex: 1 }}
        />
      )}
    </Box>
  );
})}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Plan
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
