module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['prisma/*']
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};
