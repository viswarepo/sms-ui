// src/pages/DashboardHome.jsx
import { Container, Grid, Paper } from "@mui/material";
import DashboardCards from "../../components/DashboardCards.jsx";
import RevenueChart from "../../components/RevenueChart.jsx";
import SubscribersTable from "../../components/SubscribersTable.jsx";
import InvoicesTable from "../../components/InvoicesTable.jsx";

export default function DashboardHome() {
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <DashboardCards />

      <Paper sx={{ mt: 3, p: 2 }}>
        <RevenueChart />
      </Paper>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <SubscribersTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <InvoicesTable />
        </Grid>
      </Grid>
    </Container>
  );
}
