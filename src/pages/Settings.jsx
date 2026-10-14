import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Settings() {

  const handleResetPassword = () => {
    const userRole = localStorage.getItem("role"); // or from auth context
    if (userRole === "ROLE_OWNER") {
      navigate("/ownerdashboard/owner-reset-password");
    } else if (userRole === "ROLE_SUPER_ADMIN") {
      navigate("/superadmin-dashboard/tenant-reset-password");
    } else if (userRole === "ROLE_ADMIN") {
      navigate("/admindashboard/tenant-admin-reset-password");
    } else if (userRole === "ROLE_CUSTOMER") {
      navigate("/customerdashboard/tenant-customer-reset-password");
    } else {
      enqueueSnackbar("Unauthorized role", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Account Settings
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Reset Password button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/ownerdashboard/owner-reset-password"
          >
            Reset Password
          </Button>

          {/* Optional: Add other settings actions */}
          <Button
            variant="outlined"
            fullWidth
            component={Link}
            to="/profile"
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
