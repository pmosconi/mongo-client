import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'no-undef': 'off', // TypeScript handles this
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'quotes': 'off',
      'prettier/prettier': 'off',
    },
  },
  prettier,
  {
    ignores: ['eslint.config.js', 'deploy/**', 'node_modules/**', 'lambda-local.cjs', '**/backup/**'],
  },
];