// src/components/DashboardCards.jsx
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import api from "../api/axios";

export default function DashboardCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/api/v1/billing/dashboard/card", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // Map backend response into cards
        setCards([
          { title: "Users", value: data.totalCustomers ?? 0 },
          { title: "Revenue", value: data.revenue ?? 0 }, // dynamic if backend provides
          { title: "Active Plans", value: data.totalPlan ?? 0 },
          { title: "Subscribers", value: data.totalSubscribers ?? 0 },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card>
            <CardContent>
              <Typography variant="h6">{card.title}</Typography>
              <Typography variant="body1">{card.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
