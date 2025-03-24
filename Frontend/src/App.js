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
import CustomerFeedback from './pages/Customer/CustomerFeedback'; 
import ManageFeedback from './pages/Customer/ManageFeedback';


import AddDelivery from './pages/Delivery/AddDelivery'; // Corrected path
import DeliveryDetails from './pages/Delivery/DeliveryDetails'; // Added import for DeliveryDetails
import TrackDelivery from './pages/Delivery/TrackDelivery';


import TermsAndConditions from './pages/TandCs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Help from './pages/Help';
import Tips from './pages/Tips';
import CustomerService from './pages/CustomerService';

function App() {
  const location = useLocation();

  // Define routes where Header, Navbar should not be displayed
  const excludePaths = ["/customerdashboard", "/admindashboard", "/managecustomers", "/customeraccount", "/admin/AddDelivery", "/admin/DeliveryDetails", "/trackdelivery"];

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



        <Route path="/admin/AddDelivery" element={<AddDelivery />} />
        <Route path="/admin/DeliveryDetails" element={<DeliveryDetails />} /> {/* Added DeliveryDetails route */}
        <Route path="/trackdelivery" element={<TrackDelivery />} />

        
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Tips" element={<Tips />} />
        <Route path="/CustomerService" element={<CustomerService />} />
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
