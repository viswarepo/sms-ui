import { Container, Grid, Paper } from "@mui/material";
import OwnerDashboardCards from "../../components/DashboardCards.jsx";
import OwnerRevenueChart from "../../components/RevenueChart.jsx";
import OwnerSubscribersTable from "../../components/SubscribersTable.jsx";
import OwnerInvoicesTable from "../../components/InvoicesTable.jsx";

export default function OwnerDashboardHome() {
  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <OwnerDashboardCards />

      <Paper sx={{ mt: 1, p: 2 , width:1220}}>
        <OwnerRevenueChart />
      </Paper>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              height: 300,
              width:600,
              overflow: "auto",
              p: 1,
              fontSize: "0.2rem"   // smaller font size
            }}
          >
          <OwnerSubscribersTable />
        </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
              sx={{
                height: 300,
                width:600,         // same height as SubscribersTable
                overflow: "auto",     // scrollbar if overflow
                p: 1,
                fontSize: "0.2rem"   // smaller font size
              }}
            >
            <OwnerInvoicesTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
