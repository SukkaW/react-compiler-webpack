import { defineReactCompilerLoaderOption } from '../dist';

import getWebpackCompiler from './utils/get-webpack-compiler';
import getRspackCompiler from './utils/get-rspack-compiler';

import compile from './utils/compile';
import getModuleSource from './utils/get-module-source';
import getErrors from './utils/get-errors';

import { expect } from 'earl';
import { describe, it } from 'mocha';

import { trueFn } from 'foxts/noop';

const defaultOption = defineReactCompilerLoaderOption({
  sources: trueFn
});

([
  ['react-compiler-webpack (webpack)', getWebpackCompiler],
  ['react-compiler-webpack (rspack)', getRspackCompiler]
] as const).forEach(([name, getCompiler]) => {
  describe(name, function () {
    this.timeout(100000);

    it('defineReactCompilerLoaderOption', () => {
      const opt = {};
      const definedOpt = defineReactCompilerLoaderOption(opt);

      expect(definedOpt).toEqual(opt);
    });

    it('should work', async function (this) {
      const [compiler, fs] = getCompiler('./simple.jsx', defaultOption);

      const stats = await compile(compiler);

      expect(getModuleSource('./simple.jsx', stats, fs)).toMatchSnapshot(this);
    });

    it('should work with tsx', async function (this) {
      const [compiler, fs] = getCompiler('./simple.tsx', defaultOption);

      const stats = await compile(compiler);

      expect(getModuleSource('./simple.tsx', stats, fs)).toMatchSnapshot(this);
    });

    it('should optimize complex component', async function (this) {
      const [compiler, fs] = getCompiler('./complex.tsx', defaultOption);
      const stats = await compile(compiler);

      expect(getModuleSource('./complex.tsx', stats, fs)).toMatchSnapshot(this);
    });

    // https://github.com/facebook/react/issues/29120
    it('facebook/react issue #29120', async function (this) {
      const [compiler, fs] = getCompiler('./cjk.tsx', defaultOption);
      const stats = await compile(compiler);

      expect(getModuleSource('./cjk.tsx', stats, fs)).toMatchSnapshot(this);
    });

    it('should work with a generic arrow function in a non-jsx ts file', async () => {
      const [compiler, fs] = getCompiler('./generic-arrow.ts', defaultOption);
      const stats = await compile(compiler);

      // not a snapshot, its source map would embed an absolute path
      expect(getErrors(stats)).toEqual([]);
      expect(getModuleSource('./generic-arrow.ts', stats, fs)).toInclude('_c(');
    });

    it('should work with a generic arrow function in an mts file', async () => {
      const [compiler, fs] = getCompiler('./generic-arrow.mts', defaultOption);
      const stats = await compile(compiler);

      expect(getErrors(stats)).toEqual([]);
      expect(getModuleSource('./generic-arrow.mts', stats, fs)).toInclude('_c(');
    });

    it('should reject an ambiguous generic arrow in an mts file', async () => {
      const [compiler] = getCompiler('./ambiguous.mts', defaultOption);
      const stats = await compile(compiler);

      expect(getErrors(stats).join('\n')).toInclude('reserved in files with the .mts or .cts extension');
    });
  });
});
