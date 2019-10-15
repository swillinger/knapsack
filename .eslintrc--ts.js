const baseConfig = require('./.eslintrc');

module.exports = {
  ...baseConfig,
  parser: '@typescript-eslint/parser',
  extends: [...baseConfig.extends, 'plugin:@typescript-eslint/recommended'],
  plugins: [...baseConfig.plugins, '@typescript-eslint'],
  settings: {
    ...baseConfig.settings,
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    ...baseConfig.rules,
    'valid-jsdoc': [0],
  },
};
