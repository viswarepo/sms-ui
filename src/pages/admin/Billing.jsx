import { Typography, Paper } from "@mui/material";

export default function Billing() {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5">Billing</Typography>
      <Typography>Manage invoices, subscriptions, and billing history here.</Typography>
    </Paper>
  );
}
