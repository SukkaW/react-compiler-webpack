import type webpack from 'webpack';
import type { Stats as RspackStats, MultiStats as RspackMultiStats } from '@rspack/core';
export default function getModuleSource(id: string, stats: webpack.Stats | RspackStats | RspackMultiStats, fs: typeof import('fs')) {
  const jsonStat = stats.toJson({ source: true });
  const $module = jsonStat.modules?.find((m) => m.name?.endsWith(id));

  if (!$module) {
    throw new TypeError(`Module ${id} not found`);
  }

  if ('source' in $module) return $module.source;
  return fs.readFileSync('/main.bundle.js', { encoding: 'utf-8' });
}
