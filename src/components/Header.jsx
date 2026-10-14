// src/components/Header.jsx
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CustomerHeader() {
  const navigate = useNavigate();
  const orgName = localStorage.getItem("organizationName")
   const username = localStorage.getItem("username");
  const profileImage = localStorage.getItem("profileImage"); 
  async function handleLogout() {
    try {
      // Call backend logout API (optional if you invalidate token server-side)
      await api.post("/auth/logout");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("organizationId");
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if API fails, clear local storage to force logout
      localStorage.clear();
      navigate("/login");
    }
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Left side: App title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Tenant | Admin | Dashboard | {orgName}
        </Typography>

        {/* Right side: user info + actions */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          
          {/* Profile image + name */}
          {profileImage ? (
            <Avatar src={profileImage} alt={username} />
          ) : (
            <AccountCircle />
          )}
          <Typography variant="body1">{username}</Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
