import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../api/axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, TextField, TablePagination, Box,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

// ✅ Fetch organizations
async function fetchOrganizations() {
  const { data } = await api.get("/api/v1/org/all");
  return Array.isArray(data) ? data : [];
}

// ✅ Delete organization
async function deleteOrganization(id) {
  await api.delete(`/api/v1/org/${id}`);
}

export default function ListOrganization() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedOrg, setSelectedOrg] = useState(null);

  const mutationDelete = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      enqueueSnackbar("Organization deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: () => enqueueSnackbar("Failed to delete organization", { variant: "error" }),
  });

  // ✅ Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Filter state
  const [filters, setFilters] = useState({ name: "", email: "", country: "" });

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <Typography color="error">Error loading organizations</Typography>;

  const organizations = Array.isArray(data) ? data : [];

  // ✅ Apply filters
  const filteredOrgs = organizations.filter(org =>
  (org.orgname?.toLowerCase() || "").includes(filters.name.toLowerCase()) &&
  (org.orgEmail?.toLowerCase() || "").includes(filters.email.toLowerCase()) &&
  (org.country?.toLowerCase() || "").includes(filters.country.toLowerCase())
);


  // ✅ Paginate
  const paginatedOrgs = filteredOrgs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const handleClose = () => setSelectedOrg(null);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ p: 2 }}>Organizations</Typography>

      {/* ✅ Filter inputs */}
      <Paper sx={{ p: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Search by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <TextField
          label="Search by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <TextField
          label="Search by Country"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />

          {/* Push button to the right */}
  <Box sx={{ flexGrow: 1 }} /> 
         <Button
        sx={{ m: 2 }}
        variant="contained"
        color="success"
        component={Link}
        to="/ownerdashboard/listorganization/add"
      >
        Create Organization
      </Button>
      </Paper>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Legal Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>State</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Url</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedOrgs.map((org) => (
            <TableRow key={org.id}>
              <TableCell>{org.orgname}</TableCell>
              <TableCell>{org.orgEmail}</TableCell>
              <TableCell>{org.legalName}</TableCell>
              <TableCell>{org.phone}</TableCell>
              <TableCell>{org.website}</TableCell>
              <TableCell>{org.country}</TableCell>
              <TableCell>{org.state}</TableCell>
              <TableCell>{org.city}</TableCell>
              <TableCell>{org.orgType}</TableCell>
              <TableCell>{org.customerSignupUrl}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => setSelectedOrg(org)}
                >
                  View
                </Button>
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Pagination controls */}
      <TablePagination
        component="div"
        count={filteredOrgs.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />



      {/* ✅ Dialog for details */}
      <Dialog open={!!selectedOrg} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedOrg?.orgname} – Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrg && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography><b>Email:</b> {selectedOrg.orgEmail}</Typography>
              <Typography><b>Legal Name:</b> {selectedOrg.legalName}</Typography>
              <Typography><b>Phone:</b> {selectedOrg.phone}</Typography>
              <Typography><b>Website:</b> {selectedOrg.website}</Typography>
              <Typography><b>Country:</b> {selectedOrg.country}</Typography>
              <Typography><b>State:</b> {selectedOrg.state}</Typography>
              <Typography><b>City:</b> {selectedOrg.city}</Typography>
              <Typography><b>Type:</b> {selectedOrg.orgType}</Typography>
              <Typography><b>Signup URL:</b> {selectedOrg.customerSignupUrl}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

     
    </TableContainer>
  );
}
