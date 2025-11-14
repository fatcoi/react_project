# 第六阶段：重构布局与添加轮播图

欢迎来到第六阶段！在这个阶段，我们将对应用的整体布局进行一次重要的重构，并为商品列表页增添一个动态的轮播图组件。这将极大提升用户体验和代码的可维护性。

---

### 任务一：实现受保护页面的共享布局

目前，我们网站的公共部分（如登录页）和受保护部分（如商品页）的布局是混合在一起的。我们将通过改造 `ProtectedRoute` 组件，为所有需要登录才能访问的页面提供一个统一、共享的顶部导航和页脚。

#### 步骤 1: 创建一个可复用的 `Header` 组件

这个组件将包含 Logo、导航链接、购物车图标以及退出登录功能。

1.  在 `src/components/` 目录下创建一个新文件夹 `Header`。
2.  在 `src/components/Header/` 中创建 `index.tsx` 和 `Header.module.css` 文件。

**`src/components/Header/index.tsx`**

```tsx
import { Layout, Menu, Badge, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice'; // 从 authSlice 导入 logout
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

const AppHeader = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { totalQuantity } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        message.success('您已成功退出登录');
        navigate('/login');
    };

    const menuItems = [
        {
            key: 'products',
            label: <Link to="/products">商品列表</Link>,
        },
        {
            key: 'cart',
            label: (
                <Link to="/cart">
                    <Badge count={totalQuantity} size="small">
                        <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                    </Badge>
                </Link>
            ),
        },
        {
            key: 'user',
            label: `你好, ${user?.username || '用户'}`,
            style: { marginLeft: 'auto', color: '#fff' }, // 将用户信息推到右边
        },
        {
            key: 'logout',
            label: '退出登录',
            onClick: handleLogout,
        },
    ];

    return (
        <AntHeader className={styles.header}>
            <div className={styles.logo}>
                <Link to="/products">E-Commerce</Link>
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                items={menuItems}
                className={styles.menu}
                selectable={false}
            />
        </AntHeader>
    );
};

export default AppHeader;
```

**`src/components/Header/Header.module.css`**

```css
.header {
    display: flex;
    align-items: center;
    padding: 0 24px;
    position: sticky; /* 使 Header 吸顶 */
    top: 0;
    z-index: 10;
    width: 100%;
}

.logo {
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-right: 50px;
}

.logo a {
    color: white;
    text-decoration: none;
}

.menu {
    flex: 1; /* 让菜单占据剩余空间 */
    border-bottom: none;
    background: transparent;
    justify-content: flex-end; /* 菜单项靠右 */
}
```

#### 步骤 2: 将 `ProtectedRoute` 升级为布局组件

这是实现共享布局的核心。`ProtectedRoute` 不仅会检查认证状态，还会渲染包含 `Header` 和 `Footer` 的通用页面结构。

**修改 `src/router/ProtectedRoute.tsx`**:

```tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";
import { Layout } from 'antd';
import AppHeader from "../components/Header"; // 1. 引入我们创建的 Header

const { Content, Footer } = Layout;

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        // 如果未登录，重定向到登录页
        return <Navigate to="/login" replace />;
    }

    // 2. 如果已登录，渲染带有 Header 的布局
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ padding: '24px 48px' }}>
                {/* 3. 子路由对应的页面组件将在这里被渲染 */}
                <Outlet />
            </Content>
            <Footer style={{ textAlign: 'center' }}>E-Commerce ©2025 Created by You</Footer>
        </Layout>
    );
};

export default ProtectedRoute;
```

#### 步骤 3: 简化 `App.tsx`

由于 `Header` 和 `Footer` 的职责已经移交给了 `ProtectedRoute`，`App.tsx` 现在可以变得非常简洁。

**修改 `src/App.tsx`**:

```tsx
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

function App() {
  // App 组件现在非常干净，它只作为路由的根容器
  // 我们可以给它一个基础的 Layout，以防止页面内容闪烁或布局错乱
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
```

---

### 任务二：在商品列表页添加轮播图

为了让我们的店面更具吸引力，我们将在商品列表页的顶部添加一个图片轮播图，用于展示特色商品或促销活动。

#### 步骤 1: 准备轮播图所需的图片

1.  寻找 3-4 张高质量的横向图片（例如，尺寸为 1200x400 像素）。
2.  将它们保存到 `public/image/` 目录下，并命名为 `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg`。

#### 步骤 2: 修改 `ProductListPage` 以集成轮播图

我们将使用 Ant Design 的 `Carousel` 组件。

**修改 `src/pages/ProductListPage/index.tsx`**:

```tsx
// ... 其他 imports
import { useSelector, useDispatch } from 'react-redux';
import { Carousel } from 'antd'; // 1. 导入 Carousel 组件
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/ProductCard';
// ... 其他 imports

// 轮播图内容样式
const contentStyle: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '400px',
  textAlign: 'center',
  background: '#364d79',
};

const ProductListPage = () => {
  // ... (现有的 hooks 和 state)

  useEffect(() => {
    // ... (现有的 useEffect 内容)
  }, [dispatch, status]);

  return (
    <div>
      {/* 2. 在页面顶部添加轮播图 */}
      <Carousel autoplay>
        <div>
          <div style={contentStyle}>
            <img src="/image/banner-1.jpg" alt="Banner 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <img src="/image/banner-2.jpg" alt="Banner 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <img src="/image/banner-3.jpg" alt="Banner 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </Carousel>

      {/* 3. 保持现有的商品列表逻辑 */}
      <div style={{ padding: '24px' }}>
        <Title level={2}>所有商品</Title>
        {status === 'loading' && (
          // ... (骨架屏代码)
        )}
        {status === 'succeeded' && (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={products}
            renderItem={(product) => (
              <List.Item>
                <ProductCard product={product} />
              </List.Item>
            )}
          />
        )}
        {status === 'failed' && <p>{error}</p>}
      </div>
    </div>
  );
};

export default ProductListPage;
```

---

**恭喜！** 完成以上步骤后，你的应用将拥有一个更加专业和结构化的布局，同时商品列表页也会因为新增的轮播图而更具吸引力。

接下来，你可以考虑实现分页加载或搜索功能，让你的电商应用更加完善！
