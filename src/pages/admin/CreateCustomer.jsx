import { useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios"; // adjust path if needed

export default function CreateCustomer() {
  const { enqueueSnackbar } = useSnackbar();

  const [organizationId, setOrganizationId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    const payload = { username, email, mobile, password, name };
    await api.post("/api/v1/customers/create", payload, {
      headers: { "X-Organization-Id": organizationId },
    });

    enqueueSnackbar("Customer + User created successfully!", { variant: "success" });
    navigate("/admindashboard/customers");

  } catch (err) {
    let errorMessage = "Failed to create customer";
    enqueueSnackbar(errorMessage, { variant: "error" });
  }
}



  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Customer
        </Typography>
        <form onSubmit={handleSubmit}>
         
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mobile"
            fullWidth
            margin="normal"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        
          <TextField
            type="password"
            label="Password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
          >
            Create Customer
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
