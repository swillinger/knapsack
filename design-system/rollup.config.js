/* eslint-disable no-unused-vars */
import commonjs from '@rollup/plugin-commonjs';
// import builtins from 'rollup-plugin-node-builtins';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import path from 'path';
import pkg from './package.json';

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
console.log('dirname', __dirname);
/**
 * Either a function that takes an id and returns true (external) or false (not external), or an Array of module IDs that should remain external to the bundle.
 * The IDs should be either:
 * 1) the name of an external dependency, exactly the way it is written in the import statement. I.e. to mark import "dependency.js" as external, use "dependency.js" while to mark import "dependency" as external, use "dependency".
 * 2) a resolved ID (like an absolute path to a file).
 * @link https://rollupjs.org/guide/en/#core-functionality
 */
function external(id, parentId, isResolved) {
  // this means it is inside this package; not external
  if (id.startsWith('.')) return false;
  if (path.isAbsolute(id)) {
    if (id.includes('node_modules')) return true;
    // it's inside here
    if (id.startsWith(__dirname)) return false;
    if (path.relative(__dirname, id).startsWith('..')) {
      console.error({ id, parentId, isResolved });
      throw new Error(`should not include something outside this directory`);
    }
  }

  // if not, then it's a dependency
  return true;
}

export default {
  input: './src/index.ts',
  output: {
    file: pkg.module,
    format: 'esm',
  },
  external,
  plugins: [
    babel({
      // extends: '@knapsack/babel-config/es',
      extensions,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    scss(),
    resolve({
      extensions,
    }),
    image(),
    commonjs(),
    json(),
    url({
      limit: Infinity,
      // limit: 1000 * 30, // kb
      include: [
        '**/*.svg',
        '**/*.png',
        '**/*.jpg',
        '**/*.gif',
        '**/*.woff',
        '**/*.woff2',
      ],
    }),
  ],
  onwarn(warning) {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }

    // console.warn everything else
    console.warn(warning.message);
  },
};
