# [node-seal](https://github.com/s0l0ist/node-seal)

[![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_shield&issueType=license)

Homomorphic encryption for TypeScript and JavaScript, using Microsoft SEAL
**4.7.2** and WebAssembly. Supports BFV and BGV for exact modular integer
arithmetic, and CKKS for approximate real arithmetic.

## Install

```sh
npm install node-seal
```

## Examples

- [Getting started](docs/getting-started.md): a complete program that computes
  on encrypted integers.
- [Advanced usage](docs/advanced.md): typed arrays, cleanup, workers, and Wasm
  deployment.

## Runtime

Initialize once and reuse the instance:

```javascript
import SEAL from 'node-seal'

const seal = await SEAL()
```

The package includes ES modules, Wasm binaries, and TypeScript declarations.
The runtime needs WebAssembly exception handling and BigInt typed arrays.
The examples use `using` for cleanup; see the
[advanced guide](docs/advanced.md#object-lifetime).

`node-seal` and `node-seal/throws` reject transparent ciphertext results.
Use `node-seal/allows` when your calculation needs those results, such as
subtracting a ciphertext from itself. Both variants expose the same API.

## Reference

- [Bindings](https://github.com/s0l0ist/SEAL/blob/main/native/src/seal/bindings.cpp)
  and [tests](src/__tests__) cover the available API.
- [Microsoft SEAL examples](https://github.com/microsoft/SEAL/tree/main/native/examples)
  explain the underlying library. Some C++ overloads are not available here.
- [Benchmarks](BENCHMARK.md), [contributing](CONTRIBUTING.md), and
  [release notes](CHANGES.md).

## License

[MIT](LICENSE).

[![FOSSA
Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_large&issueType=license)
