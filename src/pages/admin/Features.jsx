import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState} from "react";
import api from "../../api/axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

import EditFeatureDialog from "./EditFeatureDialog.jsx";// ✅ default import

// Fetch features
async function fetchFeatures() {
  const { data } = await api.get("/api/v1/features/list");
  return data;
 // return Array.isArray(data) ? data : data?.features || [];
}

// Delete feature
async function deleteFeature(id) {
  await api.delete(`/api/v1/features/${id}`);
}

export default function Features() {   // ✅ default export here
  const { data, isLoading, error } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });
  

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedFeature, setSelectedFeature] = useState(null); // ✅ separate state

  const mutationDelete = useMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      enqueueSnackbar("Feature deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: () => enqueueSnackbar("Failed to delete feature", { variant: "error" }),
  });

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
                  onClick={() => setSelectedFeature(feature)} // ✅ works now
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => mutationDelete.mutate(feature.id)}
                >
                  View
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
              component={Link}
              to="/admindashboard/features/add"
            >
              Add New Feature
            </Button>
    </TableContainer>
  );
}
