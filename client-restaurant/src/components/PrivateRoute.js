// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';
//
// const PrivateRoute = ({ children }) => {
//     const { isAuthenticated } = useContext(AuthContext);
//
//     // Если пользователь авторизован, показываем children (защищенный компонент)
//     // Если нет, перенаправляем на страницу входа
//     return isAuthenticated ? children : <Navigate to="/login" />;
// };
//
// export default PrivateRoute;