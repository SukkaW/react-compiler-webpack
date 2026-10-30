import type { InputOptions as BabelTransformOptions } from '@babel/core';

import BabelPluginReactCompiler from 'babel-plugin-react-compiler';

import type Webpack from 'webpack';
import type { PluginOptions as ReactCompilerConfig } from 'babel-plugin-react-compiler';

export interface ReactCompilerLoaderOption extends Partial<ReactCompilerConfig> {
  babelTransFormOpt?: BabelTransformOptions
}

type BabelParsePlugins = NonNullable<NonNullable<BabelTransformOptions['parserOpts']>['plugins']>;

const defaultBabelParsePlugins: BabelParsePlugins = ['jsx', 'typescript'];
// `<T>(v: T) => v` is read as a JSX element when the jsx plugin is on
const tsBabelParsePlugins: BabelParsePlugins = ['typescript'];
// .mts and .cts reserve that syntax even though they can not contain jsx
const mtsBabelParsePlugins: BabelParsePlugins = [['typescript', { disallowAmbiguousJSXLike: true }]];

const tsRe = /\.ts$/i;
const mtsRe = /\.[cm]ts$/i;

function getBabelParsePlugins(resourcePath: string): BabelParsePlugins {
  if (mtsRe.test(resourcePath)) {
    return mtsBabelParsePlugins;
  }
  if (tsRe.test(resourcePath)) {
    return tsBabelParsePlugins;
  }
  return defaultBabelParsePlugins;
}

export default async function reactCompilerLoader(this: Webpack.LoaderContext<ReactCompilerLoaderOption>, input: string, _inputSourceMap: any) {
  const callback = this.async();

  // TODO: is it possible to bail out early if the input doesn't contain a react component?
  try {
    const babelCore = await import('@babel/core');

    const { babelTransFormOpt, ...reactCompilerConfig } = this.getOptions();

    const result = await babelCore.transformAsync(input, {
      sourceFileName: this.resourcePath,
      filename: this.resourcePath,
      cloneInputAst: false,
      // user configured babel option
      ...babelTransFormOpt,
      // override babel plugins
      plugins: [
        [BabelPluginReactCompiler, reactCompilerConfig],
        ...(babelTransFormOpt?.plugins || [])
      ],
      // override babel parserOpts
      parserOpts: {
        ...babelTransFormOpt?.parserOpts,
        // override babel parserOpts plugins and add jsx, except in non-jsx ts
        plugins: [
          ...(babelTransFormOpt?.parserOpts?.plugins || []),
          ...getBabelParsePlugins(this.resourcePath)
        ]
      },
      ast: false,
      sourceMaps: 'both',
      configFile: false,
      babelrc: false
    });

    if (!result) {
      throw new TypeError('babel.transformAsync with react compiler plugin returns null');
    }

    const { code, map } = result;
    // @ts-expect-error -- babel v8 source map types conflict with webpack
    callback(null, code ?? undefined, map ?? undefined);
  } catch (e) {
    callback(e as Error);
  }
}
