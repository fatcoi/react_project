# 第一阶段：项目初始化与基础配置

本阶段的目标是搭建一个现代化的 React 开发环境，为后续的商城功能开发打下坚实的基础。

---

### 步骤 1: 使用 Vite 创建项目

[Vite](https://vitejs.dev/) 是一个极速的现代前端构建工具。我们将使用它来创建我们的 React + TypeScript 项目。

打开你的终端，进入 `react_project` 目录，然后运行以下命令：

```bash
# 在 react_project 目录下执行
npm create vite@latest . -- --template react-ts
```

**命令解释**:
- `npm create vite@latest .`: 在当前目录 (`.`) 创建一个 Vite 项目。
- `-- --template react-ts`: `--` 是一个分隔符，确保后面的参数是传递给 `create-vite` 脚手架的。`--template react-ts` 指定了我们使用 `React` 和 `TypeScript` 的模板。

执行完毕后，你的项目根目录会生成一些初始文件。

接着，安装项目初始的依赖：
```bash
npm install
```

---

### 步骤 2: 安装核心依赖

接下来，我们安装项目所需的核心库。

- **`react-router-dom`**: 用于实现页面路由。
- **`@reduxjs/toolkit` 和 `react-redux`**: 用于全局状态管理。
- **`antd`**: 一个流行的 React UI 组件库，可以快速构建美观的界面。
- **`axios`**: 用于发起网络请求。

运行以下命令来安装它们：

```bash
npm install react-router-dom @reduxjs/toolkit react-redux antd axios
```

---

### 步骤 3: 配置 TypeScript 严格模式

为了保证代码质量和类型安全，我们应该在 `tsconfig.json` 文件中开启所有严格模式相关的选项。

打开 `tsconfig.json` 文件，找到 `compilerOptions` 部分，确保以下选项是 `true`：

```json
{
  "compilerOptions": {
    // ... 其他选项
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true, // 开启所有严格检查
    "noUnusedLocals": true, // 报告未使用的局部变量
    "noUnusedParameters": true, // 报告未使用的参数
    "noFallthroughCasesInSwitch": true // 报告 switch 语句中的 fallthrough 情况
  },
  // ... 其他配置
}
```
**关键点**: `"strict": true` 会隐式地开启一系列类型检查选项，是 TypeScript 的最佳实践。

---

### 步骤 4: 设置 ESLint 和 Prettier

为了统一代码风格和提前发现潜在错误，我们需要配置 ESLint (代码检查) 和 Prettier (代码格式化)。

首先，安装所需的开发依赖：

```bash
npm install -D eslint prettier \
@typescript-eslint/parser @typescript-eslint/eslint-plugin \
eslint-plugin-react-hooks eslint-plugin-react-refresh \
eslint-config-prettier eslint-plugin-prettier
```

然后，在项目根目录创建以下两个配置文件：

1.  **`.eslintrc.cjs`** (替代 `.eslintrc.json` 以支持 `module.exports`)

    ```javascript
    module.exports = {
      root: true,
      env: { browser: true, es2020: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier', // 确保 prettier 是最后一个，以覆盖其他配置
      ],
      ignorePatterns: ['dist', '.eslintrc.cjs'],
      parser: '@typescript-eslint/parser',
      plugins: ['react-refresh', 'prettier'],
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
        'prettier/prettier': 'error', // 将 prettier 规则作为 ESLint 错误来报告
        '@typescript-eslint/no-explicit-any': 'warn' // 对 any 类型给出警告而不是错误
      },
    };
    ```

2.  **`.prettierrc`**

    ```json
    {
      "semi": true,
      "singleQuote": true,
      "trailingComma": "all",
      "printWidth": 80,
      "tabWidth": 2
    }
    ```

**提示**: 你可能还需要在 VS Code 中安装 ESLint 和 Prettier 插件，以获得最佳的开发体验。

---

### 步骤 5: 创建基础目录结构

根据我们的项目规划，现在创建基础的文件夹结构。

你可以手动创建，也可以在终端运行以下命令 (在 `src` 目录下执行):

```bash
cd src
mkdir assets components pages store services types utils hooks router mocks
cd assets
mkdir styles images
```

这会创建出我们在项目规划中定义的所有核心目录。

---

**恭喜！** 你已经完成了第一阶段的全部任务。现在你的项目拥有了一个稳固的基础架构，可以开始第二阶段的开发了。
