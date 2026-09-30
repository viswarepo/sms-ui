import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Box,
  TextField,
  TablePagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState } from "react";

async function fetchCustomers() {
  const { data } = await api.get("/api/v1/customers/all");
  return data;
}

async function deleteCustomer(id) {
  await api.delete(`/api/v1/customers/${id}`);
}

export default function ListCustomers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const mutationDelete = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      enqueueSnackbar("Customer deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => enqueueSnackbar("Failed to delete customer", { variant: "error" }),
  });

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <Typography color="error">Error loading customers</Typography>;

  const customers = Array.isArray(data) ? data : data?.customers || [];

  // ✅ Apply filters
  const filteredCustomers = customers.filter((c) => {
    return (
      (nameFilter ? c.name?.toLowerCase().includes(nameFilter.toLowerCase()) : true) &&
      (emailFilter ? c.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true)
    );
  });

  // ✅ Slice for pagination
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Customers
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
    <Typography variant="h5">Customers</Typography>

    {/* ✅ Add Customer Button */}
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/admindashboard/customers/add"
    >
      Add Customer
    </Button>
  </Box>

      {/* Filter Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          mb: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Filters:
        </Typography>
        <TextField
          label="By Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <TextField
          label="By Email"
          variant="outlined"
          size="small"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
      </Box>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>External Id</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.mobile}</TableCell>
              <TableCell>{customer.externalId}</TableCell>
              <TableCell sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/admindashboard/customers/${customer.id}/edit`}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to={`/admindashboard/customers/${customer.id}/view`}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Pagination Controls */}
      <TablePagination
        component="div"
        count={filteredCustomers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
}
