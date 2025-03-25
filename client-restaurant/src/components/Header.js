import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'
import {useAuth} from "../context/AuthContext";

const Header = () => {

    const { isAuthenticated, role } = useAuth();


    return (
        <header className="header">
            <div className="logo">Ресторан "УЮТ"</div>
            <nav className="nav">
                <Link to="/" className="link">Главная</Link>
                <Link to="/menu" className="link">Меню</Link>
                <Link to="/profile" className="link">Профиль</Link>
                {isAuthenticated ? (
                    <Link to="/shoppingCart" className="link">Корзина</Link>
                ) : (
                    <></>
                )}
                {role === 'ROLE_ADMIN' && <Link to="/admin">Админка</Link>}
            </nav>
        </header>

    );
};


export default Header;