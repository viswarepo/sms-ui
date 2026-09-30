// src/pages/EditProductDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
//import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export default function EditProductDialog({ open, onClose, product, onSave }) {
  const [form, setForm] = useState(product || {});

  useEffect(() => {
    if (product) {
      setForm(product); // ✅ copies id and fields
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //const { enqueueSnackbar } = useSnackbar();
  
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      const { data } = await api.put(`/api/v1/products/${product.id}/update`, form);
      onSave(data);      
      queryClient.invalidateQueries({ queryKey: ["products"] }); // ✅ refresh product list
      //enqueueSnackbar("Product updated successfully!", { variant: "success" });
      onClose();
      
    } catch (err) {
      console.error("Product update failed:", err);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Product Name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          fullWidth
        />

        {/* ✅ Status dropdown with boolean values */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="active"
            value={form.active === true ? true : false}
            onChange={(e) =>
              setForm({ ...form, active: e.target.value })
            }
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
