import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from '../components/ProtectedRoute';
import{lazy,Suspense} from 'react';

const HomePage = lazy(()=>import('../pages/Home'));
const LoginPage = lazy(()=>import('../pages/Login'));
const RegisterPage = lazy(()=>import('../pages/Register'));
const ProductListPage = lazy(()=>import('../pages/ProductListPage'));
const ProductPage = lazy(()=>import('../pages/ProductPage'));
const CarPage = lazy(()=>import('../pages/Cart'));

const withSuspense = (element:JSX.Element, fallback:JSX.Element=<div>加载中...</div>)=>(
    <Suspense fallback={fallback}>
        {element}
    </Suspense>
);


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: withSuspense(<HomePage />),
            },
            {
                path: 'login',
                element: withSuspense(<LoginPage />)
            },
            {
                path: 'register',
                element: withSuspense(<RegisterPage />)
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'products',
                        element: withSuspense(<ProductListPage />)
                    },
                    {
                        path: 'products/:id',
                        element: withSuspense(<ProductPage />)
                    },
                    {
                        path: 'cart',
                        element: withSuspense(<CarPage />)
                    }
                ]
            }
        ]
    }
])

export default router;
