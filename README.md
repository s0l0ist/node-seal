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

React-native does not support WASM libraries; however, it is possible to run a
WASM library, including `node-seal` by using a
[WebView](https://github.com/react-native-webview/react-native-webview#readme)
to load both the library and a simple interface to communicate with on top of
the built-in `postMessage` API. Instead of publicly hosting the web application
to be rendered by the WebView, it is possible to bundle the mini web application
into a single HTML file (with JS inlined) and load the HTML file directly to the
WebView.

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

## Performance

Microsoft SEAL now comes with a benchmark binary that can be directly compiled
to WASM. All numbers are measured in `us` and are ran on an arm64 system

Test specs:

- MacBook Pro (14-inch, 2021)
- MacOS Ventura 13.1 (22C65)
- Apple M1 Pro (8 performance and 2 efficiency), 32 GB

Versions:

- Microsoft SEAL v4.1.0
- Node-seal v5.1.0
- NodeJS v18.12.1
- Chrome Version 108.0.5359.124 (Official Build) (arm64)
- Firefox Version 108.0.1 (64-bit)
- Safari Version 16.2 (18614.3.7.1.5)

|                                                                      | Native (No HEXL) | Node   | Chrome  | Firefox | Safari |
| -------------------------------------------------------------------- | ---------------- | ------ | ------- | ------- | ------ |
| n=1024 / log(q)=27 / KeyGen / Secret/iterations:10                   | 66.7             | 143    | 460     | 100.0   | 100.0  |
| n=1024 / log(q)=27 / KeyGen / Public/iterations:10                   | 92.7             | 187    | 1010    | 0.000   | 100    |
| n=1024 / log(q)=27 / BFV / EncryptSecret/iterations:10               | 106              | 360    | 1210    | 300     | 600    |
| n=1024 / log(q)=27 / BFV / EncryptPublic/iterations:10               | 148              | 412    | 1310    | 400     | 500    |
| n=1024 / log(q)=27 / BFV / Decrypt/iterations:10                     | 30.6             | 148    | 160     | 200     | 300    |
| n=1024 / log(q)=27 / BFV / EncodeBatch/iterations:10                 | 6.17             | 20.5   | 20.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BFV / DecodeBatch/iterations:10                 | 8.87             | 24.3   | 40.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BFV / EvaluateAddCt/iterations:10               | 3.42             | 13.8   | 10.0    | 0.000   | 200    |
| n=1024 / log(q)=27 / BFV / EvaluateAddPt/iterations:10               | 9.21             | 160    | 180     | 100.0   | 100.0  |
| n=1024 / log(q)=27 / BFV / EvaluateNegate/iterations:10              | 2.22             | 2.20   | 10.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BFV / EvaluateSubCt/iterations:10               | 2.63             | 12.5   | 0.000   | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BFV / EvaluateSubPt/iterations:10               | 7.20             | 169    | 210     | 200     | 100    |
| n=1024 / log(q)=27 / BFV / EvaluateMulCt/iterations:10               | 274              | 975    | 1740    | 900     | 1400   |
| n=1024 / log(q)=27 / BFV / EvaluateMulPt/iterations:10               | 35.0             | 117    | 180     | 100.0   | 200    |
| n=1024 / log(q)=27 / BFV / EvaluateSquare/iterations:10              | 209              | 752    | 1300    | 600     | 900    |
| n=1024 / log(q)=27 / BGV / EncryptSecret/iterations:10               | 109              | 213    | 1020    | 100.0   | 100    |
| n=1024 / log(q)=27 / BGV / EncryptPublic/iterations:10               | 151              | 282    | 1150    | 200     | 200    |
| n=1024 / log(q)=27 / BGV / Decrypt/iterations:10                     | 16.3             | 64.1   | 110     | 0.000   | 200    |
| n=1024 / log(q)=27 / BGV / EncodeBatch/iterations:10                 | 6.01             | 19.3   | 30.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / DecodeBatch/iterations:10                 | 8.59             | 23.9   | 40.0    | 0.000   | 100    |
| n=1024 / log(q)=27 / BGV / EvaluateNegate/iterations:10              | 2.51             | 3.05   | 0.000   | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateNegateInplace/iterations:10       | 1.80             | 1.84   | 0.000   | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateAddCt/iterations:10               | 3.10             | 8.35   | 0.000   | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateAddCtInplace/iterations:10        | 2.56             | 12.5   | 10.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateAddPt/iterations:10               | 13.6             | 40.0   | 50.0    | 0.000   | 100    |
| n=1024 / log(q)=27 / BGV / EvaluateAddPtInplace/iterations:10        | 13.1             | 38.1   | 50.0    | 0.000   | 100.0  |
| n=1024 / log(q)=27 / BGV / EvaluateMulCt/iterations:10               | 10.2             | 37.6   | 50.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateMulCtInplace/iterations:10        | 8.95             | 36.8   | 40.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateMulPt/iterations:10               | 16.0             | 46.9   | 50.0    | 0.000   | 100    |
| n=1024 / log(q)=27 / BGV / EvaluateMulPtInplace/iterations:10        | 15.7             | 45.8   | 80.0    | 0.000   | 100.0  |
| n=1024 / log(q)=27 / BGV / EvaluateSquare/iterations:10              | 7.55             | 28.3   | 50.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateSquareInplace/iterations:10       | 7.15             | 27.0   | 30.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateToNTTInplace/iterations:10        | 14.0             | 45.1   | 50.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / BGV / EvaluateFromNTTInplace/iterations:10      | 10.7             | 37.9   | 50.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EncryptSecret/iterations:10              | 95.8             | 192    | 1010    | 100     | 100.0  |
| n=1024 / log(q)=27 / CKKS / EncryptPublic/iterations:10              | 144              | 260    | 1170    | 200     | 200    |
| n=1024 / log(q)=27 / CKKS / Decrypt/iterations:10                    | 4.74             | 12.6   | 30.0    | 0.000   | 100.0  |
| n=1024 / log(q)=27 / CKKS / EncodeDouble/iterations:10               | 23.2             | 65.4   | 70.0    | 100     | 400    |
| n=1024 / log(q)=27 / CKKS / DecodeDouble/iterations:10               | 19.9             | 49.0   | 70.0    | 0.000   | 300    |
| n=1024 / log(q)=27 / CKKS / EvaluateAddCt/iterations:10              | 3.34             | 8.84   | 10.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EvaluateAddPt/iterations:10              | 2.38             | 4.41   | 10.00   | 0.000   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EvaluateNegate/iterations:10             | 2.31             | 1.55   | 10.00   | 0.000   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EvaluateSubCt/iterations:10              | 2.76             | 9.54   | 10.00   | 0.000   | 100.0  |
| n=1024 / log(q)=27 / CKKS / EvaluateSubPt/iterations:10              | 2.22             | 4.52   | 0.000   | 100.0   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EvaluateMulCt/iterations:10              | 9.50             | 42.7   | 20.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EvaluateMulPt/iterations:10              | 5.15             | 16.2   | 20.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / CKKS / EvaluateSquare/iterations:10             | 7.60             | 27.5   | 30.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / UTIL / NTTForward/iterations:10                 | 14.7             | 46.2   | 70.0    | 0.000   | 0.000  |
| n=1024 / log(q)=27 / UTIL / NTTInverse/iterations:10                 | 11.0             | 37.1   | 80.0    | 100.0   | 0.000  |
| n=1024 / log(q)=0 / UTIL / NTTForwardLowLevel/iterations:10          | 8.75             | 22.2   | 30.0    | 0.000   | 100    |
| n=1024 / log(q)=0 / UTIL / NTTInverseLowLevel/iterations:10          | 5.68             | 18.3   | 40.0    | 0.000   | 0.000  |
| n=1024 / log(q)=0 / UTIL / NTTForwardLowLevelLazy/iterations:10      | 5.07             | 18.0   | 10.00   | 0.000   | 0.000  |
| n=1024 / log(q)=0 / UTIL / NTTInverseLowLevelLazy/iterations:10      | 5.24             | 17.9   | 30.0    | 100.0   | 100.0  |
| n=2048 / log(q)=54 / KeyGen / Secret/iterations:10                   | 105              | 182    | 710     | 100     | 100.0  |
| n=2048 / log(q)=54 / KeyGen / Public/iterations:10                   | 150              | 302    | 1750    | 200     | 200    |
| n=2048 / log(q)=54 / BFV / EncryptSecret/iterations:10               | 170              | 637    | 2310    | 600     | 600    |
| n=2048 / log(q)=54 / BFV / EncryptPublic/iterations:10               | 258              | 778    | 2470    | 800     | 800    |
| n=2048 / log(q)=54 / BFV / Decrypt/iterations:10                     | 53.7             | 192    | 320     | 200     | 300    |
| n=2048 / log(q)=54 / BFV / EncodeBatch/iterations:10                 | 11.7             | 43.5   | 60.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BFV / DecodeBatch/iterations:10                 | 17.1             | 53.2   | 80.0    | 100.0   | 100    |
| n=2048 / log(q)=54 / BFV / EvaluateAddCt/iterations:10               | 5.70             | 16.7   | 10.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BFV / EvaluateAddPt/iterations:10               | 13.9             | 336    | 430     | 400     | 300    |
| n=2048 / log(q)=54 / BFV / EvaluateNegate/iterations:10              | 3.41             | 2.35   | 0.000   | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BFV / EvaluateSubCt/iterations:10               | 4.88             | 18.1   | 10.00   | 0.000   | 100    |
| n=2048 / log(q)=54 / BFV / EvaluateSubPt/iterations:10               | 13.6             | 335    | 440     | 400     | 500    |
| n=2048 / log(q)=54 / BFV / EvaluateMulCt/iterations:10               | 578              | 1945   | 3480    | 1700    | 1500   |
| n=2048 / log(q)=54 / BFV / EvaluateMulPt/iterations:10               | 72.4             | 269    | 370     | 200     | 200    |
| n=2048 / log(q)=54 / BFV / EvaluateSquare/iterations:10              | 427              | 1457   | 2530    | 1200    | 1300   |
| n=2048 / log(q)=54 / BGV / EncryptSecret/iterations:10               | 183              | 340    | 1830    | 300     | 300    |
| n=2048 / log(q)=54 / BGV / EncryptPublic/iterations:10               | 280              | 507    | 2170    | 300     | 400    |
| n=2048 / log(q)=54 / BGV / Decrypt/iterations:10                     | 31.7             | 123    | 190     | 300     | 100    |
| n=2048 / log(q)=54 / BGV / EncodeBatch/iterations:10                 | 11.9             | 40.5   | 60.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BGV / DecodeBatch/iterations:10                 | 17.1             | 50.7   | 60.0    | 0.000   | 100.0  |
| n=2048 / log(q)=54 / BGV / EvaluateNegate/iterations:10              | 3.78             | 3.06   | 10.00   | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateNegateInplace/iterations:10       | 2.73             | 1.69   | 0.000   | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateAddCt/iterations:10               | 5.56             | 16.8   | 40.0    | 100     | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateAddCtInplace/iterations:10        | 4.24             | 17.7   | 50.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateAddPt/iterations:10               | 27.8             | 69.1   | 140     | 0.000   | 100.0  |
| n=2048 / log(q)=54 / BGV / EvaluateAddPtInplace/iterations:10        | 26.2             | 73.2   | 100     | 100.0   | 100.0  |
| n=2048 / log(q)=54 / BGV / EvaluateMulCt/iterations:10               | 17.1             | 73.2   | 90.0    | 100     | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateMulCtInplace/iterations:10        | 16.2             | 75.8   | 100.0   | 100.0   | 100    |
| n=2048 / log(q)=54 / BGV / EvaluateMulPt/iterations:10               | 30.6             | 92.8   | 110     | 0.000   | 200    |
| n=2048 / log(q)=54 / BGV / EvaluateMulPtInplace/iterations:10        | 29.7             | 88.2   | 110     | 100     | 100    |
| n=2048 / log(q)=54 / BGV / EvaluateSquare/iterations:10              | 13.8             | 57.3   | 60.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateSquareInplace/iterations:10       | 12.6             | 57.3   | 50.0    | 100.0   | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateToNTTInplace/iterations:10        | 27.3             | 96.2   | 130     | 100     | 0.000  |
| n=2048 / log(q)=54 / BGV / EvaluateFromNTTInplace/iterations:10      | 20.8             | 79.2   | 130     | 100.0   | 100.0  |
| n=2048 / log(q)=54 / CKKS / EncryptSecret/iterations:10              | 152              | 286    | 1740    | 200     | 200    |
| n=2048 / log(q)=54 / CKKS / EncryptPublic/iterations:10              | 271              | 465    | 2080    | 300     | 300    |
| n=2048 / log(q)=54 / CKKS / Decrypt/iterations:10                    | 8.37             | 24.3   | 40.0    | 100.0   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EncodeDouble/iterations:10               | 47.7             | 100    | 150     | 100     | 200    |
| n=2048 / log(q)=54 / CKKS / DecodeDouble/iterations:10               | 40.5             | 71.1   | 120     | 100.0   | 200    |
| n=2048 / log(q)=54 / CKKS / EvaluateAddCt/iterations:10              | 5.27             | 16.3   | 20.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EvaluateAddPt/iterations:10              | 3.64             | 8.16   | 0.000   | 0.000   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EvaluateNegate/iterations:10             | 3.08             | 2.31   | 0.000   | 0.000   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EvaluateSubCt/iterations:10              | 4.68             | 18.8   | 20.0    | 0.000   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EvaluateSubPt/iterations:10              | 3.58             | 8.16   | 10.00   | 0.000   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EvaluateMulCt/iterations:10              | 17.7             | 77.3   | 80.0    | 100.0   | 100.0  |
| n=2048 / log(q)=54 / CKKS / EvaluateMulPt/iterations:10              | 9.40             | 32.5   | 50.0    | 100.0   | 0.000  |
| n=2048 / log(q)=54 / CKKS / EvaluateSquare/iterations:10             | 13.5             | 53.7   | 60.0    | 100     | 0.000  |
| n=2048 / log(q)=54 / UTIL / NTTForward/iterations:10                 | 29.6             | 97.1   | 150     | 100.0   | 0.000  |
| n=2048 / log(q)=54 / UTIL / NTTInverse/iterations:10                 | 22.5             | 83.9   | 120     | 0.000   | 100.0  |
| n=2048 / log(q)=0 / UTIL / NTTForwardLowLevel/iterations:10          | 15.3             | 49.5   | 70.0    | 100     | 0.000  |
| n=2048 / log(q)=0 / UTIL / NTTInverseLowLevel/iterations:10          | 11.8             | 39.5   | 70.0    | 100.0   | 100.0  |
| n=2048 / log(q)=0 / UTIL / NTTForwardLowLevelLazy/iterations:10      | 10.0             | 39.6   | 60.0    | 0.000   | 0.000  |
| n=2048 / log(q)=0 / UTIL / NTTInverseLowLevelLazy/iterations:10      | 10.8             | 38.7   | 70.0    | 0.000   | 100.0  |
| n=4096 / log(q)=109 / KeyGen / Secret/iterations:10                  | 268              | 534    | 1720    | 300     | 400    |
| n=4096 / log(q)=109 / KeyGen / Public/iterations:10                  | 545              | 1076   | 6400    | 700     | 800    |
| n=4096 / log(q)=109 / KeyGen / Relin/iterations:10                   | 1102             | 2073   | 12790   | 1500    | 1600   |
| n=4096 / log(q)=109 / KeyGen / Galois/iterations:10                  | 1078             | 2150   | 12820   | 1600    | 1600   |
| n=4096 / log(q)=109 / BFV / EncryptSecret/iterations:10              | 477              | 1619   | 5900    | 1500    | 1400   |
| n=4096 / log(q)=109 / BFV / EncryptPublic/iterations:10              | 778              | 2444   | 6200    | 2000    | 2200   |
| n=4096 / log(q)=109 / BFV / Decrypt/iterations:10                    | 178              | 630    | 1070    | 500     | 500    |
| n=4096 / log(q)=109 / BFV / EncodeBatch/iterations:10                | 24.3             | 86.4   | 150     | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BFV / DecodeBatch/iterations:10                | 33.5             | 106    | 160     | 100     | 100    |
| n=4096 / log(q)=109 / BFV / EvaluateAddCt/iterations:10              | 16.1             | 66.1   | 80.0    | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BFV / EvaluateAddPt/iterations:10              | 39.2             | 702    | 890     | 700     | 600    |
| n=4096 / log(q)=109 / BFV / EvaluateNegate/iterations:10             | 11.2             | 8.47   | 0.000   | 100.0   | 0.000  |
| n=4096 / log(q)=109 / BFV / EvaluateSubCt/iterations:10              | 12.1             | 69.9   | 70.0    | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BFV / EvaluateSubPt/iterations:10              | 37.0             | 698    | 900     | 800     | 800    |
| n=4096 / log(q)=109 / BFV / EvaluateMulCt/iterations:10              | 1842             | 6841   | 11430   | 5800    | 5100   |
| n=4096 / log(q)=109 / BFV / EvaluateMulPt/iterations:10              | 280              | 1015   | 1480    | 700     | 600    |
| n=4096 / log(q)=109 / BFV / EvaluateSquare/iterations:10             | 1359             | 4941   | 8390    | 4200    | 4500   |
| n=4096 / log(q)=109 / BFV / EvaluateModSwitchInplace/iterations:10   | 26.9             | 117    | 190     | 0.000   | 100    |
| n=4096 / log(q)=109 / BFV / EvaluateRelinInplace/iterations:10       | 389              | 1518   | 2060    | 1100    | 2100   |
| n=4096 / log(q)=109 / BFV / EvaluateRotateRows/iterations:10         | 397              | 1385   | 2060    | 1300    | 1400   |
| n=4096 / log(q)=109 / BFV / EvaluateRotateCols/iterations:10         | 399              | 1396   | 2090    | 1200    | 1100   |
| n=4096 / log(q)=109 / BGV / EncryptSecret/iterations:10              | 506              | 1017   | 5150    | 800     | 700    |
| n=4096 / log(q)=109 / BGV / EncryptPublic/iterations:10              | 1009             | 2796   | 6810    | 1800    | 2200   |
| n=4096 / log(q)=109 / BGV / Decrypt/iterations:10                    | 104              | 400    | 660     | 300     | 200    |
| n=4096 / log(q)=109 / BGV / EncodeBatch/iterations:10                | 25.0             | 86.3   | 140     | 100     | 0.000  |
| n=4096 / log(q)=109 / BGV / DecodeBatch/iterations:10                | 33.8             | 106    | 140     | 200     | 100.0  |
| n=4096 / log(q)=109 / BGV / EvaluateNegate/iterations:10             | 10.6             | 12.0   | 20.0    | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BGV / EvaluateNegateInplace/iterations:10      | 9.21             | 5.94   | 0.000   | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BGV / EvaluateAddCt/iterations:10              | 14.9             | 76.9   | 100     | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BGV / EvaluateAddCtInplace/iterations:10       | 11.1             | 69.0   | 110     | 0.000   | 0.000  |
| n=4096 / log(q)=109 / BGV / EvaluateAddPt/iterations:10              | 92.0             | 263    | 390     | 200     | 200    |
| n=4096 / log(q)=109 / BGV / EvaluateAddPtInplace/iterations:10       | 89.6             | 260    | 340     | 200     | 300    |
| n=4096 / log(q)=109 / BGV / EvaluateMulCt/iterations:10              | 63.6             | 271    | 310     | 300     | 0.000  |
| n=4096 / log(q)=109 / BGV / EvaluateMulCtInplace/iterations:10       | 62.6             | 268    | 330     | 300     | 500    |
| n=4096 / log(q)=109 / BGV / EvaluateMulPt/iterations:10              | 120              | 347    | 470     | 100.0   | 300    |
| n=4096 / log(q)=109 / BGV / EvaluateMulPtInplace/iterations:10       | 115              | 351    | 440     | 300     | 300    |
| n=4096 / log(q)=109 / BGV / EvaluateSquare/iterations:10             | 53.5             | 216    | 270     | 200     | 200    |
| n=4096 / log(q)=109 / BGV / EvaluateSquareInplace/iterations:10      | 52.3             | 216    | 250     | 200     | 200    |
| n=4096 / log(q)=109 / BGV / EvaluateModSwitchInplace/iterations:10   | 141              | 551    | 840     | 500     | 300    |
| n=4096 / log(q)=109 / BGV / EvaluateRelinInplace/iterations:10       | 465              | 1625   | 2410    | 1200    | 1200   |
| n=4096 / log(q)=109 / BGV / EvaluateRotateRows/iterations:10         | 437              | 1620   | 2370    | 1300    | 1100   |
| n=4096 / log(q)=109 / BGV / EvaluateRotateRowsInplace/iterations:10  | 446              | 1601   | 2470    | 1200    | 1000   |
| n=4096 / log(q)=109 / BGV / EvaluateRotateCols/iterations:10         | 463              | 1613   | 2410    | 1300    | 1100   |
| n=4096 / log(q)=109 / BGV / EvaluateRotateColsInplace/iterations:10  | 452              | 1607   | 2410    | 1200    | 1200   |
| n=4096 / log(q)=109 / BGV / EvaluateToNTTInplace/iterations:10       | 111              | 398    | 620     | 200     | 200    |
| n=4096 / log(q)=109 / BGV / EvaluateFromNTTInplace/iterations:10     | 85.7             | 336    | 510     | 200     | 200    |
| n=4096 / log(q)=109 / CKKS / EncryptSecret/iterations:10             | 425              | 807    | 4810    | 700     | 600    |
| n=4096 / log(q)=109 / CKKS / EncryptPublic/iterations:10             | 903              | 2329   | 6290    | 1800    | 1700   |
| n=4096 / log(q)=109 / CKKS / Decrypt/iterations:10                   | 26.0             | 94.3   | 130     | 0.000   | 200    |
| n=4096 / log(q)=109 / CKKS / EncodeDouble/iterations:10              | 129              | 311    | 470     | 300     | 200    |
| n=4096 / log(q)=109 / CKKS / DecodeDouble/iterations:10              | 200              | 417    | 640     | 400     | 600    |
| n=4096 / log(q)=109 / CKKS / EvaluateAddCt/iterations:10             | 14.7             | 63.7   | 90.0    | 0.000   | 0.000  |
| n=4096 / log(q)=109 / CKKS / EvaluateAddPt/iterations:10             | 8.32             | 31.7   | 50.0    | 0.000   | 0.000  |
| n=4096 / log(q)=109 / CKKS / EvaluateNegate/iterations:10            | 9.91             | 8.48   | 0.000   | 0.000   | 0.000  |
| n=4096 / log(q)=109 / CKKS / EvaluateSubCt/iterations:10             | 12.6             | 68.6   | 100     | 0.000   | 0.000  |
| n=4096 / log(q)=109 / CKKS / EvaluateSubPt/iterations:10             | 7.72             | 29.9   | 40.0    | 0.000   | 0.000  |
| n=4096 / log(q)=109 / CKKS / EvaluateMulCt/iterations:10             | 66.3             | 272    | 320     | 300     | 300    |
| n=4096 / log(q)=109 / CKKS / EvaluateMulPt/iterations:10             | 33.7             | 122    | 140     | 0.000   | 100    |
| n=4096 / log(q)=109 / CKKS / EvaluateSquare/iterations:10            | 52.1             | 210    | 250     | 200     | 200    |
| n=4096 / log(q)=109 / CKKS / EvaluateRescaleInplace/iterations:10    | 101              | 386    | 590     | 300     | 300    |
| n=4096 / log(q)=109 / CKKS / EvaluateRelinInplace/iterations:10      | 386              | 1403   | 2160    | 1200    | 1000   |
| n=4096 / log(q)=109 / CKKS / EvaluateRotate/iterations:10            | 386              | 1373   | 2060    | 1000    | 1000   |
| n=4096 / log(q)=109 / UTIL / NTTForward/iterations:10                | 117              | 398    | 560     | 300     | 200    |
| n=4096 / log(q)=109 / UTIL / NTTInverse/iterations:10                | 90.9             | 342    | 470     | 300     | 200    |
| n=4096 / log(q)=0 / UTIL / NTTForwardLowLevel/iterations:10          | 32.5             | 98.7   | 130     | 100.0   | 0.000  |
| n=4096 / log(q)=0 / UTIL / NTTInverseLowLevel/iterations:10          | 23.4             | 85.2   | 110     | 200     | 100    |
| n=4096 / log(q)=0 / UTIL / NTTForwardLowLevelLazy/iterations:10      | 19.9             | 83.7   | 150     | 100.0   | 100.0  |
| n=4096 / log(q)=0 / UTIL / NTTInverseLowLevelLazy/iterations:10      | 24.2             | 82.9   | 150     | 0.000   | 100    |
| n=8192 / log(q)=218 / KeyGen / Secret/iterations:10                  | 661              | 1453   | 4000    | 1000    | 1000   |
| n=8192 / log(q)=218 / KeyGen / Public/iterations:10                  | 1528             | 2867   | 18720   | 2300    | 2400   |
| n=8192 / log(q)=218 / KeyGen / Relin/iterations:10                   | 6168             | 11488  | 75050   | 9400    | 9700   |
| n=8192 / log(q)=218 / KeyGen / Galois/iterations:10                  | 6159             | 11566  | 75850   | 9400    | 9700   |
| n=8192 / log(q)=218 / BFV / EncryptSecret/iterations:10              | 1524             | 4493   | 18670   | 4100    | 4000   |
| n=8192 / log(q)=218 / BFV / EncryptPublic/iterations:10              | 2062             | 6914   | 15360   | 5600    | 5000   |
| n=8192 / log(q)=218 / BFV / Decrypt/iterations:10                    | 648              | 2380   | 3980    | 1900    | 1800   |
| n=8192 / log(q)=218 / BFV / EncodeBatch/iterations:10                | 52.2             | 186    | 270     | 200     | 100.0  |
| n=8192 / log(q)=218 / BFV / DecodeBatch/iterations:10                | 68.8             | 229    | 330     | 200     | 200    |
| n=8192 / log(q)=218 / BFV / EvaluateAddCt/iterations:10              | 60.8             | 268    | 400     | 0.000   | 0.000  |
| n=8192 / log(q)=218 / BFV / EvaluateAddPt/iterations:10              | 110              | 1631   | 2180    | 1600    | 2000   |
| n=8192 / log(q)=218 / BFV / EvaluateNegate/iterations:10             | 41.5             | 33.5   | 70.0    | 0.000   | 0.000  |
| n=8192 / log(q)=218 / BFV / EvaluateSubCt/iterations:10              | 45.7             | 277    | 370     | 0.000   | 200    |
| n=8192 / log(q)=218 / BFV / EvaluateSubPt/iterations:10              | 103              | 1650   | 2180    | 2000    | 1000   |
| n=8192 / log(q)=218 / BFV / EvaluateMulCt/iterations:10              | 6827             | 26875  | 50570   | 23300   | 19700  |
| n=8192 / log(q)=218 / BFV / EvaluateMulPt/iterations:10              | 1186             | 4344   | 6310    | 3300    | 2900   |
| n=8192 / log(q)=218 / BFV / EvaluateSquare/iterations:10             | 5021             | 19686  | 39450   | 17300   | 16300  |
| n=8192 / log(q)=218 / BFV / EvaluateModSwitchInplace/iterations:10   | 136              | 480    | 790     | 0.000   | 200    |
| n=8192 / log(q)=218 / BFV / EvaluateRelinInplace/iterations:10       | 1920             | 7149   | 10890   | 5700    | 4600   |
| n=8192 / log(q)=218 / BFV / EvaluateRotateRows/iterations:10         | 1995             | 7061   | 10620   | 5800    | 5000   |
| n=8192 / log(q)=218 / BFV / EvaluateRotateCols/iterations:10         | 1973             | 7064   | 10630   | 5900    | 4900   |
| n=8192 / log(q)=218 / BGV / EncryptSecret/iterations:10              | 1664             | 3410   | 17050   | 2600    | 2600   |
| n=8192 / log(q)=218 / BGV / EncryptPublic/iterations:10              | 2899             | 8769   | 18280   | 6500    | 5700   |
| n=8192 / log(q)=218 / BGV / Decrypt/iterations:10                    | 399              | 1416   | 2280    | 1200    | 1100   |
| n=8192 / log(q)=218 / BGV / EncodeBatch/iterations:10                | 52.8             | 186    | 290     | 200     | 100.0  |
| n=8192 / log(q)=218 / BGV / DecodeBatch/iterations:10                | 70.4             | 224    | 320     | 100.0   | 0.000  |
| n=8192 / log(q)=218 / BGV / EvaluateNegate/iterations:10             | 45.0             | 43.3   | 80.0    | 100.0   | 100.0  |
| n=8192 / log(q)=218 / BGV / EvaluateNegateInplace/iterations:10      | 33.7             | 22.9   | 40.0    | 0.000   | 0.000  |
| n=8192 / log(q)=218 / BGV / EvaluateAddCt/iterations:10              | 54.1             | 299    | 420     | 0.000   | 200    |
| n=8192 / log(q)=218 / BGV / EvaluateAddCtInplace/iterations:10       | 44.7             | 279    | 350     | 100.0   | 0.000  |
| n=8192 / log(q)=218 / BGV / EvaluateAddPt/iterations:10              | 379              | 1100   | 1580    | 1000    | 1000   |
| n=8192 / log(q)=218 / BGV / EvaluateAddPtInplace/iterations:10       | 368              | 1088   | 1550    | 1000    | 300    |
| n=8192 / log(q)=218 / BGV / EvaluateMulCt/iterations:10              | 265              | 1085   | 1280    | 800     | 1000   |
| n=8192 / log(q)=218 / BGV / EvaluateMulCtInplace/iterations:10       | 246              | 1073   | 1280    | 1100    | 800    |
| n=8192 / log(q)=218 / BGV / EvaluateMulPt/iterations:10              | 466              | 1420   | 1960    | 1100    | 1100   |
| n=8192 / log(q)=218 / BGV / EvaluateMulPtInplace/iterations:10       | 439              | 1431   | 1930    | 1100    | 1000   |
| n=8192 / log(q)=218 / BGV / EvaluateSquare/iterations:10             | 214              | 869    | 1060    | 1000    | 1000   |
| n=8192 / log(q)=218 / BGV / EvaluateSquareInplace/iterations:10      | 192              | 859    | 1050    | 1000    | 700    |
| n=8192 / log(q)=218 / BGV / EvaluateModSwitchInplace/iterations:10   | 613              | 2321   | 3380    | 1400    | 1300   |
| n=8192 / log(q)=218 / BGV / EvaluateRelinInplace/iterations:10       | 2188             | 8097   | 11830   | 6000    | 5500   |
| n=8192 / log(q)=218 / BGV / EvaluateRotateRows/iterations:10         | 2193             | 8056   | 11740   | 6200    | 5400   |
| n=8192 / log(q)=218 / BGV / EvaluateRotateRowsInplace/iterations:10  | 2175             | 7942   | 11730   | 6300    | 5500   |
| n=8192 / log(q)=218 / BGV / EvaluateRotateCols/iterations:10         | 2203             | 7972   | 11760   | 6100    | 5300   |
| n=8192 / log(q)=218 / BGV / EvaluateRotateColsInplace/iterations:10  | 2201             | 7941   | 11710   | 6700    | 6000   |
| n=8192 / log(q)=218 / BGV / EvaluateToNTTInplace/iterations:10       | 480              | 1713   | 2510    | 1100    | 1000   |
| n=8192 / log(q)=218 / BGV / EvaluateFromNTTInplace/iterations:10     | 382              | 1461   | 2130    | 1200    | 800    |
| n=8192 / log(q)=218 / CKKS / EncryptSecret/iterations:10             | 1322             | 2488   | 15610   | 1900    | 2000   |
| n=8192 / log(q)=218 / CKKS / EncryptPublic/iterations:10             | 2483             | 7284   | 16090   | 5200    | 4700   |
| n=8192 / log(q)=218 / CKKS / Decrypt/iterations:10                   | 99.4             | 377    | 530     | 400     | 300    |
| n=8192 / log(q)=218 / CKKS / EncodeDouble/iterations:10              | 413              | 1129   | 1660    | 800     | 800    |
| n=8192 / log(q)=218 / CKKS / DecodeDouble/iterations:10              | 847              | 1789   | 2850    | 2000    | 1600   |
| n=8192 / log(q)=218 / CKKS / EvaluateAddCt/iterations:10             | 54.1             | 252    | 390     | 0.000   | 100.0  |
| n=8192 / log(q)=218 / CKKS / EvaluateAddPt/iterations:10             | 30.1             | 128    | 190     | 0.000   | 0.000  |
| n=8192 / log(q)=218 / CKKS / EvaluateNegate/iterations:10            | 37.8             | 30.5   | 50.0    | 0.000   | 0.000  |
| n=8192 / log(q)=218 / CKKS / EvaluateSubCt/iterations:10             | 47.1             | 274    | 360     | 100.0   | 100    |
| n=8192 / log(q)=218 / CKKS / EvaluateSubPt/iterations:10             | 26.8             | 117    | 190     | 200     | 0.000  |
| n=8192 / log(q)=218 / CKKS / EvaluateMulCt/iterations:10             | 265              | 1093   | 1300    | 1100    | 1000   |
| n=8192 / log(q)=218 / CKKS / EvaluateMulPt/iterations:10             | 134              | 488    | 550     | 200     | 1000   |
| n=8192 / log(q)=218 / CKKS / EvaluateSquare/iterations:10            | 190              | 843    | 1040    | 800     | 500    |
| n=8192 / log(q)=218 / CKKS / EvaluateRescaleInplace/iterations:10    | 444              | 1694   | 2560    | 1400    | 1200   |
| n=8192 / log(q)=218 / CKKS / EvaluateRelinInplace/iterations:10      | 1936             | 7119   | 10670   | 5300    | 4800   |
| n=8192 / log(q)=218 / CKKS / EvaluateRotate/iterations:10            | 1999             | 7097   | 10600   | 5500    | 4800   |
| n=8192 / log(q)=218 / UTIL / NTTForward/iterations:10                | 480              | 1716   | 2560    | 1300    | 1000   |
| n=8192 / log(q)=218 / UTIL / NTTInverse/iterations:10                | 382              | 1461   | 2150    | 1100    | 1000   |
| n=8192 / log(q)=0 / UTIL / NTTForwardLowLevel/iterations:10          | 62.8             | 214    | 330     | 200     | 200    |
| n=8192 / log(q)=0 / UTIL / NTTInverseLowLevel/iterations:10          | 48.7             | 181    | 260     | 100     | 200    |
| n=8192 / log(q)=0 / UTIL / NTTForwardLowLevelLazy/iterations:10      | 44.0             | 181    | 260     | 200     | 100    |
| n=8192 / log(q)=0 / UTIL / NTTInverseLowLevelLazy/iterations:10      | 47.3             | 178    | 270     | 0.000   | 0.000  |
| n=16384 / log(q)=438 / KeyGen / Secret/iterations:10                 | 1930             | 5004   | 10940   | 3600    | 3100   |
| n=16384 / log(q)=438 / KeyGen / Public/iterations:10                 | 5250             | 9852   | 62980   | 8200    | 8300   |
| n=16384 / log(q)=438 / KeyGen / Relin/iterations:10                  | 41363            | 79759  | 505470  | 65500   | 66500  |
| n=16384 / log(q)=438 / KeyGen / Galois/iterations:10                 | 41180            | 79114  | 513060  | 65200   | 66100  |
| n=16384 / log(q)=438 / BFV / EncryptSecret/iterations:10             | 5589             | 15454  | 66270   | 13400   | 12600  |
| n=16384 / log(q)=438 / BFV / EncryptPublic/iterations:10             | 6435             | 22588  | 44050   | 17300   | 15200  |
| n=16384 / log(q)=438 / BFV / Decrypt/iterations:10                   | 2584             | 9524   | 15250   | 7600    | 6600   |
| n=16384 / log(q)=438 / BFV / EncodeBatch/iterations:10               | 114              | 404    | 590     | 200     | 200    |
| n=16384 / log(q)=438 / BFV / DecodeBatch/iterations:10               | 147              | 477    | 710     | 400     | 400    |
| n=16384 / log(q)=438 / BFV / EvaluateAddCt/iterations:10             | 278              | 1032   | 1610    | 300     | 300    |
| n=16384 / log(q)=438 / BFV / EvaluateAddPt/iterations:10             | 403              | 4055   | 5290    | 3600    | 3200   |
| n=16384 / log(q)=438 / BFV / EvaluateNegate/iterations:10            | 167              | 125    | 220     | 200     | 100    |
| n=16384 / log(q)=438 / BFV / EvaluateSubCt/iterations:10             | 199              | 1101   | 1420    | 200     | 0.000  |
| n=16384 / log(q)=438 / BFV / EvaluateSubPt/iterations:10             | 373              | 4123   | 5300    | 3900    | 3200   |
| n=16384 / log(q)=438 / BFV / EvaluateMulCt/iterations:10             | 29817            | 117736 | 227420  | 102400  | 86600  |
| n=16384 / log(q)=438 / BFV / EvaluateMulPt/iterations:10             | 4983             | 18316  | 26500   | 13700   | 11700  |
| n=16384 / log(q)=438 / BFV / EvaluateSquare/iterations:10            | 22176            | 86792  | 170920  | 77400   | 69900  |
| n=16384 / log(q)=438 / BFV / EvaluateModSwitchInplace/iterations:10  | 596              | 2209   | 3300    | 1400    | 1000   |
| n=16384 / log(q)=438 / BFV / EvaluateRelinInplace/iterations:10      | 11944            | 45319  | 65990   | 34700   | 29100  |
| n=16384 / log(q)=438 / BFV / EvaluateRotateRows/iterations:10        | 12108            | 44093  | 65730   | 34800   | 29600  |
| n=16384 / log(q)=438 / BFV / EvaluateRotateCols/iterations:10        | 11979            | 43902  | 66720   | 34700   | 29400  |
| n=16384 / log(q)=438 / BGV / EncryptSecret/iterations:10             | 6134             | 13390  | 63660   | 10500   | 10000  |
| n=16384 / log(q)=438 / BGV / EncryptPublic/iterations:10             | 9965             | 32783  | 58940   | 23400   | 20300  |
| n=16384 / log(q)=438 / BGV / Decrypt/iterations:10                   | 1715             | 5731   | 9120    | 4800    | 4100   |
| n=16384 / log(q)=438 / BGV / EncodeBatch/iterations:10               | 107              | 399    | 620     | 300     | 200    |
| n=16384 / log(q)=438 / BGV / DecodeBatch/iterations:10               | 143              | 474    | 740     | 200     | 300    |
| n=16384 / log(q)=438 / BGV / EvaluateNegate/iterations:10            | 185              | 169    | 360     | 300     | 100.0  |
| n=16384 / log(q)=438 / BGV / EvaluateNegateInplace/iterations:10     | 143              | 90.1   | 200     | 100     | 100.0  |
| n=16384 / log(q)=438 / BGV / EvaluateAddCt/iterations:10             | 234              | 1196   | 1610    | 300     | 400    |
| n=16384 / log(q)=438 / BGV / EvaluateAddCtInplace/iterations:10      | 291              | 1108   | 1430    | 200     | 600    |
| n=16384 / log(q)=438 / BGV / EvaluateAddPt/iterations:10             | 1559             | 4515   | 6760    | 2700    | 2400   |
| n=16384 / log(q)=438 / BGV / EvaluateAddPtInplace/iterations:10      | 1534             | 4480   | 6930    | 3000    | 2700   |
| n=16384 / log(q)=438 / BGV / EvaluateMulCt/iterations:10             | 1017             | 4357   | 5260    | 4100    | 3900   |
| n=16384 / log(q)=438 / BGV / EvaluateMulCtInplace/iterations:10      | 978              | 4299   | 5190    | 4100    | 3800   |
| n=16384 / log(q)=438 / BGV / EvaluateMulPt/iterations:10             | 1919             | 5894   | 8230    | 4800    | 4400   |
| n=16384 / log(q)=438 / BGV / EvaluateMulPtInplace/iterations:10      | 1920             | 5859   | 8210    | 4900    | 4400   |
| n=16384 / log(q)=438 / BGV / EvaluateSquare/iterations:10            | 826              | 3473   | 4240    | 3000    | 2900   |
| n=16384 / log(q)=438 / BGV / EvaluateSquareInplace/iterations:10     | 810              | 3431   | 4150    | 3100    | 2900   |
| n=16384 / log(q)=438 / BGV / EvaluateModSwitchInplace/iterations:10  | 2745             | 9759   | 14580   | 7200    | 6200   |
| n=16384 / log(q)=438 / BGV / EvaluateRelinInplace/iterations:10      | 12612            | 47355  | 71200   | 36700   | 31200  |
| n=16384 / log(q)=438 / BGV / EvaluateRotateRows/iterations:10        | 12936            | 47165  | 70090   | 36700   | 31300  |
| n=16384 / log(q)=438 / BGV / EvaluateRotateRowsInplace/iterations:10 | 12768            | 46966  | 70940   | 36600   | 31300  |
| n=16384 / log(q)=438 / BGV / EvaluateRotateCols/iterations:10        | 12853            | 47131  | 70640   | 36300   | 31300  |
| n=16384 / log(q)=438 / BGV / EvaluateRotateColsInplace/iterations:10 | 12813            | 46947  | 70720   | 36600   | 31100  |
| n=16384 / log(q)=438 / BGV / EvaluateToNTTInplace/iterations:10      | 2056             | 7261   | 10700   | 5100    | 4100   |
| n=16384 / log(q)=438 / BGV / EvaluateFromNTTInplace/iterations:10    | 1639             | 6253   | 9410    | 4800    | 4000   |
| n=16384 / log(q)=438 / CKKS / EncryptSecret/iterations:10            | 4731             | 9146   | 57720   | 7500    | 7400   |
| n=16384 / log(q)=438 / CKKS / EncryptPublic/iterations:10            | 8211             | 25798  | 49370   | 18300   | 16000  |
| n=16384 / log(q)=438 / CKKS / Decrypt/iterations:10                  | 392              | 1500   | 1990    | 1300    | 1100   |
| n=16384 / log(q)=438 / CKKS / EncodeDouble/iterations:10             | 1444             | 4363   | 6510    | 3200    | 2800   |
| n=16384 / log(q)=438 / CKKS / DecodeDouble/iterations:10             | 4305             | 8908   | 14740   | 9100    | 8600   |
| n=16384 / log(q)=438 / CKKS / EvaluateAddCt/iterations:10            | 224              | 1002   | 1650    | 200     | 200    |
| n=16384 / log(q)=438 / CKKS / EvaluateAddPt/iterations:10            | 126              | 506    | 660     | 0.000   | 200    |
| n=16384 / log(q)=438 / CKKS / EvaluateNegate/iterations:10           | 165              | 120    | 210     | 300     | 0.000  |
| n=16384 / log(q)=438 / CKKS / EvaluateSubCt/iterations:10            | 193              | 1104   | 1390    | 100.0   | 200    |
| n=16384 / log(q)=438 / CKKS / EvaluateSubPt/iterations:10            | 114              | 468    | 630     | 0.000   | 100.0  |
| n=16384 / log(q)=438 / CKKS / EvaluateMulCt/iterations:10            | 1035             | 4355   | 5190    | 4000    | 3900   |
| n=16384 / log(q)=438 / CKKS / EvaluateMulPt/iterations:10            | 512              | 1948   | 2240    | 2100    | 1800   |
| n=16384 / log(q)=438 / CKKS / EvaluateSquare/iterations:10           | 768              | 3374   | 4060    | 3200    | 3000   |
| n=16384 / log(q)=438 / CKKS / EvaluateRescaleInplace/iterations:10   | 2027             | 7030   | 10900   | 5400    | 4400   |
| n=16384 / log(q)=438 / CKKS / EvaluateRelinInplace/iterations:10     | 12391            | 43962  | 66280   | 34300   | 29100  |
| n=16384 / log(q)=438 / CKKS / EvaluateRotate/iterations:10           | 12528            | 43821  | 65930   | 34500   | 29200  |
| n=16384 / log(q)=438 / UTIL / NTTForward/iterations:10               | 2101             | 7277   | 10900   | 4800    | 4300   |
| n=16384 / log(q)=438 / UTIL / NTTInverse/iterations:10               | 1700             | 6285   | 9360    | 4700    | 4000   |
| n=16384 / log(q)=0 / UTIL / NTTForwardLowLevel/iterations:10         | 134              | 454    | 670     | 300     | 300    |
| n=16384 / log(q)=0 / UTIL / NTTInverseLowLevel/iterations:10         | 110              | 389    | 550     | 200     | 300    |
| n=16384 / log(q)=0 / UTIL / NTTForwardLowLevelLazy/iterations:10     | 94.3             | 387    | 580     | 100     | 200    |
| n=16384 / log(q)=0 / UTIL / NTTInverseLowLevelLazy/iterations:10     | 102              | 387    | 590     | 300     | 200    |
| n=32768 / log(q)=881 / KeyGen / Secret/iterations:10                 | 7794             | 18226  | 33730   | 13600   | 11400  |
| n=32768 / log(q)=881 / KeyGen / Public/iterations:10                 | 19455            | 35959  | 221200  | 30000   | 30400  |
| n=32768 / log(q)=881 / KeyGen / Relin/iterations:10                  | 290137           | 535191 | 3305720 | 454400  | 459800 |
| n=32768 / log(q)=881 / KeyGen / Galois/iterations:10                 | 284505           | 532167 | 3285190 | 449200  | 454100 |
| n=32768 / log(q)=881 / BFV / EncryptSecret/iterations:10             | 22457            | 53915  | 233440  | 45700   | 43300  |
| n=32768 / log(q)=881 / BFV / EncryptPublic/iterations:10             | 27071            | 77804  | 132030  | 61100   | 53300  |
| n=32768 / log(q)=881 / BFV / Decrypt/iterations:10                   | 9906             | 36006  | 56710   | 28500   | 23700  |
| n=32768 / log(q)=881 / BFV / EncodeBatch/iterations:10               | 256              | 859    | 1350    | 600     | 600    |
| n=32768 / log(q)=881 / BFV / DecodeBatch/iterations:10               | 321              | 1003   | 1490    | 1100    | 100.0  |
| n=32768 / log(q)=881 / BFV / EvaluateAddCt/iterations:10             | 993              | 3899   | 6000    | 1000    | 1100   |
| n=32768 / log(q)=881 / BFV / EvaluateAddPt/iterations:10             | 2362             | 10517  | 13540   | 8500    | 8000   |
| n=32768 / log(q)=881 / BFV / EvaluateNegate/iterations:10            | 629              | 465    | 920     | 600     | 500    |
| n=32768 / log(q)=881 / BFV / EvaluateSubCt/iterations:10             | 768              | 4184   | 5340    | 900     | 800    |
| n=32768 / log(q)=881 / BFV / EvaluateSubPt/iterations:10             | 2355             | 10761  | 13640   | 8600    | 7900   |
| n=32768 / log(q)=881 / BFV / EvaluateMulCt/iterations:10             | 137938           | 531834 | 1078700 | 463000  | 383100 |
| n=32768 / log(q)=881 / BFV / EvaluateMulPt/iterations:10             | 19996            | 72301  | 106050  | 54800   | 45900  |
| n=32768 / log(q)=881 / BFV / EvaluateSquare/iterations:10            | 103629           | 399673 | 824100  | 353300  | 306200 |
| n=32768 / log(q)=881 / BFV / EvaluateModSwitchInplace/iterations:10  | 2262             | 10109  | 14290   | 5200    | 5000   |
| n=32768 / log(q)=881 / BFV / EvaluateRelinInplace/iterations:10      | 74559            | 277711 | 414450  | 214000  | 181800 |
| n=32768 / log(q)=881 / BFV / EvaluateRotateRows/iterations:10        | 75499            | 276267 | 414860  | 216200  | 183100 |
| n=32768 / log(q)=881 / BFV / EvaluateRotateCols/iterations:10        | 75629            | 276612 | 415690  | 216200  | 183000 |
| n=32768 / log(q)=881 / BGV / EncryptSecret/iterations:10             | 23877            | 51190  | 231300  | 40100   | 39200  |
| n=32768 / log(q)=881 / BGV / EncryptPublic/iterations:10             | 39409            | 121329 | 198670  | 88800   | 77400  |
| n=32768 / log(q)=881 / BGV / Decrypt/iterations:10                   | 6785             | 21804  | 33690   | 17500   | 15000  |
| n=32768 / log(q)=881 / BGV / EncodeBatch/iterations:10               | 256              | 862    | 1330    | 900     | 700    |
| n=32768 / log(q)=881 / BGV / DecodeBatch/iterations:10               | 317              | 1001   | 1530    | 900     | 500    |
| n=32768 / log(q)=881 / BGV / EvaluateNegate/iterations:10            | 737              | 655    | 1320    | 1000    | 1000   |
| n=32768 / log(q)=881 / BGV / EvaluateNegateInplace/iterations:10     | 799              | 336    | 760     | 600     | 500    |
| n=32768 / log(q)=881 / BGV / EvaluateAddCt/iterations:10             | 905              | 3785   | 5930    | 900     | 1000   |
| n=32768 / log(q)=881 / BGV / EvaluateAddCtInplace/iterations:10      | 625              | 4150   | 5370    | 400     | 800    |
| n=32768 / log(q)=881 / BGV / EvaluateAddPt/iterations:10             | 6036             | 17338  | 26290   | 11800   | 10000  |
| n=32768 / log(q)=881 / BGV / EvaluateAddPtInplace/iterations:10      | 5884             | 17211  | 26150   | 11600   | 9800   |
| n=32768 / log(q)=881 / BGV / EvaluateMulCt/iterations:10             | 3787             | 16312  | 19480   | 15700   | 14400  |
| n=32768 / log(q)=881 / BGV / EvaluateMulCtInplace/iterations:10      | 3530             | 16058  | 19010   | 15600   | 14100  |
| n=32768 / log(q)=881 / BGV / EvaluateMulPt/iterations:10             | 7404             | 22868  | 31870   | 18900   | 16700  |
| n=32768 / log(q)=881 / BGV / EvaluateMulPtInplace/iterations:10      | 7253             | 22829  | 32120   | 19000   | 16500  |
| n=32768 / log(q)=881 / BGV / EvaluateSquare/iterations:10            | 3135             | 13104  | 16060   | 12000   | 11600  |
| n=32768 / log(q)=881 / BGV / EvaluateSquareInplace/iterations:10     | 3048             | 12740  | 15490   | 11900   | 11000  |
| n=32768 / log(q)=881 / BGV / EvaluateModSwitchInplace/iterations:10  | 10832            | 38685  | 58050   | 28100   | 24600  |
| n=32768 / log(q)=881 / BGV / EvaluateRelinInplace/iterations:10      | 77860            | 288197 | 433160  | 221400  | 187800 |
| n=32768 / log(q)=881 / BGV / EvaluateRotateRows/iterations:10        | 78629            | 287167 | 431860  | 221500  | 188600 |
| n=32768 / log(q)=881 / BGV / EvaluateRotateRowsInplace/iterations:10 | 78221            | 286311 | 432220  | 221100  | 188500 |
| n=32768 / log(q)=881 / BGV / EvaluateRotateCols/iterations:10        | 78445            | 287150 | 433080  | 221800  | 188600 |
| n=32768 / log(q)=881 / BGV / EvaluateRotateColsInplace/iterations:10 | 78351            | 287128 | 432190  | 221000  | 187800 |
| n=32768 / log(q)=881 / BGV / EvaluateToNTTInplace/iterations:10      | 8137             | 28871  | 43020   | 19400   | 16200  |
| n=32768 / log(q)=881 / BGV / EvaluateFromNTTInplace/iterations:10    | 6656             | 25156  | 37470   | 19300   | 15400  |
| n=32768 / log(q)=881 / CKKS / EncryptSecret/iterations:10            | 18153            | 34982  | 206890  | 28400   | 28400  |
| n=32768 / log(q)=881 / CKKS / EncryptPublic/iterations:10            | 32572            | 97712  | 164410  | 71300   | 61600  |
| n=32768 / log(q)=881 / CKKS / Decrypt/iterations:10                  | 1494             | 5668   | 7540    | 4400    | 4000   |
| n=32768 / log(q)=881 / CKKS / EncodeDouble/iterations:10             | 6769             | 16548  | 24610   | 11900   | 10200  |
| n=32768 / log(q)=881 / CKKS / DecodeDouble/iterations:10             | 21918            | 45509  | 75220   | 47500   | 47500  |
| n=32768 / log(q)=881 / CKKS / EvaluateAddCt/iterations:10            | 912              | 3782   | 6020    | 900     | 900    |
| n=32768 / log(q)=881 / CKKS / EvaluateAddPt/iterations:10            | 509              | 1875   | 2570    | 200     | 700    |
| n=32768 / log(q)=881 / CKKS / EvaluateNegate/iterations:10           | 645              | 458    | 890     | 800     | 500    |
| n=32768 / log(q)=881 / CKKS / EvaluateSubCt/iterations:10            | 777              | 4192   | 5420    | 800     | 900    |
| n=32768 / log(q)=881 / CKKS / EvaluateSubPt/iterations:10            | 448              | 1796   | 2450    | 200     | 100    |
| n=32768 / log(q)=881 / CKKS / EvaluateMulCt/iterations:10            | 3790             | 16369  | 19400   | 15900   | 14400  |
| n=32768 / log(q)=881 / CKKS / EvaluateMulPt/iterations:10            | 1906             | 7290   | 8420    | 7600    | 7100   |
| n=32768 / log(q)=881 / CKKS / EvaluateSquare/iterations:10           | 2931             | 12665  | 15040   | 11800   | 10900  |
| n=32768 / log(q)=881 / CKKS / EvaluateRescaleInplace/iterations:10   | 7452             | 27233  | 41840   | 20300   | 17200  |
| n=32768 / log(q)=881 / CKKS / EvaluateRelinInplace/iterations:10     | 74785            | 276801 | 416320  | 214300  | 181300 |
| n=32768 / log(q)=881 / CKKS / EvaluateRotate/iterations:10           | 75781            | 276715 | 415740  | 215100  | 182400 |
| n=32768 / log(q)=881 / UTIL / NTTForward/iterations:10               | 8294             | 28889  | 42920   | 19600   | 16300  |
| n=32768 / log(q)=881 / UTIL / NTTInverse/iterations:10               | 6842             | 25324  | 37970   | 19400   | 15600  |
| n=32768 / log(q)=0 / UTIL / NTTForwardLowLevel/iterations:10         | 285              | 961    | 1460    | 800     | 600    |
| n=32768 / log(q)=0 / UTIL / NTTInverseLowLevel/iterations:10         | 227              | 832    | 1250    | 700     | 700    |
| n=32768 / log(q)=0 / UTIL / NTTForwardLowLevelLazy/iterations:10     | 206              | 822    | 1310    | 700     | 400    |
| n=32768 / log(q)=0 / UTIL / NTTInverseLowLevelLazy/iterations:10     | 216              | 817    | 1260    | 700     | 400    |

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
