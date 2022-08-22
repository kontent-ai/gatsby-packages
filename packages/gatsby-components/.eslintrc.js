module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  rules: {
    '@typescript-eslint/no-use-before-define': [
      'warn',
      { functions: false, classes: true },
    ],
    "react/prop-types": 0
  },
};
