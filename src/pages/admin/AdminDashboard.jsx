// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import Header from "../../components/Header.jsx";
import { Box } from "@mui/material";

const drawerWidth = 240;

export default function AdminDashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,   // ✅ take remaining width
        }}
      >
        <Header />
        <Outlet />
      </Box>
    </Box>
  );
}
