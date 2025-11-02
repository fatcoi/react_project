# 第三阶段：用户认证模块

太棒了！我们已经搭建好了项目的骨架，现在开始构建第一个核心功能：用户认证。这个阶段将涵盖从登录/注册页面、状态管理到路由保护的完整流程。

---

### 步骤 1: 创建登录和注册页面

我们将使用 Ant Design 的 `Form` 组件来快速创建表单。

1.  **创建登录页面 (`src/pages/Login/index.tsx`)**:

    ```tsx
    // src/pages/Login/index.tsx
    import { Form, Input, Button, Checkbox } from 'antd';
    import { UserOutlined, LockOutlined } from '@ant-design/icons';

    const LoginPage = () => {
      const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // 在这里处理登录逻辑
      };

      return (
        <div style={{ width: 300, margin: '100px auto' }}>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a style={{ float: 'right' }} href="">
                忘记密码
              </a>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                登录
              </Button>
              或 <a href="/register">立即注册!</a>
            </Form.Item>
          </Form>
        </div>
      );
    };

    export default LoginPage;
    ```

2.  **创建注册页面 (`src/pages/Register/index.tsx`)**:
    这个页面与登录页类似，你可以复制登录页的代码并稍作修改。

---

### 步骤 2: 创建用户认证 Slice

我们需要一个 Redux Slice 来管理用户的登录状态、信息和 Token。

1.  **定义用户类型 (`src/types/user.ts`)**:

    ```ts
    // src/types/user.ts
    export interface User {
      id: string;
      username: string;
      email: string;
    }
    ```

2.  **创建 `authSlice.ts`**:

    ```ts
    // src/store/slices/authSlice.ts
    import { createSlice, PayloadAction } from '@reduxjs/toolkit';
    import { User } from '../../types/user';

    interface AuthState {
      user: User | null;
      token: string | null;
      isAuthenticated: boolean;
    }

    const initialState: AuthState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };

    const authSlice = createSlice({
      name: 'auth',
      initialState,
      reducers: {
        loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          // 将 token 存入 localStorage
          localStorage.setItem('token', action.payload.token);
        },
        logout(state) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          // 从 localStorage 移除 token
          localStorage.removeItem('token');
        },
      },
    });

    export const { loginSuccess, logout } = authSlice.actions;
    export default authSlice.reducer;
    ```

3.  **更新 Store (`src/store/index.ts`)**:
    将 `authSlice` 添加到你的 store 中，并移除临时的 `placeholderReducer`。

    ```ts
    // src/store/index.ts
    import { configureStore } from '@reduxjs/toolkit';
    import authReducer from './slices/authSlice'; // 导入 authReducer

    export const store = configureStore({
      reducer: {
        auth: authReducer, // 注册
      },
    });

    // ...类型定义不变
    ```

---

### 步骤 3: 更新路由

将新创建的登录和注册页面添加到路由表中。

```tsx
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login'; // 导入
import RegisterPage from '../pages/Register'; // 导入
import ErrorPage from '../pages/ErrorPage/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // 在这里添加新路由
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);
```

---

### 步骤 4: 实现登录逻辑

现在回到 `LoginPage` 组件，实现表单提交后的真正逻辑。

```tsx
// src/pages/Login/index.tsx
// ... (imports)
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    
    // 模拟 API 调用和成功响应
    const mockUser = { id: '1', username: values.username, email: 'test@example.com' };
    const mockToken = 'fake-jwt-token';

    // Dispatch a loginSuccess action
    dispatch(loginSuccess({ user: mockUser, token: mockToken }));

    // Redirect to home page
    navigate('/');
  };

  // ... (返回的 JSX 不变)
};

export default LoginPage;
```

---

### 步骤 5: 创建路由守卫 (Protected Route)

为了保护某些页面（如个人中心）只对登录用户开放，我们需要一个路由守卫组件。

1.  **创建 `ProtectedRoute` 组件 (`src/components/ProtectedRoute/index.tsx`)**:

    ```tsx
    // src/components/ProtectedRoute/index.tsx
    import { useSelector } from 'react-redux';
    import { Navigate, Outlet } from 'react-router-dom';
    import { RootState } from '../../store';

    const ProtectedRoute = () => {
      const { isAuthenticated } = useSelector((state: RootState) => state.auth);

      if (!isAuthenticated) {
        // 如果未认证，重定向到登录页
        return <Navigate to="/login" replace />;
      }

      // 如果已认证，渲染子路由
      return <Outlet />;
    };

    export default ProtectedRoute;
    ```

2.  **创建个人中心页面并应用守卫**:
    *   创建一个简单的个人中心页面 `src/pages/Profile/index.tsx`。
    *   更新路由 `src/router/index.tsx`，添加受保护的路由。

    ```tsx
    // src/router/index.tsx
    // ... (imports)
    import ProfilePage from '../pages/Profile';
    import ProtectedRoute from '../components/ProtectedRoute';

    export const router = createBrowserRouter([
      {
        path: '/',
        element: <App />,
        // ... (其他配置)
        children: [
          // ... (公共路由)
          {
            path: 'login',
            element: <LoginPage />,
          },
          // 受保护的路由组
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: 'profile',
                element: <ProfilePage />,
              },
              // 其他需要登录才能访问的页面放在这里
            ],
          },
        ],
      },
    ]);
    ```

---

### 步骤 6: 实现持久化登录

为了在刷新页面后保持登录状态，我们需要在应用加载时从 `localStorage` 恢复状态。

修改 `src/store/slices/authSlice.ts`：

```ts
// src/store/slices/authSlice.ts
// ... (imports)

// 尝试从 localStorage 获取 token
const token = localStorage.getItem('token');
// 你也可以在这里解码 token 来获取用户信息，或者在应用启动时发一个请求获取
// 这里我们简单处理
const user: User | null = token ? { id: '1', username: 'mockUser', email: '...'} : null;

const initialState: AuthState = {
  user: user,
  token: token,
  isAuthenticated: !!token, // 如果 token 存在，则为 true
};

// ... (slice 定义不变)
```

---

**恭喜！** 你已经完成了用户认证模块！现在你的应用具备了以下能力：
*   用户可以登录。
*   登录状态通过 Redux 全局管理。
*   登录状态通过 `localStorage` 持久化。
*   通过路由守卫保护了特定页面。

接下来，你可以尝试访问 `/profile`，如果未登录，应该会被自动跳转到 `/login` 页面。登录后，再尝试访问，应该就能成功看到个人中心页面了。
