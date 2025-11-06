# 第四阶段：商品展示模块

恭喜你完成了用户认证！现在，我们来构建电商应用的核心——商品展示功能。这个阶段将涵盖商品列表和商品详情页的创建，并引入异步数据获取的逻辑。

---

### 步骤 1: 定义商品类型与创建 Mock 数据

在连接真实 API 之前，我们先用 Mock（模拟）数据来开发。

1.  **定义商品类型 (`src/types/product.ts`)**:
    创建一个新文件来定义 `Product` 的数据结构。

    ```ts
    // src/types/product.ts
    export interface Product {
      id: string;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      category: string;
      stock: number;
    }
    ```

2.  **创建 Mock 数据 (`src/mocks/products.ts`)**:
    创建一个文件来存放我们的模拟商品数据。

    ```ts
    // src/mocks/products.ts
    import { Product } from '../types/product';

    export const mockProducts: Product[] = [
      {
        id: '1',
        name: '高性能笔记本电脑',
        price: 8999,
        description: '最新款处理器，超长续航，轻薄便携，满足你的一切办公和娱乐需求。',
        imageUrl: 'https://via.placeholder.com/300x300/FFC107/000000?text=Laptop',
        category: '电子产品',
        stock: 15,
      },
      {
        id: '2',
        name: '人体工学办公椅',
        price: 1299,
        description: '多功能调节，完美支撑腰部和颈部，告别久坐疲劳。',
        imageUrl: 'https://via.placeholder.com/300x300/03A9F4/FFFFFF?text=Chair',
        category: '家居生活',
        stock: 30,
      },
      {
        id: '3',
        name: '智能降噪耳机',
        price: 1999,
        description: '沉浸式听觉体验，有效隔绝环境噪音，享受纯净音乐。',
        imageUrl: 'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Headphones',
        category: '电子产品',
        stock: 22,
      },
      // 你可以按此格式添加更多商品...
    ];
    ```

---

### 步骤 2: 创建 Product Slice

我们需要一个新的 Redux Slice 来管理商品相关的状态，比如商品列表、加载状态等。这里我们将首次使用 Redux Toolkit 提供的强大异步 action 工具——`createAsyncThunk`。

1.  **创建 `productSlice.ts`**:

    ```ts
    // src/store/slices/productSlice.ts
    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import { Product } from '../../types/product';
    import { mockProducts } from '../../mocks/products';

    // 1. 定义异步 Thunk Action
    // 'products/fetchProducts' 是一个唯一的 action 类型字符串
    export const fetchProducts = createAsyncThunk(
      'products/fetchProducts',
      async () => {
        // 这里是你的异步逻辑，比如 API 请求
        // 我们用一个延时来模拟网络请求
        const promise = new Promise<Product[]>((resolve) => {
          setTimeout(() => {
            resolve(mockProducts);
          }, 1000); // 模拟 1 秒延迟
        });
        const response = await promise;
        return response;
      }
    );

    // 2. 定义 State 接口
    interface ProductsState {
      items: Product[];
      status: 'idle' | 'loading' | 'succeeded' | 'failed';
      error: string | null;
    }

    const initialState: ProductsState = {
      items: [],
      status: 'idle', // 'idle' 表示初始状态
      error: null,
    };

    // 3. 创建 Slice
    const productSlice = createSlice({
      name: 'products',
      initialState,
      reducers: {
        // 这里可以放同步的 reducer
      },
      // extraReducers 用于处理 createAsyncThunk 生成的 action
      extraReducers: (builder) => {
        builder
          .addCase(fetchProducts.pending, (state) => {
            state.status = 'loading'; // 开始加载
          })
          .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'; // 加载成功
            state.items = action.payload; // 将获取到的数据存入 state
          })
          .addCase(fetchProducts.rejected, (state, action) => {
            state.status = 'failed'; // 加载失败
            state.error = action.error.message || '获取商品失败';
          });
      },
    });

    export default productSlice.reducer;
    ```

2.  **更新 Store (`src/store/index.ts`)**:
    将新的 `productSlice` 添加到你的 store 中。

    ```ts
    // src/store/index.ts
    import { configureStore } from '@reduxjs/toolkit';
    import authReducer from './slices/authSlice';
    import productReducer from './slices/productSlice'; // 导入

    export const store = configureStore({
      reducer: {
        auth: authReducer,
        products: productReducer, // 注册
      },
    });

    // ...类型定义不变
    ```

