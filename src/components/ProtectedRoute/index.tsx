import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../store";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    if (!isAuthenticated) {
        console.log("用户未认证，重定向到登录页面");
        return <Navigate to="/login" replace />;
    }
    else {
        return <Outlet />;
    }
}
export default ProtectedRoute;
