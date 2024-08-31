export interface ReactCompilerConfig {
  environment?: any,

  /*
   * Specifying a `gating` config, makes Forget compile and emit a separate
   * version of the function gated by importing the `gating.importSpecifierName` from the
   * specified `gating.source`.
   *
   * For example:
   *   gating: {
   *     source: 'ReactForgetFeatureFlag',
   *     importSpecifierName: 'isForgetEnabled_Pokes',
   *   }
   *
   * produces:
   *   import {isForgetEnabled_Pokes} from 'ReactForgetFeatureFlag';
   *
   *   Foo_forget()   {}
   *
   *   Foo_uncompiled() {}
   *
   *   var Foo = isForgetEnabled_Pokes() ? Foo_forget : Foo_uncompiled;
   */
  gating?: any,

  panicThreshold?: 'all_errors' | 'critical_errors' | 'none',

  /*
   * When enabled, Forget will continue statically analyzing and linting code, but skip over codegen
   * passes.
   *
   * Defaults to false
   */
  noEmit?: boolean,

  /*
   * Determines the strategy for determining which functions to compile. Note that regardless of
   * which mode is enabled, a component can be opted out by adding the string literal
   * `"use no forget"` at the top of the function body, eg.:
   *
   * ```
   * function ComponentYouWantToSkipCompilation(props) {
   *    "use no forget";
   *    ...
   * }
   * ```
   *
   * Compiles functions annotated with "use forget" or component/hook-like functions.
   * This latter includes:
   * * Components declared with component syntax.
   * * Functions which can be inferred to be a component or hook:
   *   - Be named like a hook or component. This logic matches the ESLint rule.
   *   - *and* create JSX and/or call a hook. This is an additional check to help prevent
   *     false positives, since compilation has a greater impact than linting.
   * This is the default mode
   */
  compilationMode?: 'infer' | 'annotation' | 'all',

  /*
   * If enabled, Forget will import `useMemoCache` from the given module
   * instead of `react/compiler-runtime`.
   *
   * ```
   * // If set to "react-compiler-runtime"
   * import {c as useMemoCache} from 'react-compiler-runtime';
   * ```
   */
  runtimeModule?: string | null | undefined,

  /**
   * By default React Compiler will skip compilation of code that suppresses the default
   * React ESLint rules, since this is a strong indication that the code may be breaking React rules
   * in some way.
   *
   * Use eslintSuppressionRules to pass a custom set of rule names: any code which suppresses the
   * provided rules will skip compilation. To disable this feature (never bailout of compilation
   * even if the default ESLint is suppressed), pass an empty array.
   */
  eslintSuppressionRules?: string[] | null | undefined,

  flowSuppressions?: boolean,
  /*
   * Ignore 'use no forget' annotations. Helpful during testing but should not be used in production.
   */
  ignoreUseNoForget?: boolean,

  sources?: string[] | ((filename: string) => boolean) | null
};
