import React, {useEffect, useState} from 'react';
import { useAuth } from '../context/AuthContext'; // Импортируем контекст авторизации
import { useNavigate } from 'react-router-dom'; // Для навигации
import '../styles/profilepage.css'; // Импортируем стили

const ProfilePage = () => {
    const { isAuthenticated, user, logout } = useAuth(); // Получаем данные из контекста
    const navigate = useNavigate(); // Хук для навигации
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const handleLoginClick = () => {
        navigate('/login'); // Переход на страницу логина
    };

    const handleRegisterClick = () => {
        navigate('/register'); // Переход на страницу регистрации
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage

            try {
                if(isAuthenticated) {
                    const username = user.username;
                    const response = await fetch(`/api/orders?username=${encodeURIComponent(username)}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error("Ошибка при загрузке данных");
                    }
                    const data = await response.json();
                    setOrders(data);
                }

            } catch (error) {
                console.error("Ошибка загрузки продуктов:", error);
                setError("Ошибка при загрузке данных");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated]);

    return (
        <div className="profile-page">
            {isAuthenticated ? (
                <>
                    <h1>Привет, {user?.username}!</h1>
                    <button onClick={logout}>Выйти</button>
                    <h3>Ваши заказы:</h3>
                    {orders.length > 0 ? (
                        <ul className="orders-list">
                            {orders.map((order) => (
                                <li key={order.id} className="order-item">
                                    <h4>Заказ №{order.id}</h4>
                                    <p>Дата заказа: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p>Статус: {order.status}</p>
                                    <p>Общая стоимость: {order.totalPrice} руб.</p>
                                    <h4>Товары:</h4>
                                    <ul>
                                        {order.items.map((item) => (
                                            <li key={item.id} className="order-product-item">
                                                <p>{item.product.name} - {item.quantity} шт. по {item.price} руб.</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>У вас пока нет заказов.</p>
                    )}
                </>
            ) : (
                <>
                    <h1>Добро пожаловать!</h1>
                    <button onClick={handleLoginClick}>Войти</button>
                    <button onClick={handleRegisterClick}>Зарегистрироваться</button>
                </>
            )}
        </div>
    );
};

export default ProfilePage;