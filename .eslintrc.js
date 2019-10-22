module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    'cypress',
    'prettier',
    'jest',
    'jsdoc',
    'promise',
    'graphql',
    'react-hooks',
    '@typescript-eslint',
  ],
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:cypress/recommended',
    // 'plugin:@typescript-eslint/recommended',
    //    "plugin:promise/recommended" @todo turn this back and .then() fix every error
  ],
  env: {
    'jest/globals': true,
    'cypress/globals': true,
  },
  globals: {
    document: true,
    window: true,
  },
  settings: {
    'import/resolver': {
      // use an array of glob patterns
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root/>@types` directory even it doesn't contain any source code, like `@types/unist`
        // can glob
        directory: ['./tsconfig.json'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        // "@typescript-eslint/explicit-function-return-type": ["error"]
        'valid-jsdoc': [0],
      },
    },
  ],
  rules: {
    'consistent-return': [0],
    'import/no-extraneous-dependencies': [0],
    'import/prefer-default-export': [0],
    'import/dynamic-import-chunkname': [2],
    'import/no-dynamic-require': [0],
    'jsdoc/check-types': 'error',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref'],
      },
    ],
    'jsx-a11y/href-no-hash': 'off',
    'no-console': [0],
    'no-param-reassign': [
      1,
      {
        props: false,
      },
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-useless-constructor': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        singleQuote: true,
        semi: true,
      },
    ],
    'react/boolean-prop-naming': [2],
    'react/destructuring-assignment': [0],
    'react/forbid-prop-types': [
      2,
      {
        forbid: ['any', 'array'],
      },
    ],
    'react/jsx-key': [2],
    'react-hooks/rules-of-hooks': 'error',
    'react/no-array-index-key': [2],
    'react/no-danger': [0],
    'react/jsx-props-no-spreading': [0], // @todo remove rule, fix (props spreading is bad!)
    'react/sort-comp': [0],
    'react/static-property-placement': [0, 'static public field'],
    'react/require-extension': [0],
    strict: [0],
    // @todo enable
    //    "graphql/template-strings": ["error", {
    //      "env": "literal"
    //    }]
  },
};
