import { useSelector } from "react-redux";
import { Navigate, Outlet, Link } from "react-router-dom";
import {Menu,Badge} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import {logout} from '../../store/slices/authSlice';

import type { RootState } from "../../store";

const ProtectedRoute = () => {
    const username = useSelector((state: RootState) => state.auth.user?.username);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const cartQuantity = useSelector((state: RootState) => state.cart.totalQuantity);

    const items = [
        {
            key: 'products',
            label: <Link to="/products">产品列表</Link>,
        },
        {
            key: 'cart',
            label: (
                <Link to="/cart">
                    <Badge count={cartQuantity} size='small' offset={[10, 0]}>
                        <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                    </Badge>
                </Link>
            ),
        },
        {
            key: 'username',
            label: (<span style={{cursor:'default',color:'#888'}}>欢迎，{username}</span>),
            disabled: true,
        },
        {
            key: 'logout',
            label: <Link to="/login" onClick={() => logout()}>退出登录</Link>,
        }
    ];

    if (!isAuthenticated) {
        console.log("用户未认证，重定向到登录页面");
        return <Navigate to="/login" replace />;
    }
    else {
        return (
            <div>
                <Menu mode='horizontal' theme='light' items={items}/>
                <Outlet />
            </div>
        )
    }
}
export default ProtectedRoute;
