# 第五阶段：购物车模块

恭喜你完成了商品展示！现在，我们要为应用添加一个至关重要的功能——购物车。这个模块将让你更深入地掌握 Redux 在处理复杂状态和多重交互时的强大能力。

---

### 步骤 1: 创建 `cartSlice`

购物车是另一个需要全局管理的状态，所以我们将为它创建一个新的 Slice。这个 Slice 的逻辑会比 `productSlice` 更丰富，因为它包含了增、删、改等多种操作。

1.  **创建 `src/store/slices/cartSlice.ts` 文件**:

    ```ts
    // src/store/slices/cartSlice.ts
    import { createSlice, PayloadAction } from '@reduxjs/toolkit';
    import { Product } from '../../types/product';

    // 定义购物车中单个商品的类型，它在 Product 的基础上增加了 quantity 属性
    export interface CartItem extends Product {
      quantity: number,
    }

    // 定义整个购物车 state 的类型
    interface CartState {
      items: CartItem[];
      totalQuantity: number;
      totalPrice: number;
    }

    const initialState: CartState = {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    };

    const cartSlice = createSlice({
      name: 'cart',
      initialState,
      reducers: {
        // 添加商品到购物车
        addToCart: (state, action: PayloadAction<Product>) => {
          const newItem = action.payload;
          const existingItem = state.items.find((item) => item.id === newItem.id);

          if (existingItem) {
            // 如果商品已存在，则只增加数量
            existingItem.quantity++;
          } else {
            // 如果商品不存在，则添加到购物车
            state.items.push({ ...newItem, quantity: 1 });
          }
          // 更新总数量和总价格
          state.totalQuantity++;
          state.totalPrice += newItem.price;
        },

        // 从购物车移除商品
        removeFromCart: (state, action: PayloadAction<string>) => { // payload 为商品 id
          const idToRemove = action.payload;
          const existingItem = state.items.find((item) => item.id === idToRemove);

          if (existingItem) {
            state.totalQuantity -= existingItem.quantity;
            state.totalPrice -= existingItem.price * existingItem.quantity;
            state.items = state.items.filter((item) => item.id !== idToRemove);
          }
        },

        // 更新商品数量
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
          const { id, quantity } = action.payload;
          const existingItem = state.items.find((item) => item.id === id);

          if (existingItem) {
            if (quantity > 0) {
              // 更新总数和总价
              state.totalQuantity += (quantity - existingItem.quantity);
              state.totalPrice += (quantity - existingItem.quantity) * existingItem.price;
              existingItem.quantity = quantity;
            } else {
              // 如果数量小于等于0，则视为删除
              state.totalQuantity -= existingItem.quantity;
              state.totalPrice -= existingItem.price * existingItem.quantity;
              state.items = state.items.filter((item) => item.id !== id);
            }
          }
        },
        
        // 清空购物车
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        }
      },
    });

    export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
    export default cartSlice.reducer;
    ```

2.  **更新 Store (`src/store/index.ts`)**:
    将新的 `cartSlice` 添加到你的 store 中。

    ```ts
    // src/store/index.ts
    // ... (其他 imports)
    import cartReducer from './slices/cartSlice'; // 导入

    export const store = configureStore({
      reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer, // 注册
      },
    });

    // ...类型定义不变
    ```

---

### 步骤 2: 在商品页面添加“加入购物车”功能

我们需要一个地方来触发 `addToCart` action。最合适的地方就是商品详情页。如果你还没有创建商品详情页，可以先在 `ProductCard` 组件上添加一个按钮来快速实现。

**方案A: 在 `ProductCard` 组件中添加按钮 (快速实现)**

1.  **修改 `src/components/ProductCard/index.tsx`**:

    ```tsx
    // src/components/ProductCard/index.tsx
    import { Link } from 'react-router-dom';
    import { Card, Button, message } from 'antd';
    import { useDispatch } from 'react-redux';
    import { AppDispatch } from '../../store';
    import { addToCart } from '../../store/slices/cartSlice';
    import type { Product } from '../../types/product';

    const { Meta } = Card;

    interface ProductCardProps {
      product: Product;
    }

    const ProductCard = ({ product }: ProductCardProps) => {
      const dispatch: AppDispatch = useDispatch();

      const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // 阻止 Link 组件的跳转行为
        e.stopPropagation(); // 阻止事件冒泡
        dispatch(addToCart(product));
        message.success('已成功加入购物车！');
      };

      return (
        // 将 Card 包裹在一个 div 中，以便放置按钮
        <div style={{ position: 'relative' }}>
          <Link to={`/product/${product.id}`}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.imageUrl} style={{ height: 300, objectFit: 'cover' }} />}
            >
              <Meta title={product.name} description={`¥${product.price.toFixed(2)}`} />
            </Card>
          </Link>
          <Button
            type="primary"
            onClick={handleAddToCart}
            style={{ position: 'absolute', bottom: '70px', right: '16px' }}
          >
            加入购物车
          </Button>
        </div>
      );
    };

    export default ProductCard;
    ```
    *注意：这里为了快速实现，我们用了一些绝对定位，并且阻止了事件冒泡和默认行为。在真实项目中，更推荐在商品详情页实现此功能。*

