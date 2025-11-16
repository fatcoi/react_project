import { useSelector } from "react-redux";
import { Navigate, Outlet, Link } from "react-router-dom";
import {Menu,Badge,message} from 'antd';
import { ShoppingCartOutlined,HomeOutlined } from '@ant-design/icons';
import {logout} from '../../store/slices/authSlice';
import { useDispatch } from "react-redux";
import type{ AppDispatch } from "../../store";
import { useEffect } from "react";
import { setSearchKeyword } from "../../store/slices/productSlice";
import { firstPageProducts } from "../../store/slices/productSlice";

import type { RootState } from "../../store";

const ProtectedRoute = () => {
    const username = useSelector((state: RootState) => state.auth.user?.username);
    const cartQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
    const dispatch:AppDispatch = useDispatch();

    const handleGoProductList = ()=>{
        dispatch(setSearchKeyword(''));
        dispatch(firstPageProducts());
    }
    const handleLougout = () => {
        dispatch(logout());
    }
    const token = localStorage.getItem('token');
    useEffect(()=>{
        if(!token){
            message.warning('请先登录！');
        }
    },[token])

    useEffect(()=>{
        const handlePageShow = (e: PageTransitionEvent) => {
            if(e.persisted){
                window.location.reload();
            }
        }
        window.addEventListener('pageshow',handlePageShow);
        return ()=>window.removeEventListener('pageshow',handlePageShow);
    },[])

    const items = [
        {
            key: 'products',
            label: <span onClick={handleGoProductList}><Link to="/products"><HomeOutlined style={{fontSize:'18px',marginRight:4}}/></Link></span>,
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
            label: <Link to="/login" onClick={() => handleLougout()}>退出登录</Link>,
        }
    ]
    if (token)return (
        <div>
            <Menu mode='horizontal' theme='light' items={items}/>
            <Outlet />
        </div>
    )
    else return (
        <div>
            <Navigate to="/login" replace />
        </div>
        
    )
}


export default ProtectedRoute;
