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

这个页面将展示购物车中的所有商品，并允许用户管理它们。我们采用现代电商常见的**“卡片列表 + 底部结算栏 + 管理模式切换”**布局：默认模式下只展示商品详情与数量调节；点击“管理商品”按钮后，所有卡片会条件渲染复选框和删除操作，让用户在同一视图内批量管理。

1.  **创建 `src/pages/Cart/index.tsx` 文件**:

    ```tsx
    // src/pages/Cart/index.tsx
    import { useMemo, useState } from 'react';
    import { useSelector, useDispatch } from 'react-redux';
    import { RootState, AppDispatch } from '../../store';
    import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
    import { Button, InputNumber, Typography, Empty, Space, Card, message, Checkbox } from 'antd';
    import { DeleteOutlined } from '@ant-design/icons';

    const { Title, Text } = Typography;

    const CartPage = () => {
      const dispatch: AppDispatch = useDispatch();
      const { items, totalPrice, totalQuantity } = useSelector((state: RootState) => state.cart);
      const [isManaging, setIsManaging] = useState(false);
      const [selectedIds, setSelectedIds] = useState<string[]>([]);

      const selectedCount = selectedIds.length;

      const handleRemove = (id: string, name?: string) => {
        dispatch(removeFromCart(id));
        if (name) {
          message.success(`已将 "${name}" 从购物车移除`);
        }
      };

      const handleQuantityChange = (id: string, quantity: number) => {
        if (quantity === 0) {
          const item = items.find(i => i.id === id);
          handleRemove(id, item?.name || '商品');
        } else {
          dispatch(updateQuantity({ id, quantity }));
        }
      };

      const toggleManageMode = () => {
        setIsManaging(prev => !prev);
        setSelectedIds([]);
      };

      const toggleSelect = (id: string, checked: boolean) => {
        setSelectedIds(prev => checked ? [...prev, id] : prev.filter(itemId => itemId !== id));
      };

      const handleRemoveSelected = () => {
        if (selectedIds.length === 0) return;
        selectedIds.forEach(id => {
          const item = items.find(i => i.id === id);
          handleRemove(id, item?.name);
        });
        message.success('已删除所选商品');
        setSelectedIds([]);
        setIsManaging(false);
      };

      const handleClearCart = () => {
        dispatch(clearCart());
        message.info('购物车已清空');
        setSelectedIds([]);
        setIsManaging(false);
      };

      const totalSelectedPrice = useMemo(() => {
        return selectedIds.reduce((sum, id) => {
          const item = items.find(i => i.id === id);
          return item ? sum + item.price * item.quantity : sum;
        }, 0);
      }, [items, selectedIds]);

      if (items.length === 0) {
        return (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <Empty description={<Title level={4}>您的购物车还是空的</Title>}>
              <Button type="primary" href="/products">马上去逛逛</Button>
            </Empty>
          </div>
        );
      }

      return (
        <div style={{ padding: '24px', paddingBottom: '120px' /* 为固定底栏留出空间 */ }}>
          <Title level={2} style={{ marginBottom: '24px' }}>我的购物车</Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item) => {
              const checked = selectedIds.includes(item.id);
              return (
                <Card key={item.id} bodyStyle={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {isManaging && (
                      <Checkbox
                        checked={checked}
                        onChange={(e) => toggleSelect(item.id, e.target.checked)}
                      />
                    )}

                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Title level={5} style={{ margin: 0 }}>{item.name}</Title>
                      <Text type="secondary">单价: ¥{item.price.toFixed(2)}</Text>
                      <Text type="secondary">小计: ¥{(item.price * item.quantity).toFixed(2)}</Text>
                    </div>

                    {!isManaging && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text type="secondary">数量</Text>
                        <InputNumber
                          min={0}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.id, value || 0)}
                          style={{ width: '100px' }}
                        />
                      </div>
                    )}

                    {isManaging && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(item.id, item.name)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#fff',
              boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: 1200,
                padding: '16px 24px',
              }}
            >
              <div>
                <Space align="baseline">
                  <Title level={4} style={{ margin: 0 }}>
                    总计: <Text type="danger">¥{totalPrice.toFixed(2)}</Text>
                  </Title>
                  <Text type="secondary">({totalQuantity} 件)</Text>
                </Space>
                {isManaging && selectedCount > 0 && (
                  <Text type="secondary">已选 {selectedCount} 件，合计 ¥{totalSelectedPrice.toFixed(2)}</Text>
                )}
              </div>
              <div>
                <Space>
                  {isManaging ? (
                    <>
                      <Button onClick={toggleManageMode}>取消管理</Button>
                      <Button danger disabled={selectedCount === 0} onClick={handleRemoveSelected}>
                        删除所选
                      </Button>
                      <Button danger type="link" onClick={handleClearCart}>
                        清空全部
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={toggleManageMode}>管理商品</Button>
                      <Button type="primary" size="large">去结算</Button>
                    </>
                  )}
                </Space>
              </div>
            </div>
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