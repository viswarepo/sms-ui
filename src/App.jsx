import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

// Owner pages

//import OwnerOrganizationProfile from "./pages/owner/OrganizationProfile.jsx";

import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import OwnerDashboardHome from "./pages/owner/OwnerDashboardHome.jsx";
import ListOrganization from "./pages/owner/ListOrganization.jsx";
import AddOrganization from "./pages/owner/AddOrganization.jsx";
import OwnerProducts from "./pages/admin/Products.jsx";
import OwnerAddProduct from "./pages/admin/Addproduct.jsx";

import OwnerPlans from "./pages/admin/Plans.jsx";
import OwnerAddPlan from "./pages/admin/AddPlan.jsx"; 

import OwnerSubscriptions from "./pages/admin/Subscriptions.jsx";

import OwnerUserProfile from "./pages/admin/UserProfile.jsx";
import OwnerAddUser from "./pages/admin/AddUser.jsx";

import OwnerCustomers from "./pages/admin/Customers.jsx";
import OwnerCreateCustomer from "./pages/admin/CreateCustomer.jsx"; 

import OwnerFeatures from "./pages/admin/Features.jsx"; 
import OwnerAddFeature from "./pages/admin/AddFeature.jsx"; 

import OwnerRazorpayPlan from "./pages/admin/PaymentPlans.jsx"; 
import OwnerAddRazorpayPlan from "./pages/admin/AddPaymentPlan.jsx"; 

import OwnerInvoiceHistory from "./pages/admin/InvoiceHistory.jsx";
import OwnerPaymentHistory from "./pages/admin/PaymentHistory.jsx";
import OwnerRefund from "./pages/admin/Refund.jsx";

import OwnerAlertTemplates from "./pages/admin/listAlertTemplates.jsx";
import OwnerCreateAlertTemplate from "./pages/admin/CreateAlertTemplate.jsx";

// Client/Tenent Super Admin pages
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard.jsx";
//import SuperAdminDashboardHome from "./pages/superadmin/SuperAdminDashboardHome.jsx";
import SuperAdminBrowseCatelog from "./pages/customer/BrowseCatelog.jsx";
import SuperAdminNewSubscriptions from "./pages/customer/NewSubscriptions.jsx";
import SuperAdminMySubscription from "./pages/customer/MySubscriptions.jsx";
import SuperAdminBillingDashBoard from "./pages/customer/BillingDashboard.jsx";
import SuperAdminCustomerProfile from "./pages/customer/CustomerProfile.jsx";
import SuperAdminOrgProfile from "./pages/owner/OrganizationProfile.jsx";
import SuperAdminUserProfile from "./pages/admin/UserProfile.jsx";
import SuperAdminAddUser from "./pages/admin/AddUser.jsx";

// Client/Tenent Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import DashboardHome from "./pages/admin/DashboardHome.jsx";

import Products from "./pages/admin/Products.jsx";
import AddProduct from "./pages/admin/Addproduct.jsx";

import Plans from "./pages/admin/Plans.jsx";
import AddPlan from "./pages/admin/AddPlan.jsx"; 

import Features from "./pages/admin/Features.jsx"; 
import AddFeature from "./pages/admin/AddFeature.jsx"; 

import Customers from "./pages/admin/Customers.jsx";
import CreateCustomer from "./pages/admin/CreateCustomer.jsx"; 

import UserProfile from "./pages/admin/UserProfile.jsx";
import AddUser from "./pages/admin/AddUser.jsx";
import Subscriptions from "./pages/admin/Subscriptions.jsx";

import Billing from "./pages/admin/Billing.jsx"; 

import RazorpayPlan from "./pages/admin/PaymentPlans.jsx"; 
import AddRazorpayPlan from "./pages/admin/AddPaymentPlan.jsx"; 

import InvoiceHistory from "./pages/admin/InvoiceHistory.jsx";
import PaymentHistory from "./pages/admin/PaymentHistory.jsx";
import Refund from "./pages/admin/Refund.jsx";
import AlertTemplates from "./pages/admin/listAlertTemplates.jsx";
import CreateAlertTemplate from "./pages/admin/CreateAlertTemplate.jsx";

// Client/Tenant-  Customer pages
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

import TenantSignup from "./pages/TenantSignup.jsx";
import TenantCustomerSignup from "./pages/TenantCustomerSignup.jsx";

