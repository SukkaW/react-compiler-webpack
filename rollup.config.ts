import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';

import pkgJson from './package.json';
import { builtinModules } from 'node:module';

const externalModules = Object.keys(pkgJson.dependencies)
  .concat(Object.keys(pkgJson.peerDependencies))
  .concat(builtinModules).concat('next');
const external = (id: string) => externalModules.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig([
  {
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
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'commonjs'
    },
    plugins: [dts()]
  },
  {
    input: 'src/react-compiler-loader.ts',
    output: {
      file: 'dist/react-compiler-loader.js',
      format: 'commonjs'
    },
    plugins: [swc()],
    external
  }
]);
