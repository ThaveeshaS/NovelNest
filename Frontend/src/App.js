/* eslint-disable react/jsx-no-comment-textnodes */
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
import CustomerFeedback from './pages/Customer/CustomerFeedback'; 
import ManageFeedback from './pages/Customer/ManageFeedback';
import Analysis from './pages/Analysis';

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
import BookList from './pages/Product/BookList';
import BookDetails from './pages/Product/BookDetails';
import { WishlistProvider } from './pages/Product/WishlistContext';
import { CartProvider } from './pages/Product/CartContext';

import AddDelivery from './pages/Delivery/AddDelivery';
import DeliveryDetails from './pages/Delivery/DeliveryDetails'; 
import TrackDelivery from './pages/Delivery/TrackDelivery';

import AdminBooksPanel from './pages/voicepayment/AdminBooksPanel';
import AdminTransactionsPanel from './pages/voicepayment/AdminTransactionsPanel';
import Home1 from './pages/voicepayment/Home1';
import PaymentForm from './pages/voicepayment/PaymentForm';
import SuccessPage from './pages/voicepayment/SuccessPage';

function App() {
  const location = useLocation();

  // Define routes where Header, Navbar should not be displayed
  const excludePaths = [
    "/customerdashboard",
    "/admindashboard",
    "/managecustomers",
    "/customeraccount",
    "/wishlist",
    "/cart",
    "/manageproducts",
    "/addproducts",
    "/customerfeedback",
    "/managefeedback",
    "/bookslist",
    "/admin/AddDelivery",
    "/admin/DeliveryDetails",
    "/trackdelivery",
    "/analysis",
    "/adminlogin",
    "/login",
    "/signup",
  ];

  // Check if the current path is in the exclude list or matches dynamic routes
  const shouldShowHeaderNavbarFooter = () => {
    const pathname = location.pathname;

    // Check for exact matches in excludePaths
    if (excludePaths.includes(pathname)) {
      return false;
    }

    // Check for dynamic routes with parameters
    if (
      pathname.startsWith("/edit-product/") ||
      pathname.startsWith("/bookdetails/")
    ) {
      return false;
    }

    return true; // Show Header/Navbar by default
  };

  return (
    <>
      {shouldShowHeaderNavbarFooter() && <Header />}
      {shouldShowHeaderNavbarFooter() && <Navbar />}
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
        <Route path="/analysis" element={<Analysis />} />

        <Route path="/home1" element={<Home1 />} />
        <Route path="/admintransactions" element={<AdminTransactionsPanel />} /> 
        <Route path="/adminbookspanel" element={<AdminBooksPanel />} /> 
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/success" element={<SuccessPage />} />

        <Route path="/admin/AddDelivery" element={<AddDelivery />} />
        <Route path="/admin/DeliveryDetails" element={<DeliveryDetails />} />
        <Route path="/trackdelivery" element={<TrackDelivery />} />

        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Tips" element={<Tips />} />
        <Route path="/CustomerService" element={<CustomerService />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<AddToCartPage />} />
        <Route path="/manageproducts" element={<ManageProducts />} />
        <Route path="/addproducts" element={<AddProducts />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/bookslist" element={<BookList />} />
        <Route path="/bookdetails/:id" element={<BookDetails />} />
      </Routes>
      <Footer />
    </>
  );
}

function AppWrapper() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default AppWrapper;