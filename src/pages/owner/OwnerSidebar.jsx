// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";

const menuItems = [
  { text: "Owner Dashboard", icon: <DashboardIcon />, path: "/ownerdashboard" },
  { text: "Manage Organization", icon: <DashboardIcon />, path: "/ownerdashboard/listorganization" },
  { text: "Manage Users", icon: <SettingsIcon />, path: "/ownerdashboard/owner-userProfile" },
  //{ text: "Manage Customers", icon: <PeopleIcon />, path: "/ownerdashboard/owner-customers" },
  { text: "Manage Products", icon: <InventoryIcon />, path: "/ownerdashboard/owner-products" },
  { text: "Manage Plans", icon: <PaymentIcon />, path: "/ownerdashboard/owner-plans" },
  { text: "Manage Features", icon: <PaymentIcon />, path: "/ownerdashboard/owner-features" },
  { text: "Tenant Subscriptions", icon: <PeopleIcon />, path: "/ownerdashboard/owner-subscriptions" },  
  { text: "My Settings", icon: <SettingsIcon />, path: "/ownerdashboard/owner-settings" },
  { text: "Alert Templates", icon: <SettingsIcon />, path: "/ownerdashboard/owner-alert-templates" },
];

const paymenMenuItems = [
  { text: "Payment History", icon: <SettingsIcon />, path: "/ownerdashboard/payment/owner-paymenthistory" },
  { text: "Refund", icon: <SettingsIcon />, path: "/ownerdashboard/payment/owner-refund" },
  { text: "Analytics", icon: <BarChartIcon />, path: "/ownerdashboard/payment/owner-analytics" },
];

export default function Sidebar({ drawerWidth }) {
  const [openBilling, setOpenBilling] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);

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

        {/* Billing with submenu */}
        <ListItemButton onClick={() => setOpenBilling(!openBilling)}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
          {openBilling ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openBilling} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/ownerdashboard/billing/owner-invoicehistory">
              <ListItemText primary="Invoice History" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/ownerdashboard/billing/owner-reports">
              <ListItemText primary="Reports" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Payment with submenu */}
        <ListItemButton onClick={() => setOpenPayment(!openPayment)}>
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Payment" />
          {openPayment ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPayment} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
             {paymenMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
