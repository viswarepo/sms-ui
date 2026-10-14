import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

async function fetchNotifications() {
  const { data } = await api.get("/api/v1/notification-templates/all");
  return Array.isArray(data) ? data : data?.templates || [];
}

export default function ListNotification() {
  const { data: templates = [], isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (isError) return <Typography color="error">Failed to load notifications</Typography>;


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Notification Templates</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/ownerdashboard/owner-create-alert-template"
        >
          Create New Alert Template
        </Button>
      </Box>

      {templates.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            No notification templates found.
          </Typography>
       
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Organization ID</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Body</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.code}</TableCell>
                  <TableCell>{t.organizationId}</TableCell>
                  <TableCell>{t.channel}</TableCell>
                  <TableCell>{t.subject || "-"}</TableCell>
                  <TableCell>{t.body}</TableCell>
                  <TableCell>{t.active ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
