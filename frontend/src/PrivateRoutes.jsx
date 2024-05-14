import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutes = () => {
    //let auth = {'token' : false}
//     return(
//         JSON.parse(localStorage.getItem("accessToken")) ? <Outlet /> : <Navigate to="/login"/>
        
//     )
// }

const accessToken = localStorage.getItem("accessToken");
    
// accessToken이 null이거나 undefined이면 로그인 페이지로 리디렉션
if (!accessToken) {
    return <Navigate to="/login" />;
}

// accessToken이 존재하면 Outlet을 반환하여 자식 경로를 렌더링
return <Outlet />;
}