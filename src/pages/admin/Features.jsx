import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";   // ✅ import useNavigate
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button
} from "@mui/material";
import { useSnackbar } from "notistack";
import EditFeatureDialog from "./EditFeatureDialog.jsx";

// Fetch features
async function fetchFeatures() {
  const { data } = await api.get("/api/v1/features/list");
  return Array.isArray(data) ? data : data?.features || [];
}

// Delete feature
async function deleteFeature(id) {
  await api.delete(`/api/v1/features/${id}`);
}

export default function Features() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const navigate = useNavigate();   // ✅ define navigate here

  const mutationDelete = useMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      enqueueSnackbar("Feature deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: () => enqueueSnackbar("Failed to delete feature", { variant: "error" }),
  });

  const handleAddFeature = () => {
    const userRole = localStorage.getItem("role"); // or from auth context
    if (userRole === "ROLE_ADMIN") {
      navigate("/admindashboard/features/add");
    } else if (userRole === "ROLE_OWNER") {
      navigate("/ownerdashboard/owner-features/add");
    } else {
      enqueueSnackbar("Unauthorized role", { variant: "error" });
    }
  };

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <Typography color="error">Error loading features</Typography>;

  const features = Array.isArray(data) ? data : [];

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ p: 2 }}>Features</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feature Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>{feature.code}</TableCell>
              <TableCell>{feature.name}</TableCell>
              <TableCell>{feature.description}</TableCell>
              <TableCell>{feature.type}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => setSelectedFeature(feature)}
                >
                  View Entitlements
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => setSelectedFeature(feature)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <EditFeatureDialog
        open={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
        onSave={(updated) => mutationUpdate.mutate(updated)}
      />

      <Button
        sx={{ m: 2 }}
        variant="contained"
        color="success"
        onClick={handleAddFeature}
      >
        Add New Feature
      </Button>
    </TableContainer>
  );
}
