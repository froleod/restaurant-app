import React, {useState, useEffect} from 'react';
import {useAuth} from '../context/AuthContext';
import '../styles/MenuPage.css';
import axios from "axios";

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {cart, addToCart, updateQuantity, removeFromCart} = useAuth();
    const {role } = useAuth(); // Получаем данные из контекста
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    // Проверяем, добавлен ли продукт в корзину
    const isProductInCart = (productId) => {
        return cart.some((item) => item.id === productId);
    };

    // Получаем количество продукта в корзине
    const getProductQuantity = (productId) => {
        const productInCart = cart.find((item) => item.id === productId);
        return productInCart ? productInCart.quantity : 0;
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1); // Добавляем продукт в корзину с количеством 1
    };

    const handleIncreaseQuantity = (productId) => {
        updateQuantity(productId, getProductQuantity(productId) + 1); // Увеличиваем количество
    };

    const handleDecreaseQuantity = (productId) => {
        const currentQuantity = getProductQuantity(productId);
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1); // Уменьшаем количество
        } else {
            // Если количество равно 1, удаляем продукт из корзины
            removeFromCart(productId);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products");
                if (!response.ok) {
                    throw new Error("Ошибка при загрузке данных");
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Ошибка загрузки продуктов:", error);
                setError("Ошибка при загрузке данных");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleEditProduct = (product) => {
        setEditingProduct(product); // Сохраняем продукт для редактирования
        setIsEditModalOpen(true); // Открываем модальное окно
    };

    const handleSaveProductChanges = async () => {
        try {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage

            // Отправляем PUT-запрос для обновления продукта
            const response = await axios.put(
                `/api/products/${editingProduct.id}`,
                editingProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Response:", response.data); // Логируем ответ сервера

            // Обновляем список продуктов
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === editingProduct.id ? response.data : product
                )
            );

            // Закрываем модальное окно
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Ошибка при обновлении продукта:", error.response?.data || error.message);
            setError("Ошибка при обновлении продукта");
        }
    };

    const handleDeleteProduct = async (productId) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот продукт?");

        // Если пользователь нажал "Отмена", прерываем выполнение
        if (!isConfirmed) {
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage

            // Исправленный URL (убрана лишняя скобка)
            const response = await axios.delete(`/api/products?productId=${encodeURIComponent(productId)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log("Response:", response.data); // Логируем ответ сервера

            // Успешно удалено, теперь обновите список продуктов
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error("Ошибка удаления продукта:", error.response?.data || error.message);
            setError("Ошибка при удалении продукта");
        }
    };


    if (loading) {
        return <div className="menu-page">Загрузка...</div>;
    }

    if (error) {
        return <div className="menu-page">Ошибка: {error}</div>;
    }

    if (products.length === 0) {
        return <div className="menu-page">Меню пока пусто.</div>;
    }

    return (
        <div className="menu-page">
            <h1>Наше меню</h1>
            <ul className="menu-list">
                {products.map((product) => {
                    const quantity = getProductQuantity(product.id);
                    return (
                        <li key={product.id} className="menu-item">
                            <img src={product.imageUrl} alt={product.name} className="product-image"/>
                            <div className="product-details">
                                <h2>{product.name}</h2>
                                <p className="desc">{product.description}</p>
                                <p className="product-price">{product.price} ₽</p>
                            </div>
                            {quantity > 0 ? (
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleDecreaseQuantity(product.id)}
                                        className="quantity-button"
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => handleIncreaseQuantity(product.id)}
                                        className="quantity-button"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="add-to-cart-button"
                                >
                                    Добавить в корзину
                                </button>

                            )}
                            {role === 'ROLE_ADMIN' && (
                                <>
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="edit-button"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="delete-button"
                                    >
                                        Удалить
                                    </button>
                                </>
                            )}
                            {isEditModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal">
                                        <h2>Редактирование продукта</h2>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSaveProductChanges();
                                            }}
                                        >
                                            <label>
                                                Название:
                                                <input
                                                    type="text"
                                                    value={editingProduct.name}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            </label>
                                            <label>
                                                Описание:
                                                <textarea
                                                    value={editingProduct.description}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                />
                                            </label>
                                            <label>
                                                Цена:
                                                <input
                                                    type="number"
                                                    value={editingProduct.price}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            price: parseFloat(e.target.value),
                                                        })
                                                    }
                                                />
                                            </label>
                                            <label>
                                                Ссылка на изображение:
                                                <input
                                                    type="text"
                                                    value={editingProduct.imageUrl}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            imageUrl: e.target.value,
                                                        })
                                                    }
                                                />
                                            </label>
                                            <button type="submit">Сохранить</button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditModalOpen(false)}
                                            >
                                                Отмена
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MenuPage;