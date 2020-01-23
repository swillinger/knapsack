import { createRollupConfig } from '@knapsack/build-tools/dist/create-rollup-config';
import path from 'path';
// import pkg from './package.json';

const client = createRollupConfig({
  input: {
    index: './src/client/index.tsx',
    'changelog-page': './src/client/changelog-page.tsx',
  },
  distDir: path.join(__dirname, './dist/client'),
  external: [],
  watchIncludes: ['./src/**'],
});

// const server = createRollupConfig({
//   input: './src/changelog-md.ts',
//   output: {
//     file: pkg.main,
//     format: 'cjs',
//   },
//   isNode: true,
//   watchIncludes: ['./src/**'],
// });

export default {
  ...client,
};
