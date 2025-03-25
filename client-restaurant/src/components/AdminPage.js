import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css'

const AdminPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const { role } = useAuth();

    // Если пользователь не админ, перенаправляем его на главную страницу
    if (role !== 'ROLE_ADMIN') {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/products', {
                name,
                price: parseFloat(price),
                description,
                imageUrl,
            });
            console.log('Продукт создан:', response.data);
            alert('Продукт успешно создан!');
            setName('');
            setPrice('');
            setDescription('');
            setImageUrl('');
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            alert('Ошибка при создании продукта');
        }
    };

    return (
        <div className="admin-page">
            <h1>Админка</h1>
            <h2>Создание нового продукта</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Ссылка на изображение"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                />
                <button type="submit">Создать продукт</button>
            </form>
        </div>
    );
};

export default AdminPage;