import OwnerSettings from "./pages/Settings.jsx";
import TenantSettings from "./pages/Settings.jsx";
import TenantAdminSettings from "./pages/Settings.jsx";
import TenantCustomerSettings from "./pages/Settings.jsx";

import OwnerResetPassword from "./pages/ResetPassword.jsx";
import TenantResetPassword from "./pages/ResetPassword.jsx";
import TenantAdminResetPassword from "./pages/ResetPassword.jsx";
import TenantCustomerResetPassword from "./pages/ResetPassword.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root "/" to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Super Admin Dashboard with nested routes */}
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />}>
         {/* <Route index element={<SuperAdminDashboardHome />} /> */}
          <Route path="superadmin-browsecatelog" element={<SuperAdminBrowseCatelog />} />
          <Route path="superadmin-new-subscription/:planId" element={<SuperAdminNewSubscriptions />} />
          <Route path="superadmin-mysubscription" element={<SuperAdminMySubscription />} />
          <Route path="superadmin-billingdashboard" element={<SuperAdminBillingDashBoard />} />
          <Route path="superadmin-customerprofile" element={<SuperAdminCustomerProfile />} />
          <Route path="superadmin-orgprofile" element={<SuperAdminOrgProfile />} />
          <Route path="superadmin-userProfile" element={<SuperAdminUserProfile />} />
          <Route path="superadmin-userProfile/add" element={<SuperAdminAddUser />} />   {/* ✅ nested here */}

          <Route path="tenant-settings" element={<TenantSettings />} />
          <Route path="tenant-reset-password" element={<TenantResetPassword />} />

        </Route>

        {/* Client Admin Dashboard with nested routes */}
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

          <Route path="tenant-admin-settings" element={<TenantAdminSettings />} />
          <Route path="tenant-admin--reset-password" element={<TenantAdminResetPassword />} />

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

          <Route path="tenant-customer-settings" element={<TenantCustomerSettings />} />
          <Route path="tenant-customer-reset-password" element={<TenantCustomerResetPassword />} />

        </Route>

        <Route path="/tenant-signup" element={<TenantSignup />} />
        <Route path="/tenant-customer-signup" element={<TenantCustomerSignup />} />

        {/* Owner-Admin Portal */}
        <Route path="/ownerdashboard" element={<OwnerDashboard />}>
            <Route index element={<OwnerDashboardHome />} />
           <Route path="listorganization" element={<ListOrganization />} />
           <Route path="listorganization/add" element={<AddOrganization />} />   {/* ✅ nested here */}
           <Route path="owner-products" element={<OwnerProducts />} />
            <Route path="owner-products/add" element={<OwnerAddProduct />} />   {/* ✅ nested here */}

           <Route path="owner-plans" element={<OwnerPlans />} />
           <Route path="owner-plans/add" element={<OwnerAddPlan />} />         {/* ✅ nested here */}

            <Route path="owner-features" element={<OwnerFeatures />} />
            <Route path="owner-features/add" element={<OwnerAddFeature />} />   {/* ✅ nested here */}

            <Route path="owner-subscriptions" element={<OwnerSubscriptions />} />

            <Route path="owner-customers" element={<OwnerCustomers />} />
            <Route path="owner-customers/add" element={<OwnerCreateCustomer />} /> {/* ✅ nested here */}

            <Route path="owner-userProfile" element={<OwnerUserProfile />} />
            <Route path="owner-userProfile/add" element={<OwnerAddUser />} />   {/* ✅ nested here */}

            <Route path="owner-alert-templates" element={<OwnerAlertTemplates />} />
            <Route path="owner-create-alert-template" element={<OwnerCreateAlertTemplate />} />  
            <Route path="owner-settings" element={<OwnerSettings />} />
            <Route path="owner-reset-password" element={<OwnerResetPassword />} />
            

            <Route path="owner-paymentplan" element={<OwnerRazorpayPlan />} />
            <Route path="/ownerdashboard/owner-paymentplan/add" element={<OwnerAddRazorpayPlan />} /> {/* ✅ nested here */}
            <Route path="/ownerdashboard/payment/owner-refund" element={<OwnerRefund />} />
            <Route path="/ownerdashboard/billing/owner-invoicehistory" element={<OwnerInvoiceHistory />} />
            <Route path="/ownerdashboard/payment/owner-paymenthistory" element={<OwnerPaymentHistory />} />

           

           
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
