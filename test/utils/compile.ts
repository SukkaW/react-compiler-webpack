import type { Compiler as RspackCompiler, Stats as RspackStats, MultiStats as RspackMultiStats } from '@rspack/core';
import type Webpack from 'webpack';

export default function compile(compiler: Webpack.Compiler | RspackCompiler): Promise<Webpack.Stats | RspackStats | RspackMultiStats> {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        return reject(error);
      }

      if (!stats) {
        return reject(new TypeError('stats from compiler is null'));
      }

      return resolve(stats);
    });
  });
}
