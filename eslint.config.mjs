import js from '@eslint/js'
import * as globals from 'globals'
import { defineConfig } from 'eslint/config'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig({
  ...js.configs.recommended,
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      require: 'readonly',
      module: 'readonly',
      __dirname: 'readonly',
      ...globals.browser,
      ...globals.node,
    },
  },
  ignores: ['node_modules', 'dist', 'build/**'],
  files: ['**/*.{js,mjs,cjs}'],
  plugins: {
    prettier: eslintPluginPrettier,
  },
  extends: ['js/recommended', eslintConfigPrettier],
  rules: {
    ...eslintPluginPrettier.configs.recommended.rules,
    'no-console': 'warn',
    eqeqeq: 'warn',
    curly: 'warn',
    'no-else-return': 'warn',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
})
