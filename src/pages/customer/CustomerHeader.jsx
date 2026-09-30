// src/components/Header.jsx
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function CustomerHeader() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const profileImage = localStorage.getItem("profileImage"); 
  // You can set this after login or fetch from /api/v1/customers/me

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.clear();
      navigate("/login");
    }
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Left side: App title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Customer Dashboard
        </Typography>

        {/* Right side: profile + logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Profile image + name */}
          {profileImage ? (
            <Avatar src={profileImage} alt={username} />
          ) : (
            <AccountCircle />
          )}
          <Typography variant="body1">{username}</Typography>

          {/* Logout button */}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
