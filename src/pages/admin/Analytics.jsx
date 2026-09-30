// src/pages/Analytics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Grid,
  CircularProgress
} from "@mui/material";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your backend endpoint
    axios.get("http://localhost:5000/api/analytics/revenue")
      .then((res) => {
        // Ensure the API returns numeric values
        const formatted = res.data.map((item) => ({
          month: item.month,
          revenue: Number(item.revenue)
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Revenue Analytics
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
