import babel from '@babel/core';
import BabelPluginReactCompiler from 'babel-plugin-react-compiler';

import type Webpack from 'webpack';
import type { PluginOptions as ReactCompilerConfig } from 'babel-plugin-react-compiler';

export interface ReactCompilerLoaderOption extends Partial<ReactCompilerConfig> {
  babelTransFormOpt?: babel.TransformOptions
}

const defaultBabelParsePlugins: NonNullable<NonNullable<babel.TransformOptions['parserOpts']>['plugins']> = ['jsx', 'typescript'];

export default async function reactCompilerLoader(this: Webpack.LoaderContext<ReactCompilerLoaderOption>, input: string, _inputSourceMap: any) {
  const callback = this.async();

  // TODO: is it possible to bail out early if the input doesn't contain a react component?
  try {
    const { babelTransFormOpt, ...reactCompilerConfig } = this.getOptions();

    const result = await babel.transformAsync(input, {
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
        // override babel parserOpts plugins and add jsx
        plugins: [
          ...(babelTransFormOpt?.parserOpts?.plugins || []),
          ...defaultBabelParsePlugins
        ]
      },
      ast: false,
      sourceMaps: true,
      configFile: false,
      babelrc: false
    });

    if (!result) {
      throw new TypeError('babel.transformAsync with react compiler plugin returns null');
    }

    const { code, map } = result;
    callback(null, code ?? undefined, map ?? undefined);
  } catch (e) {
    callback(e as Error);
  }
}
