import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);

    const [cart, setCart] = useState(() => {
        // Восстанавливаем корзину из localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Сохраняем корзину в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Проверка авторизации при загрузке приложения
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Загружаем данные пользователя
            fetchUserData(token);
        }
    }, []);

    const createOrder = async (deliveryAddress) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Пользователь не авторизован');
            }

            const orderData = {
                username: user.username,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                deliveryAddress: {
                    street: deliveryAddress.street,
                    house: deliveryAddress.house,
                    apartment: deliveryAddress.apartment,
                    floor: deliveryAddress.floor,
                    intercom: deliveryAddress.intercom,
                    comment: deliveryAddress.comment
                }
            };

            console.log("Order data: ", orderData);

            const response = await axios.post('/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Заказ создан:", response.data);
            setCart([]);
            localStorage.removeItem('cart');
            return response.data;
        } catch (error) {
            console.log("Ошибка при создании заказа:", error);
            throw error;
        }
    };

    // Метод для загрузки данных пользователя
    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const {username, role} = response.data; // Предполагаем, что бэкенд возвращает username и role
            setUser({username}); // Сохраняем данные пользователя
            setRole(role); // Сохраняем роль
            setIsAuthenticated(true); // Устанавливаем флаг авторизации
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
            logout(); // Если токен недействителен, разлогиниваем пользователя
        }
    };

    // Метод для входа
    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/auth/login', {username, password});
            const {token, role} = response.data; // Извлекаем токен и роль из ответа

            // Сохраняем токен и роль в локальном хранилище
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Обновляем состояние
            setRole(role);
            setIsAuthenticated(true);
            setUser({username});
        } catch (error) {
            console.error('Ошибка при входе:', error);
        }
    };

    // Метод для регистрации
    const register = async (username, email, password) => {
        try {
            const response = await axios.post('/api/auth/register', {username, email, password});
            const {token, role} = response.data; // Извлекаем токен и роль из ответа

            // Сохраняем токен и роль в локальном хранилище
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Обновляем состояние
            setRole(role);
            setIsAuthenticated(true);
            setUser({username});
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
        }
    };

    // Метод для выхода
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('cart'); // Очищаем корзину при выходе
        setRole(null);
        setIsAuthenticated(false);
        setUser(null);
        setCart([]); // Очищаем состояние корзины
    };

    // Добавление продукта в корзину
    const addToCart = (product, quantity = 1) => {
        console.log('Добавляемый продукт:', product); // Логируем продукт
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                console.log('Продукт уже в корзине. Обновляем количество.'); // Логируем обновление
                return prevCart.map((item) =>
                    item.id === product.id ? {...item, quantity: item.quantity + quantity} : item
                );
            } else {
                console.log('Продукта нет в корзине. Добавляем новый.'); // Логируем добавление
                return [...prevCart, {...product, quantity}];
            }
        });
    };

    // Удаление продукта из корзины
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Изменение количества продукта в корзине
    const updateQuantity = (productId, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? {...item, quantity} : item
            )
        );
    };

    // Очистка корзины
    const clearCart = () => {
        setCart([]);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                role,
                cart, // Состояние корзины
                createOrder,
                login,
                register,
                logout,
                addToCart, // Метод для добавления в корзину
                removeFromCart, // Метод для удаления из корзины
                updateQuantity, // Метод для изменения количества
                clearCart, // Метод для очистки корзины
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);