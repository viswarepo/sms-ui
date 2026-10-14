// src/components/SubscribersTable.jsx
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button
} from "@mui/material";
import api from "../api/axios";

async function fetchSubscribers() {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/api/v1/subscriptions/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data?.subscriptions || [];
}

export default function SubscribersTable() {
  const { data: subscribers = [], isLoading, isError } = useQuery({
    queryKey: ["subscribers"],
    queryFn: fetchSubscribers,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load subscribers</Typography>;

  // Show only latest 5 subscribers (sorted by createdAt if available)
  const latestSubscribers = [...subscribers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Latest Subscribers
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subscription Id</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Cycle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {latestSubscribers.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>{sub.id}</TableCell>
              <TableCell>{sub.customerName || sub.customer?.name}</TableCell>
              <TableCell>{sub.planCode}</TableCell>
              <TableCell>{sub.billingCycle}</TableCell>
            </TableRow>
          ))}

          {/* Add More Info row at bottom */}
    <TableRow>
      <TableCell colSpan={3} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admindashboard/subscriptions")}
        >
          More Info
        </Button>
      </TableCell>
    </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
