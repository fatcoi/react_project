import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/Home';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import ProductListPage from '../pages/ProductListPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'products',
                        element: <ProductListPage />
                    },
                    {
                        path: 'product/:id',
                        element: <ProductListPage />
                    }
                ]
            }
        ]
    }
])

export default router;
