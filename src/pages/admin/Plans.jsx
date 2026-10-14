import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, FormControl, InputLabel,
  Select, MenuItem, Box, TextField, TablePagination
} from "@mui/material";
import { useSnackbar } from "notistack";
import EditPlanDialog from "./EditPlanDialog.jsx";

// --- API functions ---
async function fetchPlans() {
  const userRole = localStorage.getItem("role"); // or from context/auth
  const { data } = await api.get("/api/v1/plans/all/"+userRole);
  if (Array.isArray(data)) return data;
  if (data?.plans && Array.isArray(data.plans)) return data.plans;
  return [];
}

async function fetchProducts() {
  const userRole = localStorage.getItem("role"); // or from context/auth
  const { data } = await api.get("/api/v1/products/all/"+userRole);
  if (Array.isArray(data)) return data;
  if (data?.products && Array.isArray(data.products)) return data.products;
  return [];
}

async function updatePlan(plan) {
  const { data } = await api.post(`/api/v1/plans/update/${plan.id}`, plan);
  return data;
}

async function deletePlan(id) {
  const { data } = await api.delete(`/api/v1/plans/${id}`);
  return data;
}

async function publishPlan(planCode, version) {
  const token = localStorage.getItem("token");
  const { data } = await api.post(
    `/api/v1/plans/${planCode}/versions/${version}/publish`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

// --- Component ---
export default function Plans() {
  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterProduct, setFilterProduct] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();   // ✅ define navigate here

  // Mutations
  const mutationUpdate = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      enqueueSnackbar("Plan updated successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => enqueueSnackbar("Failed to update plan", { variant: "error" }),
  });

  const mutationDelete = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      enqueueSnackbar("Plan deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => enqueueSnackbar("Failed to delete plan", { variant: "error" }),
  });

  const publishMutation = useMutation({
    mutationFn: ({ planCode, version }) => publishPlan(planCode, version),
    onSuccess: () => {
      enqueueSnackbar("Plan published successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => enqueueSnackbar("Failed to publish plan", { variant: "error" }),
  });

  // Role-based navigation
  const handleCreateDraftPlan = () => {
    const userRole = localStorage.getItem("role"); // or from context/auth
    if (userRole === "ROLE_ADMIN") {
      navigate("/admindashboard/plans/add");
    } else if (userRole === "ROLE_OWNER") {
      navigate("/ownerdashboard/owner-plans/add");
    } else {
      enqueueSnackbar("Unauthorized role", { variant: "error" });
    }
  };

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <Typography color="error">Error loading plans</Typography>;

  // Map product codes to names
  const productMap = {};
  products.forEach((p) => {
    productMap[p.productCode] = p.name;
  });

  // Apply filters and search
  const filteredPlans = plans.filter((plan) => {
    const productMatch = filterProduct ? plan.productCode === filterProduct : true;
    const statusMatch = filterStatus ? plan.status === filterStatus : true;
    const searchMatch = searchTerm
      ? plan.planCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return productMatch && statusMatch && searchMatch;
  });

  // Slice for pagination
  const paginatedPlans = filteredPlans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, gap: 2 }}>
        <Typography variant="h5">Plans</Typography>
        {/* Filters and search bar */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Product</InputLabel>
          <Select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
            <MenuItem value="">All Products</MenuItem>
            {products.map((p) => (
              <MenuItem key={p.id} value={p.productCode}>
                {p.productCode} — {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="DEPRECATED">Deprecated</MenuItem>
            <MenuItem value="RETIRED">Retired</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          placeholder="🔍 Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            minWidth: 250,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
            "& input": { padding: "10px 14px", fontSize: "0.95rem" },
          }}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Code</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Plan Code</TableCell>
            <TableCell>Plan Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPlans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.productCode}</TableCell>
              <TableCell>{productMap[plan.productCode] || "—"}</TableCell>
              <TableCell>{plan.planCode}</TableCell>
              <TableCell>{plan.name}</TableCell>
              <TableCell>{plan.version}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.status}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  disabled={plan.status !== "DRAFT"}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                  disabled={plan.status !== "DRAFT"}
                  onClick={() =>
                    publishMutation.mutate({ planCode: plan.planCode, version: plan.version })
                  }
                >
                  Publish
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

            <TablePagination
        component="div"
        count={filteredPlans.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Edit Dialog */}
      <EditPlanDialog
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        onSave={(updated) => mutationUpdate.mutate(updated)}
      />

      {/* ✅ Create Draft Plan Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleCreateDraftPlan}
        >
          Create Draft Plan
        </Button>
      </Box>
    </TableContainer>
  );
}
