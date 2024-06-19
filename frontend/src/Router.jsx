import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Management from "./pages/Management";
import Analytics from "./pages/Analytics";
import ReportDetail from "./components/analytics/ReportDetail";
import AddReport from "./components/analytics/AddReport";
import Dashboard from "./pages/Dashboard";

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                {/* 로그인하고 접속해야하는 페이지들 */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/management" element={<Management />}/>
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics/report" element={<ReportDetail />} />
                    <Route path="/analytics/addreport" element={<AddReport />} />
                    <Route path="/analytics/:reportId" element={<ReportDetail/>} />
                    
                </Route>
                {/* 로그인할 필요 없이 접근 가능한 페이지들 */}
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup />}/>
            </Routes>
            
        </BrowserRouter>
    );
}

/*
<PrivateRoute> : 접근권한이 있는 사람만 접근 가능한 라우터
<Route> : 일반 라우터
*/


export default Router;