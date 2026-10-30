import type { Options as SwcOptions } from '@swc/core';

export type SwcSyntax = 'jsx' | 'tsx' | 'ts';

export function useSwcLoader(syntax: SwcSyntax, loader = 'swc-loader') {
  return {
    loader,
    options: {
      jsc: {
        parser: syntax === 'jsx'
          ? { syntax: 'ecmascript', jsx: true }
          : { syntax: 'typescript', tsx: syntax === 'tsx' },
        target: 'esnext',
        transform: {
          react: {
            runtime: 'automatic',
            refresh: false,
            development: false
          }
        }
      }
    } satisfies SwcOptions
  };
}
