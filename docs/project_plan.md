# 简历项目：React + TypeScript 商城

这是一个为期十个阶段的 React + TypeScript 商城项目，旨在全面展示你的前端开发能力。每个阶段都包含明确的任务和技术要点，可以作为你简历上的亮点。

## 🎯 项目目录结构规划

```
react_project/
├── public/                      # 静态资源
│   ├── images/                  # 图片资源
│   └── favicon.ico
├── src/
│   ├── assets/                  # 资源文件
│   │   ├── images/
│   │   └── styles/              # 全局样式
│   ├── components/              # 公共组件
│   │   ├── Layout/              # 布局组件
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Sidebar/
│   │   ├── ProductCard/         # 商品卡片
│   │   ├── Loading/             # 加载组件
│   │   └── ProtectedRoute/      # 路由守卫
│   ├── pages/                   # 页面组件
│   │   ├── Home/                # 首页
│   │   ├── Login/               # 登录
│   │   ├── Register/            # 注册
│   │   ├── ProductList/         # 商品列表
│   │   ├── ProductDetail/       # 商品详情
│   │   ├── Cart/                # 购物车
│   │   ├── Checkout/            # 订单确认
│   │   ├── OrderList/           # 订单列表
│   │   ├── OrderDetail/         # 订单详情
│   │   ├── Profile/             # 个人中心
│   │   └── Admin/               # 后台管理
│   ├── store/                   # Redux状态管理
│   │   ├── slices/              # Redux切片
│   │   │   ├── authSlice.ts     # 用户认证
│   │   │   ├── cartSlice.ts     # 购物车
│   │   │   └── productSlice.ts  # 商品
│   │   └── index.ts             # Store配置
│   ├── services/                # API服务
│   │   ├── api.ts               # API基础配置
│   │   ├── authService.ts       # 认证服务
│   │   ├── productService.ts    # 商品服务
│   │   └── orderService.ts      # 订单服务
│   ├── types/                   # TypeScript类型定义
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── common.ts
│   ├── utils/                   # 工具函数
│   │   ├── request.ts           # 请求封装
│   │   ├── storage.ts           # 本地存储
│   │   └── helpers.ts           # 辅助函数
│   ├── hooks/                   # 自定义Hooks
│   ├── router/                  # 路由配置
│   │   └── index.tsx
│   ├── mocks/                   # Mock数据
│   │   └── handlers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

## 💡 技术亮点（简历加分项）

1.  **TypeScript严格模式** - 展示类型安全编程能力
2.  **Redux Toolkit + RTK Query** - 现代化状态管理，减少样板代码
3.  **组件化设计** - 可复用的组件库
4.  **性能优化** - 路由懒加载、图片懒加载、防抖节流
5.  **响应式设计** - 移动端适配
6.  **代码规范** - ESLint + Prettier统一代码风格
7.  **权限控制** - 路由守卫、角色管理
8.  **测试覆盖** - 单元测试和集成测试

## 📝 开发计划

### 第一阶段：项目初始化与基础配置
- **任务**: 创建Vite + React + TypeScript项目，配置ESLint、Prettier、路由等基础设施。
- **子任务**:
    - 使用Vite创建项目
    - 安装核心依赖（React Router、Redux Toolkit、Ant Design等）
    - 配置TypeScript严格模式
    - 设置ESLint和Prettier
    - 创建基础目录结构

### 第二阶段：项目架构搭建
- **任务**: 搭建项目的核心架构和公共组件。
- **子任务**:
    - 创建路由配置（`/src/router`）
    - 配置Redux Store（`/src/store`）
    - 创建API服务层（`/src/services`）
    - 设计通用类型定义（`/src/types`）
    - 创建公共Layout组件（Header、Footer、Sidebar）

### 第三阶段：用户认证模块
- **任务**: 实现用户登录、注册和权限管理。
- **子任务**:
    - 创建登录页面（`/src/pages/Login`）
    - 创建注册页面（`/src/pages/Register`）
    - 实现用户状态管理（Redux Slice）
    - 添加路由守卫（`ProtectedRoute`组件）
    - 实现Token存储和自动登录
    - 创建个人中心页面

### 第四阶段：商品展示模块
- **任务**: 实现商品列表、详情、搜索和筛选功能。
- **子任务**:
    - 创建商品列表页（`/src/pages/ProductList`）
    - 创建商品详情页（`/src/pages/ProductDetail`）
    - 实现商品搜索功能
    - 实现分类筛选和排序
    - 创建商品卡片组件
    - 实现分页功能

### 第五阶段：购物车模块
- **任务**: 实现购物车的增删改查功能。
- **子任务**:
    - 创建购物车页面（`/src/pages/Cart`）
    - 实现购物车状态管理（Redux）
    - 添加商品到购物车
    - 修改商品数量
    - 删除购物车商品
    - 计算总价和优惠
    - 购物车徽章显示

### 第六阶段：订单管理模块
- **任务**: 实现订单创建、查看和管理功能。
- **子任务**:
    - 创建订单确认页（`/src/pages/Checkout`）
    - 创建订单列表页（`/src/pages/OrderList`）
    - 创建订单详情页（`/src/pages/OrderDetail`）
    - 实现订单状态管理
    - 实现订单创建流程
    - 订单支付模拟

### 第七阶段：后台管理模块
- **任务**: 实现简易的后台管理功能（展示技术能力）。
- **子任务**:
    - 创建管理后台布局（`/src/pages/Admin`）
    - 商品管理（CRUD）
    - 订单管理（查看、状态更新）
    - 数据统计Dashboard
    - 权限控制（管理员才能访问）

### 第八阶段：Mock数据和API集成
- **任务**: 创建Mock数据服务，模拟真实API。
- **子任务**:
    - 使用MSW（Mock Service Worker）或JSON Server
    - 创建商品数据Mock
    - 创建用户数据Mock
    - 创建订单数据Mock
    - 实现API请求拦截器
    - 错误处理机制

### 第九阶段：性能优化与细节完善
- **任务**: 优化项目性能和用户体验。
- **子任务**:
    - 实现路由懒加载
    - 图片懒加载
    - 添加Loading状态
    - 添加骨架屏
    - 实现防抖和节流
    - 优化Redux性能（使用RTK Query缓存）
    - 响应式设计优化

### 第十阶段：测试与文档
- **任务**: 编写测试和项目文档。
- **子任务**:
    - 编写单元测试（Jest + React Testing Library）
    - 编写集成测试
    - 完善README文档
    - 添加代码注释
    - 创建部署说明
    - 准备简历展示材料（功能清单、技术亮点）
