import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';

import pkgJson from './package.json';
import { builtinModules } from 'module';

const externalModules = Object.keys(pkgJson.dependencies)
  .concat(Object.keys(pkgJson.peerDependencies))
  .concat(builtinModules).concat('next');
const external = (id: string) => externalModules.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig([{
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'commonjs'
  },
  plugins: [
    swc(),
    copy({
      targets: [
        { src: 'src/stylex.virtual.css', dest: 'dist' }
      ]
    })
  ],
  external
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'commonjs'
  },
  plugins: [dts()]
}, {
  input: 'src/stylex-loader.ts',
  output: {
    file: 'dist/stylex-loader.js',
    format: 'commonjs'
  },
  plugins: [swc()],
  external
}, {
  input: 'src/stylex-virtual-css-loader.ts',
  output: {
    file: 'dist/stylex-virtual-css-loader.js',
    format: 'commonjs'
  },
  plugins: [swc()],
  external
}, {
  input: 'src/next.ts',
  output: {
    file: 'dist/next.js',
    format: 'commonjs'
  },
  plugins: [swc()],
  external(id: string) {
    const isExternal = external(id);
    if (isExternal) return true;
    return id === './index';
  }
}, {
  input: 'src/next.ts',
  output: {
    file: 'dist/next.d.ts',
    format: 'commonjs'
  },
  plugins: [dts()],
  external
}]);
