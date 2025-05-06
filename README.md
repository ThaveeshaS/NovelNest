# NovelNest Book Store - Full Stack Application

NovelNest is a modern, voice-enabled online bookstore with a comprehensive admin dashboard. This full-stack application combines a React frontend with a Node.js/Express backend to deliver a seamless e-commerce experience with advanced features like voice commands, secure payments, and robust inventory management.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)

## Features

### User-Facing Features
- **Voice-Enabled Book Browsing**: Natural language processing for commands like "I want book [book name]"
- **Interactive Book Display**: Animated 3D book cards with hover effects
- **Secure Checkout**: Payment processing with OTP verification
- **Order Tracking**: Real-time delivery status updates
- **Customer Feedback**: Rating and review system

### Admin Features
- **Inventory Management**: Full CRUD operations for books
- **Sales Analytics**: Revenue tracking and reporting
- **Customer Management**: View and manage user accounts
- **PDF Reports**: Generate transaction and inventory reports
- **Delivery System**: Track and update order fulfillment

## Technologies

### Frontend
- React.js with Hooks
- React Router v6
- Axios for API communication
- jsPDF + jspdf-autotable for reporting
- Firebase Storage for image uploads
- Web Speech API for voice commands
- Framer Motion for animations
- Bootstrap 5 + Custom SCSS

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- RESTful API design
- Docker for containerization
- Jest + Supertest for testing

## Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Frontend Setup
```bash
git clone https://github.com/yourusername/novelnest-frontend.git
cd novelnest-frontend
npm install
cp .env.example .env
# Configure your environment variables
npm start
```
### Backend Setup
```bash
git clone https://github.com/yourusername/novelnest-backend.git
cd novelnest-backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```
