// eslint.config.js (ESM - Flat config, ESLint v9+)
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended, // TypeScript support
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: { project: false }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': hooks,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'off'
    },
    settings: { react: { version: 'detect' } }
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage'
    ]
  }
)