---

### 步骤 3: 创建购物车页面 (`CartPage`)

这个页面将展示购物车中的所有商品，并允许用户管理它们。

1.  **创建 `src/pages/Cart/index.tsx` 文件**:

    ```tsx
    // src/pages/Cart/index.tsx
    import { useSelector, useDispatch } from 'react-redux';
    import { RootState, AppDispatch } from '../../store';
    import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
    import { Table, Button, InputNumber, Typography, Empty, Space } from 'antd';
    import type { ColumnsType } from 'antd/es/table';
    import { CartItem } from '../../store/slices/cartSlice';

    const { Title, Text } = Typography;

    const CartPage = () => {
      const dispatch: AppDispatch = useDispatch();
      const { items, totalPrice, totalQuantity } = useSelector((state: RootState) => state.cart);

      const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
      };

      const handleQuantityChange = (id: string, quantity: number) => {
        dispatch(updateQuantity({ id, quantity }));
      };
      
      const handleClearCart = () => {
        dispatch(clearCart());
      };

      const columns: ColumnsType<CartItem> = [
        {
          title: '商品',
          dataIndex: 'name',
          key: 'name',
          render: (_, record) => (
            <Space>
              <img src={record.imageUrl} alt={record.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
              <Text>{record.name}</Text>
            </Space>
          ),
        },
        {
          title: '单价',
          dataIndex: 'price',
          key: 'price',
          render: (price) => `¥${price.toFixed(2)}`,
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          key: 'quantity',
          render: (_, record) => (
            <InputNumber
              min={0}
              value={record.quantity}
              onChange={(value) => handleQuantityChange(record.id, value || 0)}
            />
          ),
        },
        {
          title: '小计',
          key: 'subtotal',
          render: (_, record) => `¥${(record.price * record.quantity).toFixed(2)}`,
        },
        {
          title: '操作',
          key: 'action',
          render: (_, record) => (
            <Button type="link" danger onClick={() => handleRemove(record.id)}>
              删除
            </Button>
          ),
        },
      ];

      if (items.length === 0) {
        return <div style={{ padding: '24px', textAlign: 'center' }}><Empty description="购物车是空的" /></div>;
      }

      return (
        <div style={{ padding: '24px' }}>
          <Title level={2}>我的购物车</Title>
          <Table columns={columns} dataSource={items} rowKey="id" pagination={false} />
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space direction="vertical" align="end">
              <Title level={4}>总计: <Text type="danger">¥{totalPrice.toFixed(2)}</Text> ({totalQuantity} 件)</Title>
              <Space>
                <Button type="primary" size="large">去结算</Button>
                <Button danger onClick={handleClearCart}>清空购物车</Button>
              </Space>
            </Space>
          </div>
        </div>
      );
    };

    export default CartPage;
    ```

---

### 步骤 4: 在 Header 中添加入口

我们需要在网站的公共头部添加一个购物车图标，它能实时显示商品数量，并链接到购物车页面。

1.  **修改 `src/App.tsx` (或你的主布局组件)**:

    ```tsx
    // src/App.tsx
    import { Layout, Menu, Badge } from 'antd';
    import { ShoppingCartOutlined } from '@ant-design/icons';
    import { Link, Outlet } from 'react-router-dom';
    import { useSelector } from 'react-redux';
    import { RootState } from './store';

    const { Header, Content, Footer } = Layout;

    function App() {
      const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);

      return (
        <Layout>
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1"><Link to="/">首页</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/products">商品列表</Link></Menu.Item>
              <Menu.Item key="cart" style={{ marginLeft: 'auto' }}>
                <Link to="/cart">
                  <Badge count={totalQuantity}>
                    <ShoppingCartOutlined style={{ fontSize: '20px', color: 'white' }} />
                  </Badge>
                </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 134px)' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>E-Commerce ©2025 Created by You</Footer>
        </Layout>
      );
    }

    export default App;
    ```

---

### 步骤 5: 更新路由

最后，将购物车页面添加到路由表中。

```tsx
// src/router/index.tsx
// ... (其他 imports)
import CartPage from '../pages/Cart'; // 导入

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // ... (其他路由)
      {
        path: 'cart', // 购物车页面
        element: <CartPage />,
      },
    ],
  },
]);
```

---

**恭喜！** 完成以上所有步骤后，你的应用就拥有了一个功能完备的购物车系统。你可以添加商品、在购物车页面修改数量或删除商品，并且在网站的任何地方都能看到实时的购物车商品总数。

接下来，你可以挑战更有难度的订单模块了！