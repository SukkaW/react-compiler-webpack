import babel from '@babel/core';
import BabelPluginReactCompiler from 'babel-plugin-react-compiler';

import type webpack from 'webpack';
import type { ReactCompilerConfig } from './types';

export interface ReactCompilerLoaderOption extends ReactCompilerConfig {
  babelTransFormOpt?: babel.TransformOptions
}

const defaultBabelParsePlugins: NonNullable<NonNullable<babel.TransformOptions['parserOpts']>['plugins']> = ['jsx', 'typescript'];

export default async function reactCompilerLoader(this: webpack.LoaderContext<ReactCompilerLoaderOption>, input: string, _inputSourceMap: any) {
  const callback = this.async();

  // TODO: is it possible to bail out early if the input doesn't contain a react component?
  try {
    const { babelTransFormOpt, ...reactCompilerConfig } = this.getOptions();

    const result = await babel.transformAsync(input, {
      sourceFileName: this.resourcePath,
      filename: this.resourcePath,
      cloneInputAst: false,
      generatorOpts: {
        ...babelTransFormOpt?.generatorOpts,
        // https://github.com/facebook/react/issues/29120
        // TODO: remove once React Compiler has provided their workaround
        jsescOption: {
          minimal: true,
          ...babelTransFormOpt?.generatorOpts?.jsescOption
        }
      },
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
