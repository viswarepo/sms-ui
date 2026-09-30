import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Plans from "./pages/admin/Plans.jsx";
import Products from "./pages/admin/Products.jsx";
import UserProfile from "./pages/admin/UserProfile.jsx";
import Subscriptions from "./pages/admin/Subscriptions.jsx";
import DashboardHome from "./pages/admin/DashboardHome.jsx";
import AddProduct from "./pages/admin/Addproduct.jsx";
import Customers from "./pages/admin/Customers.jsx";
import CreateCustomer from "./pages/admin/CreateCustomer.jsx"; 
import AddPlan from "./pages/admin/AddPlan.jsx"; 
import Billing from "./pages/admin/Billing.jsx"; 
import Features from "./pages/admin/Features.jsx"; 
import AddFeature from "./pages/admin/AddFeature.jsx"; 
import RazorpayPlan from "./pages/admin/PaymentPlans.jsx"; 
import AddRazorpayPlan from "./pages/admin/AddPaymentPlan.jsx"; 
import AddUser from "./pages/admin/AddUser.jsx";
import InvoiceHistory from "./pages/admin/InvoiceHistory.jsx";
import PaymentHistory from "./pages/admin/PaymentHistory.jsx";
import Refund from "./pages/admin/Refund.jsx";
import AlertTemplates from "./pages/admin/listAlertTemplates.jsx";
import CreateAlertTemplate from "./pages/admin/CreateAlertTemplate.jsx";

// Customer pages
import CustomerDashboard from "./pages/customer/CustomerDashboard.jsx";
import CreateSubscription from "./pages/customer/CreateSubscription.jsx";
import MySubscription from "./pages/customer/MySubscriptions.jsx";
import CustomerProfile from "./pages/customer/CustomerProfile.jsx";
import BrowseCatelog from "./pages/customer/BrowseCatelog.jsx";
import NewSubscriptions from "./pages/customer/NewSubscriptions.jsx";
import MyInvoices from "./pages/customer/MyInvoices.jsx";
import MyTransactions from "./pages/customer/MyTransactions.jsx";
import BillingDashBoard from "./pages/customer/BillingDashboard.jsx";
import MyPayMethods from "./pages/customer/MyPaymentMethods.jsx";


import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root "/" to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard with nested routes */}
        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />   {/* ✅ nested here */}
          <Route path="plans" element={<Plans />} />
          <Route path="plans/add" element={<AddPlan />} />         {/* ✅ nested here */}
          <Route path="features" element={<Features />} />
          <Route path="features/add" element={<AddFeature />} />   {/* ✅ nested here */}
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<CreateCustomer />} /> {/* ✅ nested here */}
          <Route path="userProfile" element={<UserProfile />} />
          <Route path="userProfile/add" element={<AddUser />} />   {/* ✅ nested here */}
          <Route path="billing" element={<Billing />} />
          <Route path="paymentplan" element={<RazorpayPlan />} />
          <Route path="paymentplan/add" element={<AddRazorpayPlan />} /> {/* ✅ nested here */}
          <Route path="/admindashboard/billing/invoicehistory" element={<InvoiceHistory />} />
          <Route path="/admindashboard/payment/paymenthistory" element={<PaymentHistory />} />
          <Route path="/admindashboard/payment/refund" element={<Refund />} />
          <Route path="/admindashboard/alert-templates" element={<AlertTemplates />} />
          <Route path="/admindashboard/create-alert-template" element={<CreateAlertTemplate />} />
        </Route>

        {/* Customer Portal */}
        <Route path="/customerdashboard" element={<CustomerDashboard />}>
          <Route path="create-subscription" element={<CreateSubscription />} />
          <Route path="create-subscription/:planId" element={<CreateSubscription />} />
          <Route path="new-subscription/:planId" element={<NewSubscriptions />} />
          <Route path="mysubscription" element={<MySubscription />} />
          <Route path="mytransactions" element={<MyTransactions />} />
          <Route path="mypaymethods" element={<MyPayMethods />} />
          <Route path="customerprofile" element={<CustomerProfile />} />
          <Route path="browsecatelog" element={<BrowseCatelog />} />
          <Route path="myinvoices" element={<MyInvoices />} />
          <Route path="billingdashboard" element={<BillingDashBoard />} />
        </Route>

        <Route path="/signup" element={<Signup />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
