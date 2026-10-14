import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button
} from "@mui/material";
import { useSnackbar } from "notistack";
import EditProductDialog from "./EditProductDialog.jsx"; // ✅ default import

// Fetch products
async function fetchProducts() {
  console.log("Tenant login org id ==>", localStorage.getItem("organizationId"));
  const role = localStorage.getItem("role");
  const { data } = await api.get("/api/v1/products/all/"+role);
  return Array.isArray(data) ? data : data?.products || [];
}

// Update product
async function updateProduct(product) {
  console.log("Updating product id:", product.id);
  const { data } = await api.patch(`/api/v1/products/update/${product.id}`, product);
  return data;
}

// Delete product
async function deleteProduct(id) {
  await api.delete(`/api/v1/products/${id}`);
}

export default function Products() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Mutations
  const mutationUpdate = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      enqueueSnackbar("Product updated successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => enqueueSnackbar("Failed to update product", { variant: "error" }),
  });

  const mutationDelete = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      enqueueSnackbar("Product deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => enqueueSnackbar("Failed to delete product", { variant: "error" }),
  });

  // Role-based navigation
  const handleAddProduct = () => {
    const userRole = localStorage.getItem("role"); // or from context/auth
    if (userRole === "ROLE_ADMIN") {
      navigate("/admindashboard/products/add");
    } else if (userRole === "ROLE_OWNER") {
      navigate("/ownerdashboard/owner-products/add");
    } else {
      enqueueSnackbar("Unauthorized role", { variant: "error" });
    }
  };

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <Typography color="error">Error loading products</Typography>;

  const products = Array.isArray(data) ? data : [];

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ p: 2 }}>Products</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Code</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Organization Id</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Active Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productCode}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.organizationId}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.active ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => setSelectedProduct(product)}
                >
                  Edit
                </Button>
             
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <EditProductDialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onSave={(updated) => mutationUpdate.mutate(updated)}
      />

      <Button
        sx={{ m: 2 }}
        variant="contained"
        color="success"
        onClick={handleAddProduct}
      >
        Add New Product
      </Button>
    </TableContainer>
  );
}
