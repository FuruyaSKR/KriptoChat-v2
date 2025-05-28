// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  ignorePatterns: [
    '*.test.js',
    '*.test.tsx',
    '*.spec.js',
    '*.spec.tsx',
    '*.cy.ts',
    'build/*',
    'src/setupTests.js',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Added temporarily - remove when types are added (change to error || warn after)
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'no-mixed-spaces-and-tabs': 'warn',
    'no-extra-semi': 'warn',
    'no-var': 'warn',
    'react/no-unescaped-entities': 'warn',
    'prefer-const': 'warn',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
