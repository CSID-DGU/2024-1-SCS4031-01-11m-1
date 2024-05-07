import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutes = () => {
    //let auth = {'token' : false}
    return(
        JSON.parse(localStorage.getItem('userInfo')) ? <Outlet /> : <Navigate to="/login"/>
    )
}
