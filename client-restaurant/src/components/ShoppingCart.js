import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import '../styles/ShoppingCart.css';

const ShoppingCart = () => {
    const {cart, updateQuantity, removeFromCart, clearCart, createOrder} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        house: '',
        apartment: '',
        floor: '',
        intercom: '',
        comment: ''
    });
    const [isDeliveryFormValid, setIsDeliveryFormValid] = useState(false);

    console.log('Текущая корзина:', cart);

    // Подсчёт итоговой стоимости
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const navigate = useNavigate();

    // Валидация формы адреса
    useEffect(() => {
        const isValid = deliveryAddress.street.trim() !== '' &&
            deliveryAddress.house.trim() !== '';
        setIsDeliveryFormValid(isValid);
    }, [deliveryAddress]);

    const handleAddressChange = (e) => {
        const {name, value} = e.target;
        setDeliveryAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateOrder = async () => {
        if (!isDeliveryFormValid) {
            setError('Пожалуйста, заполните обязательные поля адреса');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const order = await createOrder(deliveryAddress);
            console.log("Заказ: ", order);

            navigate('/', {state: {order}});
            clearCart();
        } catch (error) {
            console.log("Ошибка при создании заказа: ", error);
            setError(error.message || 'Ошибка при создании заказа');
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

                    {/* Форма для ввода адреса доставки */}
                    <div className="delivery-form">
                        <h2>Данные доставки</h2>
                        <div className="form-group">
                            <label>Улица*</label>
                            <input
                                type="text"
                                name="street"
                                value={deliveryAddress.street}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Дом*</label>
                            <input
                                type="text"
                                name="house"
                                value={deliveryAddress.house}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Квартира</label>
                            <input
                                type="text"
                                name="apartment"
                                value={deliveryAddress.apartment}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Этаж</label>
                            <input
                                type="number"
                                name="floor"
                                value={deliveryAddress.floor}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Код домофона</label>
                            <input
                                type="text"
                                name="intercom"
                                value={deliveryAddress.intercom}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Комментарий к заказу</label>
                            <textarea
                                name="comment"
                                value={deliveryAddress.comment}
                                onChange={handleAddressChange}
                            />
                        </div>
                    </div>

                    <div className="cart-summary">
                        <h2>Итого: {totalPrice.toFixed(2)} ₽</h2>
                        <button
                            onClick={handleCreateOrder}
                            className="checkout-button"
                            disabled={isLoading || !isDeliveryFormValid}
                        >
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