---

### 步骤 3: 创建商品卡片组件 (`ProductCard`)

在创建列表页面之前，我们先遵循一个最佳实践：将重复的 UI 元素封装成独立的组件。商品卡片显然会在很多地方（首页、搜索页、推荐列表等）被复用。

**为什么封装？**
*   **复用性**: 一次编写，到处使用。
*   **可维护性**: 修改卡片样式只需改动一个文件。
*   **可读性**: 列表页的代码将变得更简洁，只关注布局和数据循环。

1.  **创建 `src/components/ProductCard/index.tsx` 文件**:

    ```tsx
    // src/components/ProductCard/index.tsx
    import { Link } from 'react-router-dom';
    import { Card } from 'antd';
    import type { Product } from '../../types/product';

    const { Meta } = Card;

    interface ProductCardProps {
      product: Product;
    }

    const ProductCard = ({ product }: ProductCardProps) => {
      return (
        <Link to={`/product/${product.id}`}>
          <Card
            hoverable
            cover={<img alt={product.name} src={product.imageUrl} style={{ height: 300, objectFit: 'cover' }} />}
          >
            <Meta title={product.name} description={`¥${product.price.toFixed(2)}`} />
          </Card>
        </Link>
      );
    };

    export default ProductCard;
    ```
    这个组件是一个纯粹的“展示组件”，它只负责接收一个 `product` 对象（通过 props），并把它渲染成一个漂亮的卡片。

---

### 步骤 4: 创建商品列表页

现在我们可以创建一个页面来展示商品了。这个页面将作为“容器组件”，负责获取数据和管理状态，然后将数据传递给“展示组件” `ProductCard`。

1.  **创建 `ProductList` 页面 (`src/pages/ProductList/index.tsx`)**:

    ```tsx
    // src/pages/ProductList/index.tsx
    import { useEffect } from 'react';
    import { useSelector, useDispatch } from 'react-redux';
    import { List, Skeleton, Alert, Typography } from 'antd';
    import { AppDispatch, RootState } from '../../store';
    import { fetchProducts } from '../../store/slices/productSlice';
    import ProductCard from '../../components/ProductCard'; // 导入我们刚刚创建的卡片组件

    const { Title } = Typography;

    const ProductListPage = () => {
      const dispatch: AppDispatch = useDispatch();
      const { item, statu, error } = useSelector((state: RootState) => state.products);

      useEffect(() => {
        // 只有在初始状态时才去获取数据，避免重复获取
        if (status === 'idle') {
          dispatch(fetchProducts());
        }
      }, [status, dispatch]);

      let content;

      if (status === 'loading') {
        const skeletons = Array.from({ length: 8 }).map((_, index) => (
          <List.Item key={index}>
            <Skeleton.Node active style={{ width: '100%', height: '420px' }}>
              <div />
            </Skeleton.Node>
          </List.Item>
        ));
        content = (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={skeletons}
            renderItem={(item) => item}
          />
        );
      } else if (status === 'succeeded') {
        content = (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={items}
            renderItem={(product) => (
              <List.Item>
                {/* 在这里使用独立的卡片组件 */}
                <ProductCard product={product} />
              </List.Item>
            )}
          />
        );
      } else if (status === 'failed') {
        content = <Alert message="错误" description={error} type="error" showIcon />;
      }

      return (
        <div style={{ padding: '24px' }}>
          <Title level={2}>所有商品</Title>
          {content}
        </div>
      );
    };

    export default ProductListPage;
    ```

---

### 步骤 5: 更新路由

最后，将商品列表页和未来的详情页添加到路由表中。

```tsx
// src/router/index.tsx
// ... (其他 imports)
import ProductListPage from '../pages/ProductList';
// import ProductDetailPage from '../pages/ProductDetail'; // 暂时注释，下一步创建

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // ... (其他路由)
      {
        path: 'products', // 商品列表页
        element: <ProductListPage />,
      },
      {
        path: 'product/:id', // 商品详情页，:id 是动态参数
        // element: <ProductDetailPage />,
      },
    ],
  },
]);
```

---

**恭喜！** 完成以上步骤后，你的应用就拥有了一个可以展示商品列表的页面。当你访问 `/products` 路径时，应该会先看到一个加载动画，1秒后，漂亮的商品卡片就会显示出来。

接下来，你可以尝试自己动手创建商品详情页，或者直接进入第五阶段——购物车模块！