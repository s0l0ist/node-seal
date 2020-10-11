# [node-seal](https://morfix.io/sandbox) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/morfix-io/node-seal/blob/master/LICENSE) [![codecov](https://codecov.io/gh/morfix-io/node-seal/branch/master/graph/badge.svg)](https://codecov.io/gh/morfix-io/node-seal) [![CodeFactor](https://www.codefactor.io/repository/github/morfix-io/node-seal/badge)](https://www.codefactor.io/repository/github/morfix-io/node-seal) [![DeepScan grade](https://deepscan.io/api/teams/6431/projects/8438/branches/100710/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6431&pid=8438&bid=100710) [![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmorfix-io%2Fnode-seal.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmorfix-io%2Fnode-seal?ref=badge_shield)

node-seal is a homomorphic encryption library for JavaScript.

- **Web Assembly:** Fastest web implementation of the C++ [Microsoft SEAL](https://github.com/microsoft/SEAL) library
- **Zero dependencies:** Very lean, only contains a low level API which is very close to the C++ calls from Microsoft SEAL.
- **Node.js, Browser, React Native:** Install once, work in any server/client configuration.

**Now supporting Microsoft SEAL 3.5.9**

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
// Defaults to (node-seal/throws/wasm/node/cjs) for NodeJS
// Defaults to (node-seal/throws/wasm/web/iife) for Browsers
// Defaults to (node-seal/throws/wasm/web/es) for Modules
import { Seal } from 'node-seal'
const { Seal } = require('node-seal')
```

You may also specify a deep import to target your environment better.
This is useful for environments that aren't detected properly or do
not support WebAssembly. In addition, there are two separate bundles
for throwing on transparent ciphertexts and another for allowing
transparent ciphertexts. If you're unsure what you need, start with
the build that **throws** on transparent ciphertexts. This is also the
default import that is used.

The deep import link is structured like the following:

`node-seal / <throws|allows> / <wasm|js> / <node|web|worker> / <cjs|es|iife>`

```javascript
// Always Pick a variant which throws on transparent ciphertexts unless you
// have a specific reason to allow the use of transparent ciphertexts.
import { Seal } from 'node-seal/throws/wasm/node/cjs'

// Or pick a variant which allows transparent ciphertexts (only use this if you know what you're doing)
import { Seal } from 'node-seal/allows/wasm/node/cjs'
```

#### React-Native

The bundle needs a bit of extra work. Specifically, it expects the browser `crypto.getRandomValues` which it will not find by default as react-native doesn't support the crypto builtin. It can be fixed by `npm install react-native-get-random-values` which provides access to this global while supporting a CSPRNG. The library also needs to have the browser `document` which is an artifact from the build system. Simply provide `global.document = {}`. Finally, it requires the following deep import structure:

```javascript
// Provide a CSPRNG mapping to crypto.getRandomValues()
import 'react-native-get-random-values'
import { Seal } from 'node-seal/allows/wasm/web/es'
;(async () => {
  // Spoof the browser document
  global.document = {}
  // Wait for the library to initialize
  const seal = await Seal()
  //...
})()
```

## Demo

Go to [morfix.io/sandbox](https://morfix.io/sandbox)

This sandbox was built for users to experiment and learn how to use Microsoft SEAL featuring node-seal.

- **Encryption Parameters:** experiment with many settings to prototype a context.
- **Keys:** Create, download, upload Secret/Public Keys - even for Relinearization and Galois Keys.
- **Variables:** Create, download, upload PlainTexts or CipherTexts
- **Functions:** Create a list of HE functions to execute!
- **Code Generation:** After your experimentation is complete, generate working code to use!

## Usage

Checkout the [basics](USAGE.md)

## Documentation

View the latest docs [here](https://docs.morfix.io)

## Examples

Check out the [Sandbox](https://morfix.io/sandbox) to run HE functions and even generate working code!

If you'd rather read an example, take a look [here](FULL-EXAMPLE.md).

For more exhaustive examples, view the [tests](src/test) or the [benchmarks](benchmark/).

## Changes

For changes in this library, take a look [here](CHANGES.md).

For changes in Microsoft SEAL,
take a look at their [list of changes](https://github.com/microsoft/SEAL/blob/master/CHANGES.md).

## Benchmarks

A set of benchmarks similar to the benchmarks of the native SEAL C++ code can be found [here](benchmark/).

Run them by cloning this repository and then run `npm run benchmark:bfv` or `npm run benchmark:ckks`.

The scripts are only for NodeJS. We have adapted a variant of this script for each browser and have shown the results in the section below.

## Performance

Test specs 2018 MacBook Pro:

- 2.6 GHz 6-Core Intel Core i7
- 16 GB 2400 MHz DDR4

Versions:

- Microsoft Seal v3.4.5
- Node-seal v4.1.4
- NodeJS v12.16.1
- Chrome Version 80.0.3987.149 (Official Build) (64-bit)
- Firefox 74.0 (64-bit)
- Safari Version 13.0.5 (15608.5.11)

Encryption Parameters:

- Scheme: BFV
- Poly Modulus Degree: 16384
- Coeff Modulus Size: 438 (48 + 48 + 48 + 49 + 49 + 49 + 49 + 49 + 49) bits
- Plain Modulus: 786433

number of iterations is **100**, time in **microseconds**. Browser timers are known to be imprecise, variance maybe high.

| 16384, n = 100         | Node\.js | Chrome  | Firefox | Safari  | Seal \(C\+\+\) | Node\.js \(times slower\) | Chrome \(times slower\) | Firefox \(times slower\) | Safari \(times slower\) |
| ---------------------- | -------- | ------- | ------- | ------- | -------------- | ------------------------- | ----------------------- | ------------------------ | ----------------------- |
| KeyPair                | 36422    | 32770   | 29000   | 55000   | 22376          | 1\.63                     | 1\.46                   | 1\.30                    | 2\.46                   |
| RelinKeys              | 230859   | 197870  | 198000  | 175000  | 138788         | 1\.66                     | 1\.43                   | 1\.43                    | 1\.26                   |
| GaloisKeys             | 5937772  | 5084275 | 4936000 | 4624000 | 3577623        | 1\.66                     | 1\.42                   | 1\.38                    | 1\.29                   |
| Batch                  | 868      | 752     | 670     | 767     | 327            | 2\.65                     | 2\.30                   | 2\.05                    | 2\.35                   |
| Unbatch                | 1026     | 926     | 730     | 1467    | 304            | 3\.38                     | 3\.05                   | 2\.40                    | 4\.83                   |
| Encrypt                | 46826    | 41455   | 37110   | 34800   | 18712          | 2\.50                     | 2\.22                   | 1\.98                    | 1\.86                   |
| Decrypt                | 20992    | 19078   | 16460   | 15667   | 6134           | 3\.42                     | 3\.11                   | 2\.68                    | 2\.55                   |
| Add                    | 1404     | 1185    | 447     | 389     | 212            | 6\.62                     | 5\.59                   | 2\.11                    | 1\.83                   |
| Multiply               | 245425   | 231089  | 209040  | 204700  | 60896          | 4\.03                     | 3\.79                   | 3\.43                    | 3\.36                   |
| Multiply Plain         | 35541    | 31305   | 24260   | 22367   | 10318          | 3\.44                     | 3\.03                   | 2\.35                    | 2\.17                   |
| Square                 | 180152   | 169122  | 155860  | 148533  | 45762          | 3\.94                     | 3\.70                   | 3\.41                    | 3\.25                   |
| Relinearize            | 98158    | 85478   | 66870   | 66333   | 25139          | 3\.90                     | 3\.40                   | 2\.66                    | 2\.64                   |
| Rotate Row One Step    | 97292    | 85724   | 67615   | 65400   | 25247          | 3\.85                     | 3\.40                   | 2\.68                    | 2\.59                   |
| Rotate Row Random Step | 416774   | 384842  | 295540  | 285733  | 118948         | 3\.50                     | 3\.24                   | 2\.48                    | 2\.40                   |
| Rotate Column          | 97366    | 85515   | 67730   | 64567   | 25274          | 3\.85                     | 3\.38                   | 2\.68                    | 2\.55                   |

## Caveats

Conversion from C++ to Web Assembly has some limitations:

- **±2^53 bit numbers:** JavaScript uses 2^53 numbers (not true 64 bit). Values higher than these
  will typically result in inaccuracies. If you're using the `CKKS` scheme, you need to keep this in mind. `BFV` users will inherently adhere to these limitations due to the Int32Array/Uint32Array TypedArrays. Recently, `BFV` users now have support for BigInt64Array/BigUint64Array TypedArrays
  but at a significant encode/decode penalty - encyption/evaluation/decryption performance is the same.

- **Memory:** Generating large keys and saving them in the browser could be problematic.
  We can control NodeJS heap size, but not inside a user's browser.

  Saving keys is very memory intensive especially for `polyModulusDegrees`s above `16384`.
  This is because there's currently no way (that we have found) to use io streams
  across JS and Web Assembly code, so the strings have to be buffered completely in RAM and
  they can be very, very large. This holds especially true for `GaloisKeys` where you may hit
  JS max string limits (256MB).

- **Garbage Collection:** Unfortunately, the typical way of cleaning up dereferenced JS objects will
  leave behind a the Web Assembly (C++) object in memory. There is no way to automatically call the destructors
  on C++ objects. JavaScript code must explicitly delete any C++ object handles it has received, or the
  heap will grow indefinitely.

  ```javascript
  <instance>.delete()
  ```

## Contributing

The main purpose of this library is to continue to
evolve and promote the adoption of homomorphic encryption
(using Microsoft SEAL) in modern
web applications today. Development of node-seal happens
in the open on GitHub, and we are grateful to the community for
contributing bugfixes and improvements.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

node-seal is [MIT licensed](LICENSE).

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmorfix-io%2Fnode-seal.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmorfix-io%2Fnode-seal?ref=badge_large)
