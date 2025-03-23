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




import TermsAndConditions from './pages/TandCs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Help from './pages/Help';
import Tips from './pages/Tips';
import CustomerService from './pages/CustomerService';
import WishlistPage from './pages/Product/Wishlist';
import AddToCartPage from './pages/Product/AddtoCart';
import ManageProducts from './pages/Product/ManageProducts';
import AddProducts from './pages/Product/AddProducts';
import EditProduct from './pages/Product/EditProduct';


function App() {
  const location = useLocation();

  // Define routes where Header, Navbar should not be displayed
  const excludePaths = ["/customerdashboard", "/admindashboard", "/managecustomers", "/customeraccount", "/wishlist", "/cart", "/manageproducts", "/addproducts", "/customerfeedback", "/managefeedback", "/edit-product/:id"];

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
        <Route path="/customerfeedback" element={<CustomerFeedback />} />
        <Route path="/managefeedback" element={<ManageFeedback />} />



        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Tips" element={<Tips />} />
        <Route path="/CustomerService" element={<CustomerService />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<AddToCartPage />} />
        <Route path="/manageproducts" element={<ManageProducts/>} />
        <Route path="/addproducts" element={<AddProducts/>} />
        <Route path="/edit-product/:id" element={<EditProduct/>} />




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