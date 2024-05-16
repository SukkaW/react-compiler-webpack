import chai from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

import { defineReactCompilerLoaderOption } from '../dist';

import getWebpackCompiler from './utils/get-webpack-compiler';
import getRspackCompiler from './utils/get-rspack-compiler';

import compile from './utils/compile';
import getModuleSource from './utils/get-module-source';

chai.should();
chai.use(jestSnapshotPlugin());

const defaultOption = defineReactCompilerLoaderOption({
  sources() { return true; }
});

([
  ['react-compiler-webpack (webpack)', getWebpackCompiler],
  ['react-compiler-webpack (rspack)', getRspackCompiler]
] as const).forEach(([name, getCompiler]) => {
  describe(name, () => {
    it('defineForgettiLoaderOptions', () => {
      const opt = {};
      const definedOpt = defineReactCompilerLoaderOption({});

      definedOpt.should.eql(opt);
    });

    it('should work', async () => {
      const [compiler, fs] = getCompiler('./simple.jsx', defaultOption);
      const stats = await compile(compiler);

      getModuleSource('./simple.jsx', stats, fs)?.should.toMatchSnapshot('simple.jsx');
    });

    it('should work with tsx', async () => {
      const [compiler, fs] = getCompiler('./simple.tsx', defaultOption);
      const stats = await compile(compiler);

      getModuleSource('./simple.tsx', stats, fs)?.should.toMatchSnapshot('simple.tsx');
    });

    it('should optimize complex component', async () => {
      const [compiler, fs] = getCompiler('./complex.tsx', defaultOption);
      const stats = await compile(compiler);

      getModuleSource('./complex.tsx', stats, fs)?.should.toMatchSnapshot('complex.tsx');
    });
  });
});
