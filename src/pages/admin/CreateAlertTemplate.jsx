import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Box, Typography, Paper, TextField, Button,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

async function fetchAlertCodes() {
  const { data } = await api.get("/api/v1/notification-templates/alertcode");
  return data;
}

async function createNotification(template) {
  const { data } = await api.post("/api/v1/notification-templates/create", template);
  return data;
}

export default function CreateNotification() {
  const [form, setForm] = useState({
    code: "",
    channel: "EMAIL",
    subject: "",
    body: "",
    active: true,
  });

  const { data: alertCodes = [] } = useQuery({
    queryKey: ["alertCodes"],
    queryFn: fetchAlertCodes,
  });

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      enqueueSnackbar("Notification template created!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const userRole = localStorage.getItem("role");
        navigate("/ownerdashboard/owner-alert-templates");
     
    },
    onError: () => enqueueSnackbar("Failed to create template", { variant: "error" }),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate(form);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Notification Template
      </Typography>
      <Paper sx={{ p: 3 }}>

        {/* Channel Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Channel</InputLabel>
          <Select
            name="channel"
            value={form.channel}
            onChange={handleChange}
          >
            <MenuItem value="EMAIL">EMAIL</MenuItem>
            <MenuItem value="SMS">SMS</MenuItem>
          </Select>
        </FormControl>

        {/* Alert Code Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Alert Code</InputLabel>
          <Select
            name="code"
            value={form.code}
            onChange={handleChange}
          >
            {alertCodes
              .filter(ac => ac.channel === form.channel)
              .map(ac => (
                <MenuItem key={ac.code} value={ac.code}>
                  {ac.code} - {ac.description}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        
        {/* Subject only for EMAIL */}
        {form.channel === "EMAIL" && (
          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}

        {/* Body */}
        <TextField
          label="Body"
          name="body"
          value={form.body}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={form.channel === "SMS" ? 2 : 4}
        />

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={mutation.isLoading}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
}
