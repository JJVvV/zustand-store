module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint', 'jest'],

  extends: [
    'plugin:jest/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended', // plugin-prettier
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    'prettier/prettier': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    eqeqeq: 'off',
  },
};
