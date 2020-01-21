import { createRollupConfig } from '@knapsack/build-tools/dist/create-rollup-config';
// import pkg from './package.json';

const distDir = './dist';

const main = createRollupConfig({
  input: {
    'ks-design-system': './src/index.ts',
  },
  cssOutputFile: './dist/ks-design-system.css',
  distDir,
  globals: {
    react: 'React',
  },
  watchIncludes: ['./src/**', './src/**/*.scss'],
});

// making a spinner only bundle so the code splitting react loading components can use this spinner in the loader without loading the whole design system
const spinnerOnly = createRollupConfig({
  input: {
    'ks-spinners': './src/spinner/spinner.tsx',
  },
  cssOutputFile: './dist/ks-spinners.css',
  distDir,
  globals: {
    react: 'React',
  },
});

export default [main, spinnerOnly];
