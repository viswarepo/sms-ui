// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../../components/SuperAdminSidebar.jsx";
import SuperAdminHeader from "../../components/SuperAdminHeader.jsx";
import { Box } from "@mui/material";

const drawerWidth = 240;

export default function SuperAdminDashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <SuperAdminSidebar drawerWidth={drawerWidth} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,   // ✅ take remaining width
        }}
      >
        <SuperAdminHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
