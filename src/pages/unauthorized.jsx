import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" color="error" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don’t have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/login")}>
        Go to Login
      </Button>
    </Box>
  );
}
