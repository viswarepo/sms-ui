import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";

const drawerWidth = 240;

export default function CustomerDashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <CustomerSidebar drawerWidth={drawerWidth} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,   // ✅ take remaining width
        }}
      >
        <CustomerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
