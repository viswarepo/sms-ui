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
  { text: "AdminDashboard", icon: <DashboardIcon />, path: "/admindashboard" },
  { text: "Products", icon: <InventoryIcon />, path: "/admindashboard/products" },
  { text: "Manage Plans", icon: <PaymentIcon />, path: "/admindashboard/plans" },
  { text: "Features", icon: <PaymentIcon />, path: "/admindashboard/features" },
  { text: "Subscriptions", icon: <PeopleIcon />, path: "/admindashboard/subscriptions" },
  { text: "Customers", icon: <PeopleIcon />, path: "/admindashboard/customers" },
  
  { text: "User Profile", icon: <SettingsIcon />, path: "/admindashboard/userProfile" },
  { text: "Settings", icon: <SettingsIcon />, path: "/admindashboard/settings" },
  { text: "Alert Templates", icon: <SettingsIcon />, path: "/admindashboard/alert-templates" },
];

const paymenMenuItems = [
  { text: "PaymentHistory", icon: <SettingsIcon />, path: "/admindashboard/payment/paymenthistory" },
  { text: "Refund", icon: <SettingsIcon />, path: "/admindashboard/payment/refund" },
  { text: "Analytics", icon: <BarChartIcon />, path: "/admindashboard/payment/analytics" },
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
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admindashboard/billing/invoicehistory">
              <ListItemText primary="Invoice History" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admindashboard/billing/reports">
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
