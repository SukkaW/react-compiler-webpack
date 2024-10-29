# React Compiler for webpack

A webpack loader, a [rspack](https://www.rspack.dev/) loader that brings [the official React Compiler](https://react.dev/learn/react-compiler) to your project.

## Installation

```bash
# npm
npm i -D react-compiler-webpack
# yarn
yarn add -D react-compiler-webpack
# pnpm
pnpm add -D react-compiler-webpack
```

## Usage

### webpack/rspack

```js
// webpack.config.js / rspack.config.js

// You can leverage your IDE's Intellisense (autocompletion, type check, etc.) with the helper function `defineReactCompilerLoaderOption`:
const { defineReactCompilerLoaderOption, reactCompilerLoader } = require('react-compiler-webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.[mc]?[jt]sx$/i,
        exclude: /node_modules/,
        use: [
          // babel-loader, swc-loader, esbuild-loader, or anything you like to transpile JSX should go here.
          // If you are using rspack, the rspack's buiilt-in react transformation is sufficient.
          // { loader: 'swc-loader' },
          // Now add forgetti-loader
          {
            loader: reactCompilerLoader,
            options: defineReactCompilerLoaderOption({
              // React Compiler options goes here
            })
          }
        ]
      }
    ]
  }
};
```

### Next.js

Next.js has already integrated the React Compiler and can be enabled with the following configuration:

```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: true // or React Compiler options
  }
}
```

Using Next.js built-in React Compiler integration is highly recommended. But if you insist on going with `react-compiler-webpack`, you can follow use the provided Next.js plugin:

```js
// next.config.js
const { withReactCompiler } = require('react-compiler-webpack');

module.exports = withReactCompiler({
  // React Compiler options goes here
})({
  // Next.js config goes here
});
```

## Author

**react-compiler-webpack** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/react-compiler-webpack/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Mastodon [@sukka@acg.mn](https://acg.mn/@sukka) · Keybase [@sukka](https://keybase.io/sukka)

<p align="center">
  <a href="https://github.com/sponsors/SukkaW/">
    <img src="https://sponsor.cdn.skk.moe/sponsors.svg"/>
  </a>
</p>
