import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import api from "../../api/axios";

export default function EditFeatureDialog({ open, onClose, feature, onSave }) {
  const [form, setForm] = useState(feature || {});

useEffect(() => {
  if (feature) {
    // normalize property names
    setForm({
      ...feature,
      featureType: feature.featureType || feature.type || "", // ✅ handle both cases
    });
  }
}, [feature]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const { data } = await api.put(`/api/v1/features/${form.featureId}/update`, form);
      onSave(data);   // pass updated feature back to parent
      onClose();
    } catch (err) {
      console.error("Feature update failed:", err);
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Feature</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Feature Code"
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
          select
          label="Feature Type"
          name="type"
          value={form.type || ""}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
          <MenuItem value="NUMERIC">NUMERIC</MenuItem>
          <MenuItem value="TIERED">TIERED</MenuItem>
        </TextField>
        
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
