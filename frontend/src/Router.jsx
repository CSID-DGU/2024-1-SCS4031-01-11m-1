import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import Login from "./router/Login";



function Router() {
    return(
        <BrowserRouter>
            <Routes>
                {/* 로그인하고 접속해야하는 페이지들 */}
                <Route element={<PrivateRoutes />}>
                   

            </Route>
                {/* 로그인할 필요 없이 접근 가능한 페이지들 */}
            <Route path="/login" element={<Login />}/>
                
            </Routes>
            
        </BrowserRouter>
    );
}

/*
<PrivateRoute> : 접근권한이 있는 사람만 접근 가능한 라우터
<Route> : 일반 라우터
*/


export default Router;