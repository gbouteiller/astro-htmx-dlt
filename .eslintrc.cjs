/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {project: true, sourceType: 'module', ecmaVersion: 2020},
  env: {browser: true, es2017: true, node: true},
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['*.cjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:unicorn/recommended',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {parser: '@typescript-eslint/parser', extraFileExtensions: ['.astro']},
      rules: {
        '@typescript-eslint/no-unsafe-return': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/ban-types': ['error', {types: {'{}': false}}],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': ["error", { "ignoreRestArgs": true }],
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],  
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
};
