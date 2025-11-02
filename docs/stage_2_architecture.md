# 第二阶段：项目架构搭建

恭喜你完成了第一阶段！现在，我们将在已有的基础上，搭建起整个应用的核心骨架，包括路由、状态管理和API服务层。

---

### 步骤 1: 清理初始项目文件

Vite 的模板为我们生成了一些演示代码，现在我们需要清理它们。

1.  **删除默认样式和资源**:
    *   删除 `src/App.css`
    *   删除 `src/assets/react.svg`
    *   清空 `src/index.css` 里的所有内容（我们稍后会加入全局样式）

2.  **清理 `App.tsx`**:
    将 `src/App.tsx` 的内容替换为以下基本结构。我们用 `Outlet` 组件来渲染匹配到的子路由。

    ```tsx
    // src/App.tsx
    import { Outlet } from 'react-router-dom';

    function App() {
      return (
        <div>
          <h1>商城项目</h1>
          <Outlet />
        </div>
      );
    }

    export default App;
    ```

---

### 步骤 2: 创建路由配置

我们将使用 `react-router-dom` 来管理页面导航。

1.  **创建首页组件**:
    为了让路由有页面可以渲染，我们先创建一个简单的首页。

    在 `src/pages/Home` 目录下创建 `index.tsx` 文件：

    ```tsx
    // src/pages/Home/index.tsx
    const HomePage = () => {
      return <h2>欢迎来到首页</h2>;
    };

    export default HomePage;
    ```

2.  **创建路由配置文件**:
    在 `src/router` 目录下创建 `index.tsx` 文件，并配置路由表。

    ```tsx
    // src/router/index.tsx
    import { createBrowserRouter } from 'react-router-dom';
    import App from '../App';
    import HomePage from '../pages/Home';

    export const router = createBrowserRouter([
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true, // index: true 表示这是默认子路由
            element: <HomePage />,
          },
          // 其他路由将在这里添加
        ],
      },
    ]);
    ```

---

### 步骤 3: 配置 Redux Store

Redux 用于管理应用的全局状态，如用户信息、购物车等。

1.  **创建 Store**:
    在 `src/store` 目录下创建 `index.ts` 文件。

    ```ts
    // src/store/index.ts
    import { configureStore } from '@reduxjs/toolkit';

    export const store = configureStore({
      reducer: {
        // 这里将是你的 reducers
      },
    });

    // 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;
    ```
    *注意：现在 `reducer` 是空的，这会导致一个错误。我们马上会创建一个临时的 slice 来解决这个问题。*

2.  **创建临时的 Slice (切片)**:
    Slice 是状态的一部分逻辑集合。在 `src/store/slices` 目录下创建 `placeholderSlice.ts`。

    ```ts
    // src/store/slices/placeholderSlice.ts
    import { createSlice } from '@reduxjs/toolkit';

    const placeholderSlice = createSlice({
      name: 'placeholder',
      initialState: {},
      reducers: {},
    });

    export default placeholderSlice.reducer;
    ```

3.  **将 Slice 添加到 Store**:
    回到 `src/store/index.ts`，导入并注册刚刚创建的 reducer。

    ```ts
    // src/store/index.ts
    import { configureStore } from '@reduxjs/toolkit';
    import placeholderReducer from './slices/placeholderSlice'; // 导入

    export const store = configureStore({
      reducer: {
        placeholder: placeholderReducer, // 注册
      },
    });

    // ... 类型定义保持不变
    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;
    ```

---

### 步骤 4: 集成路由和 Redux

现在，我们需要在应用的入口文件 `src/main.tsx` 中，将路由和 Redux Store 提供给整个应用。

将 `src/main.tsx` 的内容更新为：

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
```

---

### 步骤 5: 创建 API 服务层

我们使用 `axios` 来处理 HTTP 请求。一个好的实践是创建一个可复用的 `request` 工具。

在 `src/utils` 目录下创建 `request.ts` 文件：

```ts
// src/utils/request.ts
import axios from 'axios';

const request = axios.create({
  baseURL: 'https://api.example.com', // 你的 API 基础 URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器 (可选)
request.interceptors.request.use(
  (config) => {
    // 比如在这里添加 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器 (可选)
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default request;
```

---

### 步骤 6: 运行项目

至此，项目的核心架构已经搭建完毕。在终端中运行以下命令，启动开发服务器：

```bash
npm run dev
```

访问浏览器中显示的地址 (通常是 `http://localhost:5173`)，你应该能看到 "商城项目" 的标题和 "欢迎来到首页" 的内容。

---

**恭喜！** 第二阶段完成。你已经有了一个包含路由、状态管理和API请求能力的健壮的应用骨架。接下来，我们将开始实现具体的功能模块。
