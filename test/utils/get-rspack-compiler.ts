import path from 'path';

import { rspack } from '@rspack/core';
import { createFsFromVolume, Volume } from 'memfs';

import type { RspackOptions } from '@rspack/core';
import { externalModules } from './get-webpack-compiler';

import { reactCompilerLoader, type ReactCompilerLoaderOption } from '../../src';

export default (fixture: string, loaderOptions: ReactCompilerLoaderOption = {}, config: RspackOptions = {}) => {
  process.env.RSPACK_CONFIG_VALIDATE = 'loose';
  const fullConfig: RspackOptions = {
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
          test: /\.jsx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                  jsx: true
                }
              }
            }
          },
          type: 'javascript/auto'
        },
        {
          test: /\.tsx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true
                }
              }
            }
          },
          type: 'javascript/auto'
        },
        {
          test: /\.[cm]?[jt]sx$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: reactCompilerLoader,
              options: loaderOptions
            }
          ]
        }]
    },
    optimization: { minimize: false },
    externals: externalModules,
    plugins: [],
    stats: {
      preset: 'verbose',
      all: true,
      modules: true,
      chunks: true
    },
    ...config
  };

  const compiler = rspack(fullConfig);
  const fs = createFsFromVolume(new Volume()) as unknown as typeof import('fs');

  compiler.outputFileSystem = fs;

  return [compiler, fs] as const;
};
