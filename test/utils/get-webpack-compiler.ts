import path from 'node:path';

import type Webpack from 'webpack';
import { webpack } from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

import type { ReactCompilerLoaderOption } from '../../src';

import pkgJson from '../../package.json';
import { builtinModules } from 'node:module';
import { useSwcLoader } from './get-swc-loader';

import { reactCompilerLoader } from '../../dist';

export const externalModules = Object.keys(pkgJson.dependencies)
  .concat(Object.keys(pkgJson.peerDependencies))
  .concat(builtinModules)
  .concat(['react', 'react/jsx-runtime', 'forgetti', 'forgetti/runtime', 'preact/hooks', 'preact/compat', 'preact']);
export default (fixture: string, loaderOptions?: ReactCompilerLoaderOption, config: Webpack.Configuration = {}) => {
  const fullConfig: Webpack.Configuration = {
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
              loader: reactCompilerLoader,
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
              loader: reactCompilerLoader,
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
