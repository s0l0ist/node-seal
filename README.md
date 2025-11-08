# [node-seal](https://github.com/s0l0ist/node-seal) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/s0l0ist/node-seal/blob/main/LICENSE) [![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_shield&issueType=license)

**node-seal** is an ESM-first, WebAssembly-powered wrapper around the C++
[Microsoft SEAL](https://github.com/microsoft/SEAL) homomorphic encryption
library, for TypeScript and JavaScript.

> **v7.0.0 is a breaking release.** The custom JS wrapper layer was removed —
> the package now exposes the Emscripten-generated bindings directly. That makes
> the package ~96% smaller and faster, but it also means some imports and helper
> methods changed.

- **WebAssembly:** Fast, direct bindings to Microsoft SEAL
- **ESM-first:** Modern module layout, no bundling
- **Node.js + browser + edge (CF Workers):** Load the WASM separately and run
  wherever WASM is allowed
- **Low-level, close to C++:** Method names and types now map much more directly
  to SEAL

**Currently aligned with Microsoft SEAL 4.1.2.**

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What Changed in v7](#what-changed-in-v7)
- [Environment Notes](#environment-notes)
  - [React Native](#react-native)
- [Demo / Sandbox](#demo--sandbox)
- [Usage / Docs / Examples](#usage--docs--examples)
- [Benchmarking](#benchmarking)
- [Caveats](#caveats)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install from npm:

```sh
npm install node-seal
# or
yarn add node-seal
# or
pnpm add node-seal
```

Because v7 is ESM-first and ships the `.wasm` separately, most modern bundlers
will just work.

## Quick Start

In v7, the default import gives you a factory; call it to get the SEAL runtime:

```ts
import SEAL from 'node-seal'

const seal = await SEAL()
```

Variants:

```ts
// recommended and default: throws on transparent ciphertexts
import SEAL from 'node-seal/throws'
const seal = await SEAL()

// allow transparent ciphertexts (only if you know you need this)
import SEAL from 'node-seal/allows'
const seal = await SEAL()
```

## What Changed in v7?

See [here](CHANGES.md).

## Environment Notes

### React Native

React Native still can't run WASM like a browser. Use a small HTML/JS app inside
a WebView, load `node-seal` there, and talk over `postMessage`. Because v7 ships
a plain `.wasm`, bundling that web app is easier.

## Demo

Go to the [sandbox](https://s0l0ist.github.io/seal-sandbox/)

This sandbox was built for users to experiment and learn how to use Microsoft
SEAL featuring node-seal.

- **Encryption Parameters:** experiment with many settings to prototype a
  SEALContext.
- **Keys:** Create, download, upload Secret/Public Keys - even for
  Relinearization and Galois Keys.
- **Variables:** Create, download, upload PlainTexts or CipherTexts
- **Functions:** Create a list of HE functions to execute!
- **Code Generation:** After your experimentation is complete, generate working
  code to use!

## Usage

Checkout the [basics](USAGE.md)

## Documentation

View the latest docs [here](https://s0l0ist.github.io/node-seal)

## Examples

Check out the [Sandbox](https://s0l0ist.github.io/seal-sandbox/) to run HE
functions and even generate working code!

If you'd rather read an example, take a look [here](FULL-EXAMPLE.md).

For more exhaustive examples, view the [tests](src/__tests__).

## Changes

For changes in this library, take a look [here](CHANGES.md).

For changes in Microsoft SEAL, take a look at their [list of
changes](https://github.com/microsoft/SEAL/blob/master/CHANGES.md).

## Benchmarking

```sh
npm run seal:build:bench
npm run benchmark
```

See also: `BENCHMARK.md`.

## Caveats

- **Memory**: saving large keys in the browser is expensive; try a different
  compression mode if you get OOMs.
- **Manual cleanup**: call `.delete()` or `.deleteLater()` on created objects to
  free C++ resources.

## Contributing

See `CONTRIBUTING.md`.

## License

node-seal is [MIT licensed](LICENSE).

[![FOSSA
Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_large&issueType=license)
