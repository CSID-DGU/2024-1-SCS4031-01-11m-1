import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutes = () => {
    // Retrieve userInfo from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    // If userInfo or accessToken is null or undefined, redirect to login
    if (!userInfo || !userInfo.accessToken) {
        return <Navigate to="/login" />;
    }

    // If accessToken exists, render child routes
    return <Outlet />;
}
