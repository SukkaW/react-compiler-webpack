import path from 'path';

import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

import type { ReactCompilerLoaderOption } from '../../src';

import pkgJson from '../../package.json';
import { builtinModules } from 'module';
import type { Options as SwcOptions } from '@swc/core';

export const externalModules = Object.keys(pkgJson.dependencies)
  .concat(Object.keys(pkgJson.peerDependencies))
  .concat(builtinModules)
  .concat(['react', 'react/jsx-runtime', 'forgetti', 'forgetti/runtime', 'preact/hooks', 'preact/compat', 'preact']);

const useSwcLoader = (isTSX: boolean) => ({
  loader: 'swc-loader',
  options: {
    jsc: {
      parser: {
        syntax: isTSX ? 'typescript' : 'ecmascript',
        ...(
          isTSX
            ? { tsx: true }
            : { jsx: true }
        )
      },
      target: 'esnext',
      transform: {
        react: {
          runtime: 'automatic',
          refresh: false,
          development: false
        }
      }
    }
  } satisfies SwcOptions
});

export default (fixture: string, loaderOptions: ReactCompilerLoaderOption = {}, config: webpack.Configuration = {}) => {
  const fullConfig: webpack.Configuration = {
    mode: 'development',
    target: 'web',
    devtool: config.devtool || false,
    context: path.resolve(__dirname, '../fixtures'),
    entry: Array.isArray(fixture)
      ? fixture
      : path.resolve(__dirname, '../fixtures', fixture),
    output: {
      path: '/',
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/webpack/public/path/',
      assetModuleFilename: '[name][ext]'
    },
    module: {
      rules: [
        {
          test: /\.[cm]?jsx$/i,
          exclude: /node_modules/,
          use: [
            useSwcLoader(false),
            {
              loader: path.resolve(__dirname, '../../dist/index.js'),
              options: loaderOptions
            }
          ]
        },
        {
          test: /\.[cm]?tsx$/i,
          exclude: /node_modules/,
          use: [
            useSwcLoader(true),
            {
              loader: path.resolve(__dirname, '../../dist/index.js'),
              options: loaderOptions
            }
          ]
        }
        // {
        //   test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
        //   resourceQuery: /^(?!.*\?ignore-asset-modules).*$/,
        //   type: 'asset/resource'
        // },
        // {
        //   resourceQuery: /\?ignore-asset-modules$/,
        //   type: 'javascript/auto'
        // }
      ]
    },
    optimization: { minimize: false },
    externals: externalModules,
    plugins: [],
    ...config
  };

  const compiler = webpack(fullConfig);
  const fs = createFsFromVolume(new Volume()) as unknown as typeof import('fs');

  compiler.outputFileSystem = fs;

  return [compiler, fs] as const;
};
