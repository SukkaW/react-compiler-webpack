import type { Options as SwcOptions } from '@swc/core';

export function useSwcLoader(isTSX: boolean, loader = 'swc-loader') {
  return {
    loader,
    options: {
      jsc: {
        parser: {
          syntax: isTSX ? 'typescript' : 'ecmascript',
          ...(
            isTSX
              ? { tsx: true }
              : { jsx: true }
          )
        },
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
