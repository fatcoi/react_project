
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