import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import api from "../../api/axios";

export default function EditPlanDialog({ open, onClose, plan, onSave }) {
  const [form, setForm] = useState(plan || {});

  useEffect(() => {
    setForm(plan || {});
  }, [plan]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async () => {
    try {
      const { data } = await api.put(`/api/v1/plans/${form.id}/update`, form);
      onSave(data);
      onClose();
    } catch (err) {
      console.error("Plan update failed:", err);
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Plan</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Plan Code"
          name="code"
          value={form.code || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Effective From"
          name="effectiveFrom"
          type="date"
          value={form.effectiveFrom || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Effective To"
          name="effectiveTo"
          type="date"
          value={form.effectiveTo || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Typography variant="subtitle1">Price Points</Typography>
        {form.pricePoints?.map((pp, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 2 }}>
            <TextField
              select
              label="Currency"
              name="currency"
              value={pp.currency || ""}
              onChange={(e) => handlePricePointChange(idx, e)}
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
              value={pp.amount || ""}
              onChange={(e) => handlePricePointChange(idx, e)}
            />
            <TextField
              select
              label="Billing Cycle"
              name="billingCycle"
              value={pp.billingCycle || ""}
              onChange={(e) => handlePricePointChange(idx, e)}
              fullWidth
            >
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="YEARLY">Yearly</MenuItem>
            </TextField>
            <TextField
              label="Trial Days"
              name="trialDays"
              type="number"
              value={pp.trialDays || ""}
              onChange={(e) => handlePricePointChange(idx, e)}
            />
          </Box>
        ))}

        <Typography variant="subtitle1">Entitlements</Typography>
        {form.entitlements?.map((ent, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Feature Code"
              name="featureCode"
              value={ent.featureCode || ""}
              onChange={(e) => handleEntitlementChange(idx, e)}
            />
            <TextField
              label="Value"
              name="value"
              value={ent.value || ""}
              onChange={(e) => handleEntitlementChange(idx, e)}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
