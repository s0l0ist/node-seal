# [node-seal](https://github.com/s0l0ist/node-seal) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/s0l0ist/node-seal/blob/main/LICENSE) [![codecov](https://codecov.io/gh/s0l0ist/node-seal/branch/main/graph/badge.svg)](https://codecov.io/gh/s0l0ist/node-seal) [![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_shield&issueType=license)

node-seal is a homomorphic encryption library for TypeScript or JavaScript.

- **Web Assembly:** Fastest web implementation of the C++ [Microsoft
  SEAL](https://github.com/microsoft/SEAL) library
- **Zero dependencies:** Very lean, only contains a low level API which is very
  close to the C++ calls from Microsoft SEAL.
- **Node.js, Browser:** Install once, work in any server/client configuration.

**Now supporting Microsoft SEAL 4.1.2**

## Installation

node-seal can be installed with your favorite package manager:

```shell
npm install node-seal
```

```shell
yarn add node-seal
```

Import the library using `import` or `require` syntax:

```javascript
// Auto-detects browser or nodejs.
// Defaults to "node-seal/throws_wasm_node_umd" for NodeJS
// Defaults to "node-seal/throws_wasm_web_umd" for Browsers
// Defaults to "node-seal/throws_wasm_web_es" for Modules
import SEAL from 'node-seal'
const SEAL = require('node-seal')
```

You may also specify a deep import to target your environment better. This is
useful for environments that aren't detected properly or do not support
WebAssembly. In addition, there are two separate bundles for throwing on
transparent ciphertexts and another for allowing transparent ciphertexts. If
you're unsure what you need, start with the build that **throws** on transparent
ciphertexts. This is also the default import that is used.

The deep import link is structured like the following:

`node-seal / <throws|allows>_wasm_<node|web|worker>_<umd|es>`

```javascript
// Always Pick a variant which throws on transparent ciphertexts unless you
// have a specific reason to allow the use of transparent ciphertexts.
import SEAL from 'node-seal/throws_wasm_node_umd'

// Or pick a variant which allows transparent ciphertexts (only use this if you know what you're doing)
import SEAL from 'node-seal/allows_wasm_node_umd'
```

#### React-Native

React-native does not support Wasm libraries; however, it is possible to run a
Wasm library, including `node-seal` by using a
[WebView](https://github.com/react-native-webview/react-native-webview#readme)
to load both the library and a simple interface to communicate with on top of
the built-in `postMessage` API. Instead of publicly hosting the web application
to be rendered by the WebView, it is possible to bundle the mini web application
into a single HTML file (with JS inlined) and load the HTML file directly to the
WebView.

#### Cloudflare Workers

The Wasm library needs to be explicitly imported, it will be compiled and
provided by the Cloudflare Workers runtime. Example:

```javascript
import SEAL from 'node-seal/throws_wasm_cf_worker_es'
import wasm from 'node-seal/seal_throws_wasm_cf_worker.wasm';

export default {
    async fetch(request) {
        const seal = await SEAL(wasm);
        return new Response(seal.Version);
    },
};
```

## Demo

Go to the [sandbox](https://s0l0ist.github.io/seal-sandbox/)

This sandbox was built for users to experiment and learn how to use Microsoft
SEAL featuring node-seal.

- **Encryption Parameters:** experiment with many settings to prototype a
  context.
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

Check out the [Sandbox](https://s0l0ist.github.io/seal-sandbox/) to run HE functions and even
generate working code!

If you'd rather read an example, take a look [here](FULL-EXAMPLE.md).

For more exhaustive examples, view the [tests](src/__tests__).

## Changes

For changes in this library, take a look [here](CHANGES.md).

For changes in Microsoft SEAL, take a look at their [list of
changes](https://github.com/microsoft/SEAL/blob/master/CHANGES.md).

## Benchmarking

Microsoft SEAL has a native benchmark tool that we compile directly to WASM.

1. `npm run seal:build:bench`
2. `npm run benchmark`

## Benchmark

Checkout the [benchmark](BENCHMARK.md)

## Caveats

Conversion from C++ to Web Assembly has some limitations:

- **±2^53 bit numbers:** JavaScript uses 2^53 numbers (not true 64 bit). This
  means we lose some precision after cryptographic operations are computed in
  WASM and we want to send the results to JS for consumption (across the WASM <>
  JS boundary). If you're using the `CKKS` scheme, you need to keep this in
  mind. `BFV` users will inherently adhere to these limitations due to the
  Int32Array/Uint32Array TypedArrays. Recently, `BFV` users now have support for
  BigInt64Array/BigUint64Array TypedArrays but at a significant encode/decode
  penalty - encyption/evaluation/decryption performance is the same.

- **Memory:** Generating large keys and saving them in the browser could be
  problematic. We can control NodeJS heap size, but not inside a user's browser.

  Saving keys is very memory intensive especially for `polyModulusDegrees`s
  above `16384`. This is because there's currently no way (that we have found)
  to use io streams across JS and Web Assembly code, so the strings have to be
  buffered completely in RAM and they can be very, very large when using the
  default `zstd` compression. User's who are experiencing OOM exceptions when
  saving `GaloisKeys` should try specifying a compression override such as
  `none` or the less performant `zlib`. Ex:
  `galoisKeys.save(seal.ComprModeType.zlib)`

- **Garbage Collection:** Unfortunately, the typical way of cleaning up
  dereferenced JS objects will leave behind a the Web Assembly (C++) object in
  memory. There is no way to automatically call the destructors on C++ objects.
  JavaScript code must explicitly delete any C++ object handles it has received,
  or the heap will grow indefinitely.

  ```javascript
  <instance>.delete()
  ```

## Contributing

The main purpose of this library is to continue to evolve and promote the
adoption of homomorphic encryption (using Microsoft SEAL) in modern web
applications today. Development of node-seal happens in the open on GitHub, and
we are grateful to the community for contributing bugfixes and improvements.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

node-seal is [MIT licensed](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_large&issueType=license)
