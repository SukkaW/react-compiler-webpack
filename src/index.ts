export const reactCompilerLoader = require.resolve('./react-compiler-loader');

export type { PluginOptions as ReactCompilerConfig } from 'babel-plugin-react-compiler';
export type { ReactCompilerLoaderOption } from './react-compiler-loader';

import type { ReactCompilerLoaderOption } from './react-compiler-loader';

export const defineReactCompilerLoaderOption = (options: ReactCompilerLoaderOption) => options;
