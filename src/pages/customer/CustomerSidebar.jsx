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
import "../../styles/global.css";

const menuItems = [
  { text: "My Dashboard", icon: <DashboardIcon />, path: "/customerdashboard" },
  { text: "Explore Plans", icon: <InventoryIcon />, path: "/customerdashboard/browsecatelog" },
  { text: "My Subscription", icon: <InventoryIcon />, path: "/customerdashboard/mysubscription" },
 // { text: "Create Subscription", icon: <InventoryIcon />, path: "/customerdashboard/create-subscription" },
 // { text: "My Invoices", icon: <PaymentIcon />, path: "/customerdashboard/myinvoices" },
 // { text: "My Transactions", icon: <PaymentIcon />, path: "/customerdashboard/mytransactions" },
  { text: "Billing & Payments", icon: <PaymentIcon />, path: "/customerdashboard/billingdashboard" },
  { text: "My Payment Methods", icon: <PaymentIcon />, path: "/customerdashboard/mypaymethods" },
  
 // { text: "Billing & Payments", icon: <PaymentIcon />, path: "/customerdashboard/create-subscription" },
   { text: "My Profile", icon: <SettingsIcon />, path: "/customerdashboard/customerprofile" },
   { text: "FAQ", icon: <SettingsIcon />, path: "/login" },
   { text: "Support", icon: <SettingsIcon />, path: "/login" },
   { text: "Need Help? Chat Now ", icon: <SettingsIcon />, path: "/login" }
];

export default function CustomerSidebar({ drawerWidth }) {
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
