import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import OwnerHeader from "./OwnerHeader";

const drawerWidth = 240;

export default function OwnerDashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <OwnerSidebar drawerWidth={drawerWidth} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,   // ✅ take remaining width
        }}
      >
        <OwnerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
