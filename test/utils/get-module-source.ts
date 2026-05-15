import type Webpack from 'webpack';
import type { Stats as RspackStats } from '@rspack/core';

export default function getModuleSource(id: string, stats: Webpack.Stats | RspackStats, fs: typeof import('fs')) {
  const jsonStat = stats.toJson({
    modules: true,
    source: true
  });

  const $module = jsonStat.modules?.find((m) => m.name?.endsWith(id));

  if (!$module) {
    throw new TypeError(`Module ${id} not found`);
  }

  if ('source' in $module) return $module.source;
  return fs.readFileSync('/main.bundle.js', { encoding: 'utf-8' });
}
