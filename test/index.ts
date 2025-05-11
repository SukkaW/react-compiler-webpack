import { defineReactCompilerLoaderOption } from '../dist';

import getWebpackCompiler from './utils/get-webpack-compiler';
import getRspackCompiler from './utils/get-rspack-compiler';

import compile from './utils/compile';
import getModuleSource from './utils/get-module-source';

import 'mocha-expect-snapshot';

import { jestExpect as expect } from '@jest/expect';

const defaultOption = defineReactCompilerLoaderOption({
  sources() { return true; }
});

([
  ['react-compiler-webpack (webpack)', getWebpackCompiler],
  ['react-compiler-webpack (rspack)', getRspackCompiler]
] as const).forEach(([name, getCompiler]) => {
  describe(name, () => {
    it('defineReactCompilerLoaderOption', () => {
      const opt = {};
      const definedOpt = defineReactCompilerLoaderOption(opt);

      expect(definedOpt).toBe(opt);
    });

    it('should work', async () => {
      const [compiler, fs] = getCompiler('./simple.jsx', defaultOption);
      const stats = await compile(compiler);

      expect(getModuleSource('./simple.jsx', stats, fs)).toMatchSnapshot(name + ':simple.jsx');
    });

    it('should work with tsx', async () => {
      const [compiler, fs] = getCompiler('./simple.tsx', defaultOption);
      const stats = await compile(compiler);

      expect(getModuleSource('./simple.tsx', stats, fs)).toMatchSnapshot(name + ':simple.tsx');
    });

    it('should optimize complex component', async () => {
      const [compiler, fs] = getCompiler('./complex.tsx', defaultOption);
      const stats = await compile(compiler);

      expect(getModuleSource('./complex.tsx', stats, fs)).toMatchSnapshot(name + ':complex.tsx');
    });

    // https://github.com/facebook/react/issues/29120
    it('facebook/react issue #29120', async () => {
      const [compiler, fs] = getCompiler('./cjk.tsx', defaultOption);
      const stats = await compile(compiler);

      expect(getModuleSource('./cjk.tsx', stats, fs)).toMatchSnapshot(name + ':cjk.tsx');
    });
  });
});
