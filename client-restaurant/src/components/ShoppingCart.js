import React, {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/ShoppingCart.css';

const ShoppingCart = () => {
    const {cart, updateQuantity, removeFromCart, clearCart, createOrder} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log('Текущая корзина:', cart);
    // Подсчёт итоговой стоимости
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const navigate = useNavigate();
    const handleCreateOrder = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const order = await createOrder();
            console.log("Заказ: ", order);

            // navigate('/order-confirmation', {state: {order}});
            navigate('/', {state: {order}});

            // clearCart();
        } catch (error) {
            console.log("Ошибка при создании заказа: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="shopping-cart">
            <h1>Корзина</h1>
            {cart.length === 0 ? (
                <p>Ваша корзина пуста :(</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {cart.map((item) => (
                            <li key={item.id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image"/>
                                <div className="cart-item-details">
                                    <h2>{item.name}</h2>
                                    <p>{item.price} ₽</p>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="remove-button">
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/*<div className="cart-summary">*/}
                    {/*    <h2>Итого: <span className="total">{totalPrice.toFixed(2)} ₽ </span></h2>*/}
                    {/*    <button onClick={clearCart} className="clear-cart-button">*/}
                    {/*        Очистить корзину*/}
                    {/*    </button>*/}
                    {/*    <Link to="/checkout" className="checkout-button">*/}
                    {/*        Оформить заказ*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                    <div className="cart-summary">
                        <h2>Итого: {totalPrice.toFixed(2)} ₽</h2>
                        <button onClick={handleCreateOrder} className="checkout-button" disabled={isLoading}>
                            {isLoading ? 'Оформление заказа...' : 'Оформить заказ'}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;