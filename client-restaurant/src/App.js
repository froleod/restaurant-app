import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from "./components/Header";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import ProfilePage from "./components/ProfilePage";
import {AuthProvider} from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPage from "./components/AdminPage";
import ShoppingCart from "./components/ShoppingCart";
import OrderConfirmation from "./components/OrderConfirmation";

const App = () => {
    return (
        <Router>
            <AuthProvider>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/shoppingCart" element={<ShoppingCart />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;