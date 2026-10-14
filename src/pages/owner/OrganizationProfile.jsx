// src/pages/OrganizationProfile.jsx
import { useState, useEffect } from "react";
import {
  Container, Paper, Typography, TextField, Button, Box, CircularProgress
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// ✅ Fetch organization profile

async function fetchOrgProfile(orgId) {
  if (!orgId) throw new Error("Organization ID missing");
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/api/v1/org/${orgId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Profile raw response:", data);
  const name = Date.name;
  // If backend returns { data: {...} }
  return data;
}





// ✅ Update organization profile
async function updateOrgProfile({ orgId, profile }) {
  const token = localStorage.getItem("token");
  const { data } = await api.put(`/api/v1/org/${orgId}/profile/update`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export default function OrganizationProfile() {
  const orgId = localStorage.getItem("organizationId");
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: profile, isLoading, } = useQuery({
    
  queryKey: ["orgProfile", orgId],
  queryFn: () => fetchOrgProfile(orgId),
  enabled: !!orgId, // only run if orgId exists
});


  const mutation = useMutation({
    mutationFn: updateOrgProfile,
    onSuccess: () => {
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orgProfile", orgId]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    },
  });

  const [form, setForm] = useState({
    description: "",
    legalName: "",
    phone: "",
    alterMobile: "",
    landlineNumber: "",
    website: "",
    country: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    preferredCurrency: "",
    locale: "",
    taxId: "",
  });

  // Populate form when profile loads
useEffect(() => {
  if (profile) {
    setForm({
      description: profile.description || "",
      legalName: profile.legalName || "",
      phone: profile.phone || "",
      alterMobile: profile.alterMobile || "",
      landlineNumber: profile.landlineNumber || "",
      website: profile.website || "",
      country: profile.country || "",
      state: profile.state || "",
      city: profile.city || "",
      address1: profile.address1 || "",
      address2: profile.address2 || "",
      preferredCurrency: profile.preferredCurrency || "",
      locale: profile.locale || "",
      taxId: profile.taxId || "",
    });
  }
}, [profile]);


console.log("Profile raw:", profile);

console.log("isLoading:", isLoading, "profile:", profile);


  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ orgId, profile: form });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
        {profile.orgname} | Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth />
          <TextField label="Legal Name" name="legalName" value={form.legalName} onChange={handleChange} fullWidth />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
          <TextField label="Alternate Mobile" name="alterMobile" value={form.alterMobile} onChange={handleChange} fullWidth />
          <TextField label="Landline Number" name="landlineNumber" value={form.landlineNumber} onChange={handleChange} fullWidth />
          <TextField label="Website" name="website" value={form.website} onChange={handleChange} fullWidth />
          <TextField label="Country" name="country" value={form.country} onChange={handleChange} fullWidth />
          <TextField label="State" name="state" value={form.state} onChange={handleChange} fullWidth />
          <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth />
          <TextField label="Address 1" name="address1" value={form.address1} onChange={handleChange} fullWidth />
          <TextField label="Address 2" name="address2" value={form.address2} onChange={handleChange} fullWidth />
          <TextField label="Preferred Currency" name="preferredCurrency" value={form.preferredCurrency} onChange={handleChange} fullWidth />
          <TextField label="Locale" name="locale" value={form.locale} onChange={handleChange} fullWidth />
          <TextField label="Tax ID" name="taxId" value={form.taxId} onChange={handleChange} fullWidth />

          <Button type="submit" variant="contained" color="primary">
            Save Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
