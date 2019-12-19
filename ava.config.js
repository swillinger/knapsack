import util from 'util';

util.inspect.defaultOptions.depth = 5;

// https://github.com/avajs/ava/blob/master/docs/06-configuration.md
export default {
  files: [
    'knapsack/tests/**/*',
    'packages/*/tests/**/*',
    '!dist',
    // 'packages/renderer-twig/tests/*',
  ],
  extensions: ['.test.ts'],
  helpers: ['**/tests/fixtures/**/*', '**/tests/helpers/**/*'],
  // sources: ['src/**/*'],
  // match: ['*oo', '!foo'],
  cache: true,
  // concurrency: 5,
  failFast: true,
  failWithoutAssertions: false,
  // environmentVariables: {
  //   MY_ENVIRONMENT_VARIABLE: 'some value',
  // },
  // tap: true,
  // verbose: true,
  // compileEnhancements: false,
  require: ['@babel/register'],
  babel: {
    extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
    testOptions: {
      // presets: [['@ava/transform-test-files', { powerAssert: false }]],
    },
  },
};
