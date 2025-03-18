/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import SignUp from './pages/Customer/SignUp'; 
import Login from './pages/Customer/Login'; 
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import CustomerAccount from './pages/Customer/CustomerAccount';
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCustomers from './pages/Customer/ManageCustomers'; 
import TermsAndConditions from './pages/TandCs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Help from './pages/Help';
import Tips from './pages/Tips';
import CustomerService from './pages/CustomerService';

// Import Delivery Management Components
import DeliveryList from './pages/Delivery/DeliveryList'; // Page to list all deliveries
import AddDelivery from './pages/Delivery/AddDelivery'; // Page to add a new delivery
import EditDelivery from './pages/Delivery/EditDelivery'; // Page to edit a delivery
import DeliveryDetails from './pages/Delivery/DeliveryDetails'; // Page to view delivery details


function App() {
  const location = useLocation();

  // Define routes where Header, Navbar should not be displayed
  const excludePaths = ["/customerdashboard", "/admindashboard", "/managecustomers", "/customeraccount"];

  // Check if the current path is in the exclude list
  const shouldShowHeaderNavbarFooter = !excludePaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeaderNavbarFooter && <Header />}
      {shouldShowHeaderNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customerdashboard" element={<CustomerDashboard />} />
        <Route path="/customeraccount" element={<CustomerAccount />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/managecustomers" element={<ManageCustomers />} />



        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Tips" element={<Tips />} />
        <Route path="/CustomerService" element={<CustomerService />} />


        {/* Delivery Management Routes */}
        <Route path="/deliverylist" element={<DeliveryList />} />
        <Route path="/adddelivery" element={<AddDelivery />} />
        <Route path="/editdelivery/:id" element={<EditDelivery />} />
        <Route path="/deliverydetails/:id" element={<DeliveryDetails />} />


      </Routes>
      <Footer />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;