import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "../../api/axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Select, MenuItem, FormControl, InputLabel,
  Box, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

async function fetchSubscriptions() {
  const { data } = await api.get('/api/v1/subscriptions/all');
  return data;
}
async function cancelSubscription(id) {
  await api.post(`/api/v1/subscriptions/${id}/cancel`);
}

export default function Subscriptions() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");

  // ✅ dialog state
  const [open, setOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  // ✅ pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions,
  });

  const mutation = useMutation({
    mutationFn: cancelSubscription,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['subscriptions'] });
      const previousData = queryClient.getQueryData(['subscriptions']);
      queryClient.setQueryData(['subscriptions'], (old = []) =>
        old.map((sub) => (sub.id === id ? { ...sub, status: 'Canceled' } : sub))
      );
      return { previousData };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['subscriptions'], context.previousData);
      enqueueSnackbar('Failed to cancel subscription', { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Subscription canceled successfully', { variant: 'success' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  if (isLoading) return <p>Loading subscriptions...</p>;
  if (error) return <p>Error loading subscriptions</p>;

  const subscriptions = Array.isArray(data) ? data : data?.subscriptions || [];

  // Apply filters
  const filteredSubscriptions = subscriptions.filter((s) => {
    return (
      (statusFilter ? s.status === statusFilter : true) &&
      (planFilter ? s.planCode === planFilter : true) &&
      (customerFilter ? s.customerName?.toLowerCase().includes(customerFilter.toLowerCase()) : true)
    );
  });

  // ✅ slice for pagination
  const paginatedSubscriptions = filteredSubscriptions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleView = (sub) => {
    setSelectedSub(sub);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSub(null);
  };

  return (
    <Box>
      {/* Filter Controls */}
      <Box sx={{ mb: 2 }}>
        <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3, p: 2, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}> Filters: </Typography>
          {/* Status filter */}
          <FormControl sx={{ minWidth: 150 }} size="small" variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="TRIALING">Trialing</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PAST_DUE">Past Due</MenuItem>
              <MenuItem value="PAUSED">Paused</MenuItem>
              <MenuItem value="CANCELED">Canceled</MenuItem>
              <MenuItem value="EXPIRED">Expired</MenuItem>
            </Select>
          </FormControl>
          {/* Plan filter */}
          <FormControl sx={{ minWidth: 150 }} size="small" variant="outlined">
            <InputLabel>Plan</InputLabel>
            <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} label="Plan">
              <MenuItem value="">All</MenuItem>
              {[...new Set(subscriptions.map((s) => s.planCode))].map((plan) => (
                <MenuItem key={plan} value={plan}>{plan}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Customer filter */}
          <FormControl sx={{ minWidth: 200 }} size="small" variant="outlined">
            <InputLabel>Customer</InputLabel>
            <Select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} label="Customer">
              <MenuItem value="">All</MenuItem>
              {[...new Set(subscriptions.map((s) => s.customerName))].map((cust) => (
                <MenuItem key={cust} value={cust}>{cust}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* Subscription Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ p: 2 }}>Subscriptions</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Product Code</TableCell>
              <TableCell>Plan Code</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.customerName}</TableCell>
                <TableCell>{subscription.productCode}</TableCell>
                <TableCell>{subscription.planCode}</TableCell>
                <TableCell>{subscription.billingCycle}</TableCell>
                <TableCell>{subscription.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleView(subscription)}>View</Button>
                  <Button variant="outlined" color="error" onClick={() => mutation.mutate(subscription.id)} disabled={subscription.status === 'Canceled'}>Cancel</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ✅ Pagination */}
        <TablePagination
          component="div"
          count={filteredSubscriptions.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent dividers>
          {selectedSub && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1 }}>
              <Typography>ID:</Typography><Typography>{selectedSub.id}</Typography>
              <Typography>Organization ID:</Typography><Typography>{selectedSub.organizationId}</Typography>
              <Typography>Customer ID:</Typography><Typography>{selectedSub.customer?.id}</Typography>
              <Typography>Customer Name:</Typography><Typography>{selectedSub.customer?.name}</Typography>
              <Typography>Product Code:</Typography><Typography>{selectedSub.productCode}</Typography>
              <Typography>Plan Code:</Typography><Typography>{selectedSub.planCode}</Typography>
              <Typography>Plan Version:</Typography><Typography>{selectedSub.planVersion}</Typography>
              <Typography>Status:</Typography><Typography>{selectedSub.status}</Typography>
              <Typography>Currency:</Typography><Typography>{selectedSub.currency}</Typography>
              <Typography>Billing Cycle:</Typography><Typography>{selectedSub.billingCycle}</Typography>
              <Typography>Unit Amount:</Typography><Typography>{selectedSub.unitAmount}</Typography>
              <Typography>Current Period Start:</Typography><Typography>{selectedSub.currentPeriodStart}</Typography>
              <Typography>Current Period End:</Typography><Typography>{selectedSub.currentPeriodEnd}</Typography>
              <Typography>Trial End:</Typography><Typography>{selectedSub.trialEnd}</Typography>
               <Typography>Cancel At Period End:</Typography><Typography>{String(selectedSub.cancelAtPeriodEnd)}</Typography>
              <Typography>Canceled At:</Typography><Typography>{selectedSub.canceledAt}</Typography>
              <Typography>Ended At:</Typography><Typography>{selectedSub.endedAt}</Typography>
              <Typography>Scheduled Plan Code:</Typography><Typography>{selectedSub.scheduledPlanCode}</Typography>
              <Typography>Scheduled Plan Version:</Typography><Typography>{selectedSub.scheduledPlanVersion}</Typography>
              <Typography>Scheduled Unit Amount:</Typography><Typography>{selectedSub.scheduledUnitAmount}</Typography>
              <Typography>Scheduled Billing Cycle:</Typography><Typography>{selectedSub.scheduledBillingCycle}</Typography>
              <Typography>Created At:</Typography><Typography>{selectedSub.createdAt}</Typography>
              <Typography>Updated At:</Typography><Typography>{selectedSub.updatedAt}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}