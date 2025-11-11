// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // ESLint推奨ルール
  js.configs.recommended,

  // React/JSXの設定
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser, // ブラウザのグローバル変数
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // React推奨ルール
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React設定の上書き
      'react/react-in-jsx-scope': 'off', // React 17+では不要
      'react/prop-types': 'off', // PropTypesは使わない

      // React Hooks設定の上書き
      'react-hooks/exhaustive-deps': 'warn', // 依存配列は警告のみ

      // 一般的なルール
      'no-unused-vars': 'warn', // 未使用変数は警告
      'no-undef': 'error', // 未定義変数はエラー
      'no-console': 'off', // console.logを許可
    },
    settings: {
      react: {
        version: 'detect', // package.jsonから自動検出
      },
    },
  },

  // 除外パターン
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  },
];
