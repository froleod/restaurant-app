import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/OrderConfirmation.css';
import {useAuth} from "../context/AuthContext";

const OrderConfirmation = () => {
    const location = useLocation();
    const { order } = location.state || {};
    console.log(order);

    if (!order) {
        return <div className="order-confirmation">Заказ не найден.</div>;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { clearCart} = useAuth();

    clearCart();

    return (
        <div className="order-confirmation">
            <h1>Заказ успешно оформлен!</h1>
            <p>Номер заказа: {order.id}</p>
            <p>Общая стоимость: {order.price.toFixed(2)} ₽</p>
            <p>Статус заказа: {order.status}</p>
            <p>Спасибо за покупку!</p>
        </div>
    );
};

export default OrderConfirmation;