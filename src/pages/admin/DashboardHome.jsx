import { Container, Grid, Paper } from "@mui/material";
import DashboardCards from "../../components/DashboardCards.jsx";
import RevenueChart from "../../components/RevenueChart.jsx";
import SubscribersTable from "../../components/SubscribersTable.jsx";
import InvoicesTable from "../../components/InvoicesTable.jsx";

export default function DashboardHome() {
  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <DashboardCards />

      <Paper sx={{ mt: 1, p: 2 , width:1220}}>
        <RevenueChart />
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
          <SubscribersTable />
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
            <InvoicesTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
