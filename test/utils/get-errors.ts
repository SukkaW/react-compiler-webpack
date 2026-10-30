import type Webpack from 'webpack';
import type { Stats as RspackStats, MultiStats as RspackMultiStats } from '@rspack/core';

export default function getErrors(stats: Webpack.Stats | RspackStats | RspackMultiStats) {
  const jsonStat = stats.toJson({ errors: true });

  return (jsonStat.errors ?? []).map((error) => error.message);
}
