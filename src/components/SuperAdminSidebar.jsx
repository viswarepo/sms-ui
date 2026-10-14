// src/pages/admin/Header.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";


import { NavLink } from "react-router-dom";
import "../styles/global.css";

const menuItems = [
  { text: "My Dashboard", icon: <DashboardIcon />, path: "/superadmin-dashboard" },
  { text: "Manage Admin Users", icon: <DashboardIcon />, path: "/superadmin-dashboard/superadmin-userProfile" },
  { text: "Explore Plans", icon: <InventoryIcon />, path: "/superadmin-dashboard/superadmin-browsecatelog" },
  { text: "My Subscription", icon: <InventoryIcon />, path: "/superadmin-dashboard/superadmin-mysubscription" },
 // { text: "Create Subscription", icon: <InventoryIcon />, path: "/customerdashboard/create-subscription" },
 // { text: "My Invoices", icon: <PaymentIcon />, path: "/customerdashboard/myinvoices" },
 // { text: "My Transactions", icon: <PaymentIcon />, path: "/customerdashboard/mytransactions" },
  { text: "Billing & Payments", icon: <PaymentIcon />, path: "/superadmin-dashboard/superadmin-billingdashboard" },
  { text: "My Payment Methods", icon: <PaymentIcon />, path: "/superadmin-dashboard/mypaymethods" },
  
 // { text: "Billing & Payments", icon: <PaymentIcon />, path: "/customerdashboard/create-subscription" },
   { text: "Org Profile (Self)", icon: <SettingsIcon />, path: "/superadmin-dashboard/superadmin-orgprofile" },
   { text: "My Settings", icon: <SettingsIcon />, path: "/superadmin-dashboard/tenant-settings" },
   { text: "FAQ", icon: <SettingsIcon />, path: "/login" },
   { text: "Support", icon: <SettingsIcon />, path: "/login" },
   { text: "Need Help? Chat Now ", icon: <SettingsIcon />, path: "/login" }
];

export default function SuperAdminSidebar({ drawerWidth }) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
