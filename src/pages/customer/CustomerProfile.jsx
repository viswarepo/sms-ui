import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// Fetch customer profile
async function fetchCustomerProfile(customerId) {
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/api/v1/customers/${customerId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// Update customer profile
async function updateCustomerProfile({ customerId, profile }) {
  const token = localStorage.getItem("token");
  const { data } = await api.put(
    `/api/v1/customers/${customerId}/profile/update`,
    profile,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export default function CustomerProfile() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const customerId = localStorage.getItem("customerId");

  const [form, setForm] = useState({
    alterMobile: "",
    landlineNumber: "",
    firstName: "",
    lastName: "",    
    address: "",
    country: "",
    state: "",
    city: "",
    preferredCurrency: "",
    locale: "",
    taxId: "",
  });

  // Fetch profile
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customerProfile", customerId],
    queryFn: () => fetchCustomerProfile(customerId),
    enabled: !!customerId,
  });

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        alterMobile: profile.alterMobile || "",
        landlineNumber: profile.landlineNumber || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",  
        address: profile.address || "",
        country: profile.country || "",
        state: profile.state || "",
        city: profile.city || "",
        preferredCurrency: profile.preferredCurrency || "",
        locale: profile.locale || "",
        taxId: profile.taxId || "",
      });
    }
  }, [profile]);

  // Mutation for update
  const mutation = useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: () => {
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["customerProfile", customerId]);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Failed to update profile. Try again.";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });

  if (!customerId) {
    return <Typography color="error">No customer selected</Typography>;
  }

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Failed to load profile details</Typography>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate({ customerId, profile: form });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customer Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <TextField
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Alternate Mobile"
          name="alterMobile"
          value={form.alterMobile}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Landline"
          name="landlineNumber"
          value={form.landlineNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
         <TextField
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
         <TextField
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
         <TextField
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Preferred Currency"
          name="preferredCurrency"
          value={form.preferredCurrency}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Locale"
          name="locale"
          value={form.locale}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tax ID"
          name="taxId"
          value={form.taxId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? <CircularProgress size={24} /> : "Save Profile"}
        </Button>
      </Paper>
    </Box>
  );
}
