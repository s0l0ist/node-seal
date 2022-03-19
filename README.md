# [node-seal](https://morfix.io/sandbox) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/morfix-io/node-seal/blob/master/LICENSE) [![codecov](https://codecov.io/gh/morfix-io/node-seal/branch/master/graph/badge.svg)](https://codecov.io/gh/morfix-io/node-seal) [![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmorfix-io%2Fnode-seal.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmorfix-io%2Fnode-seal?ref=badge_shield)

node-seal is a homomorphic encryption library for TypeScript or JavaScript.

- **Web Assembly:** Fastest web implementation of the C++ [Microsoft SEAL](https://github.com/microsoft/SEAL) library
- **Zero dependencies:** Very lean, only contains a low level API which is very close to the C++ calls from Microsoft SEAL.
- **Node.js, Browser:** Install once, work in any server/client configuration.

**Now supporting Microsoft SEAL 4.0.0**

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

You may also specify a deep import to target your environment better.
This is useful for environments that aren't detected properly or do
not support WebAssembly. In addition, there are two separate bundles
for throwing on transparent ciphertexts and another for allowing
transparent ciphertexts. If you're unsure what you need, start with
the build that **throws** on transparent ciphertexts. This is also the
default import that is used.

The deep import link is structured like the following:

`node-seal / <throws|allows>_<wasm|js>_<node|web|worker>_<umd|es>`

```javascript
// Always Pick a variant which throws on transparent ciphertexts unless you
// have a specific reason to allow the use of transparent ciphertexts.
import SEAL from 'node-seal/throws_wasm_node_umd'

// Or pick a variant which allows transparent ciphertexts (only use this if you know what you're doing)
import SEAL from 'node-seal/allows_wasm_node_umd'
```

#### React-Native

React-native does not support WASM libraries; however, it is possible to run a WASM library, including `node-seal` by using a [WebView](https://github.com/react-native-webview/react-native-webview#readme) to load both the library and a simple interface to communicate with on top of the built-in `postMessage` API. Instead of publicly hosting the web application to be rendered by the WebView, it is possible to bundle the mini web application into a single HTML file (with JS inlined) and load the HTML file directly to the WebView.

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

For more exhaustive examples, view the [tests](src/__tests__).

## Changes

For changes in this library, take a look [here](CHANGES.md).

For changes in Microsoft SEAL,
take a look at their [list of changes](https://github.com/microsoft/SEAL/blob/master/CHANGES.md).

## Benchmarking

Microsoft SEAL has a native benchmark tool that we compile directly to WASM.

1. `npm run seal:build:bench`
2. `npm run benchmark`

## Performance

Microsoft SEAL now comes with a benchmark binary that can be directly compiled to WASM.

Test specs:

- MacBook Pro (16-inch, 2019)
- MacOS Big Sur 11.2.3
- 16 GB 2667 MHz DDR4

Versions:

- Microsoft Seal v3.6.3
- Node-seal v4.5.4
- NodeJS v14.16.0
- Chrome Version 89.0.4389.114 (Official Build) (x86_64)
- Firefox Version 87.0 (64-bit)
- Safari Version 14.0.3 (16610.4.3.1.7)

Note: NodeJS and Chrome have the ability to increase WASM memory past 2GB; however, Safari and FireFox's does not allow WASM memory be increased beyond 2GB and therefore crashes at the point in the benchmark where the memory allocations exceed that capacity. It is worth to mention the benchmark was not originally designed to be run under the 2GB constraint.

|         |            |        |                          |               | Native (No HEXL) | Node   | Chrome  | Safari | FireFox |
| ------- | ---------- | ------ | ------------------------ | ------------- | ---------------- | ------ | ------- | ------ | ------- |
| n=1024  | log(q)=27  | KeyGen | Secret                   | iterations:10 | 125              | 203    | 501     | 200    | 100.0   |
| n=1024  | log(q)=27  | KeyGen | Public                   | iterations:10 | 137              | 251    | 878     | 200    | 200     |
| n=1024  | log(q)=27  | BFV    | EncryptSecret            | iterations:10 | 158              | 432    | 1338    | 1000   | 400     |
| n=1024  | log(q)=27  | BFV    | EncryptPublic            | iterations:10 | 251              | 551    | 1224    | 900    | 600     |
| n=1024  | log(q)=27  | BFV    | Decrypt                  | iterations:10 | 44.2             | 146    | 222     | 800    | 200     |
| n=1024  | log(q)=27  | BFV    | EncodeBatch              | iterations:10 | 9.96             | 29.3   | 43.0    | 100.0  | 0.000   |
| n=1024  | log(q)=27  | BFV    | DecodeBatch              | iterations:10 | 17.5             | 40.7   | 47.0    | 200    | 100.0   |
| n=1024  | log(q)=27  | BFV    | EvaluateAddCt            | iterations:10 | 3.66             | 9.80   | 10.5    | 100.0  | 0.000   |
| n=1024  | log(q)=27  | BFV    | EvaluateAddPt            | iterations:10 | 17.9             | 174    | 274     | 300    | 300     |
| n=1024  | log(q)=27  | BFV    | EvaluateMulCt            | iterations:10 | 432              | 1497   | 2429    | 2900   | 1500    |
| n=1024  | log(q)=27  | BFV    | EvaluateMulPt            | iterations:10 | 50.6             | 192    | 226     | 300    | 100     |
| n=1024  | log(q)=27  | BFV    | EvaluateSquare           | iterations:10 | 323              | 1193   | 1794    | 2100   | 900     |
| n=1024  | log(q)=27  | CKKS   | EncryptSecret            | iterations:10 | 139              | 259    | 737     | 200    | 200     |
| n=1024  | log(q)=27  | CKKS   | EncryptPublic            | iterations:10 | 250              | 486    | 914     | 400    | 400     |
| n=1024  | log(q)=27  | CKKS   | Decrypt                  | iterations:10 | 6.67             | 20.9   | 28.5    | 0.000  | 100.0   |
| n=1024  | log(q)=27  | CKKS   | EncodeDouble             | iterations:10 | 43.6             | 78.6   | 154     | 800    | 100     |
| n=1024  | log(q)=27  | CKKS   | DecodeDouble             | iterations:10 | 36.9             | 67.2   | 143     | 500    | 0.000   |
| n=1024  | log(q)=27  | CKKS   | EvaluateAddCt            | iterations:10 | 3.31             | 9.88   | 10.0    | 0.000  | 0.000   |
| n=1024  | log(q)=27  | CKKS   | EvaluateAddPt            | iterations:10 | 2.50             | 5.56   | 3.50    | 100.0  | 0.000   |
| n=1024  | log(q)=27  | CKKS   | EvaluateMulCt            | iterations:10 | 21.3             | 57.6   | 81.5    | 200    | 100.0   |
| n=1024  | log(q)=27  | CKKS   | EvaluateMulPt            | iterations:10 | 7.20             | 25.0   | 37.0    | 0.000  | 0.000   |
| n=1024  | log(q)=27  | CKKS   | EvaluateSquare           | iterations:10 | 11.8             | 43.2   | 57.5    | 100    | 0.000   |
| n=2048  | log(q)=54  | KeyGen | Secret                   | iterations:10 | 204              | 310    | 642     | 300    | 200     |
| n=2048  | log(q)=54  | KeyGen | Public                   | iterations:10 | 233              | 421    | 1304    | 400    | 400     |
| n=2048  | log(q)=54  | BFV    | EncryptSecret            | iterations:10 | 283              | 808    | 1925    | 1000   | 700     |
| n=2048  | log(q)=54  | BFV    | EncryptPublic            | iterations:10 | 478              | 1112   | 2310    | 1200   | 1100    |
| n=2048  | log(q)=54  | BFV    | Decrypt                  | iterations:10 | 88.7             | 290    | 436     | 400    | 100     |
| n=2048  | log(q)=54  | BFV    | EncodeBatch              | iterations:10 | 19.4             | 61.8   | 88.0    | 200    | 0.000   |
| n=2048  | log(q)=54  | BFV    | DecodeBatch              | iterations:10 | 27.0             | 80.0   | 89.0    | 100    | 100.0   |
| n=2048  | log(q)=54  | BFV    | EvaluateAddCt            | iterations:10 | 5.20             | 19.0   | 18.5    | 0.000  | 0.000   |
| n=2048  | log(q)=54  | BFV    | EvaluateAddPt            | iterations:10 | 33.6             | 399    | 585     | 500    | 500     |
| n=2048  | log(q)=54  | BFV    | EvaluateMulCt            | iterations:10 | 1003             | 3173   | 5004    | 3600   | 3100    |
| n=2048  | log(q)=54  | BFV    | EvaluateMulPt            | iterations:10 | 106              | 392    | 460     | 200    | 400     |
| n=2048  | log(q)=54  | BFV    | EvaluateSquare           | iterations:10 | 668              | 2326   | 3662    | 2500   | 1900    |
| n=2048  | log(q)=54  | CKKS   | EncryptSecret            | iterations:10 | 241              | 419    | 1345    | 300    | 400     |
| n=2048  | log(q)=54  | CKKS   | EncryptPublic            | iterations:10 | 473              | 740    | 1688    | 500    | 600     |
| n=2048  | log(q)=54  | CKKS   | Decrypt                  | iterations:10 | 10.9             | 72.1   | 55.0    | 0.000  | 0.000   |
| n=2048  | log(q)=54  | CKKS   | EncodeDouble             | iterations:10 | 108              | 175    | 337     | 100.0  | 200     |
| n=2048  | log(q)=54  | CKKS   | DecodeDouble             | iterations:10 | 75.6             | 146    | 313     | 100.0  | 100     |
| n=2048  | log(q)=54  | CKKS   | EvaluateAddCt            | iterations:10 | 5.18             | 18.7   | 18.5    | 100    | 0.000   |
| n=2048  | log(q)=54  | CKKS   | EvaluateAddPt            | iterations:10 | 3.37             | 10.4   | 9.00    | 0.000  | 0.000   |
| n=2048  | log(q)=54  | CKKS   | EvaluateMulCt            | iterations:10 | 30.9             | 116    | 169     | 200    | 200     |
| n=2048  | log(q)=54  | CKKS   | EvaluateMulPt            | iterations:10 | 12.6             | 50.1   | 78.5    | 100.0  | 0.000   |
| n=2048  | log(q)=54  | CKKS   | EvaluateSquare           | iterations:10 | 21.6             | 92.3   | 117     | 200    | 100     |
| n=4096  | log(q)=109 | KeyGen | Secret                   | iterations:10 | 491              | 919    | 1612    | 800    | 700     |
| n=4096  | log(q)=109 | KeyGen | Public                   | iterations:10 | 773              | 1555   | 4772    | 1500   | 1300    |
| n=4096  | log(q)=109 | KeyGen | Relin                    | iterations:10 | 1545             | 3166   | 9628    | 2900   | 2700    |
| n=4096  | log(q)=109 | KeyGen | Galois                   | iterations:10 | 1629             | 3135   | 9616    | 3000   | 2800    |
| n=4096  | log(q)=109 | BFV    | EncryptSecret            | iterations:10 | 722              | 2229   | 4923    | 2200   | 1700    |
| n=4096  | log(q)=109 | BFV    | EncryptPublic            | iterations:10 | 1337             | 3548   | 6373    | 3800   | 2800    |
| n=4096  | log(q)=109 | BFV    | Decrypt                  | iterations:10 | 304              | 1070   | 1471    | 900    | 800     |
| n=4096  | log(q)=109 | BFV    | EncodeBatch              | iterations:10 | 44.3             | 138    | 180     | 0.000  | 100     |
| n=4096  | log(q)=109 | BFV    | DecodeBatch              | iterations:10 | 56.0             | 170    | 213     | 200    | 100.0   |
| n=4096  | log(q)=109 | BFV    | EvaluateAddCt            | iterations:10 | 17.9             | 95.3   | 71.0    | 100    | 100     |
| n=4096  | log(q)=109 | BFV    | EvaluateAddPt            | iterations:10 | 102              | 799    | 1168    | 800    | 800     |
| n=4096  | log(q)=109 | BFV    | EvaluateMulCt            | iterations:10 | 3228             | 10952  | 16126   | 9400   | 9600    |
| n=4096  | log(q)=109 | BFV    | EvaluateMulPt            | iterations:10 | 442              | 1627   | 2002    | 1900   | 1300    |
| n=4096  | log(q)=109 | BFV    | EvaluateSquare           | iterations:10 | 2290             | 7896   | 12024   | 7100   | 7300    |
| n=4096  | log(q)=109 | BFV    | EvaluateModSwitchInplace | iterations:10 | 39.6             | 158    | 174     | 100.0  | 200     |
| n=4096  | log(q)=109 | BFV    | EvaluateRelinInplace     | iterations:10 | 586              | 2254   | 2929    | 5700   | 1600    |
| n=4096  | log(q)=109 | BFV    | EvaluateRotateRows       | iterations:10 | 599              | 2252   | 3136    | 2300   | 1900    |
| n=4096  | log(q)=109 | BFV    | EvaluateRotateCols       | iterations:10 | 597              | 2260   | 3331    | 2000   | 2000    |
| n=4096  | log(q)=109 | CKKS   | EncryptSecret            | iterations:10 | 608              | 1156   | 3569    | 1000   | 900     |
| n=4096  | log(q)=109 | CKKS   | EncryptPublic            | iterations:10 | 1510             | 3600   | 6185    | 3200   | 3300    |
| n=4096  | log(q)=109 | CKKS   | Decrypt                  | iterations:10 | 38.6             | 164    | 223     | 200    | 200     |
| n=4096  | log(q)=109 | CKKS   | EncodeDouble             | iterations:10 | 236              | 555    | 912     | 400    | 500     |
| n=4096  | log(q)=109 | CKKS   | DecodeDouble             | iterations:10 | 335              | 741    | 1408    | 1000   | 800     |
| n=4096  | log(q)=109 | CKKS   | EvaluateAddCt            | iterations:10 | 19.3             | 73.7   | 64.0    | 0.000  | 0.000   |
| n=4096  | log(q)=109 | CKKS   | EvaluateAddPt            | iterations:10 | 10.3             | 40.5   | 32.0    | 200    | 0.000   |
| n=4096  | log(q)=109 | CKKS   | EvaluateMulCt            | iterations:10 | 132              | 460    | 658     | 600    | 600     |
| n=4096  | log(q)=109 | CKKS   | EvaluateMulPt            | iterations:10 | 70.3             | 207    | 273     | 300    | 200     |
| n=4096  | log(q)=109 | CKKS   | EvaluateSquare           | iterations:10 | 87.7             | 345    | 476     | 300    | 500     |
| n=4096  | log(q)=109 | CKKS   | EvaluateRescaleInplace   | iterations:10 | 165              | 624    | 755     | 600    | 200     |
| n=4096  | log(q)=109 | CKKS   | EvaluateRelinInplace     | iterations:10 | 645              | 2371   | 3044    | 2000   | 1900    |
| n=4096  | log(q)=109 | CKKS   | EvaluateRotate           | iterations:10 | 640              | 2294   | 3159    | 1900   | 1900    |
| n=8192  | log(q)=218 | KeyGen | Secret                   | iterations:10 | 1216             | 2502   | 4114    | 1900   | 1900    |
| n=8192  | log(q)=218 | KeyGen | Public                   | iterations:10 | 2300             | 4425   | 14274   | 4000   | 3900    |
| n=8192  | log(q)=218 | KeyGen | Relin                    | iterations:10 | 9130             | 17811  | 54680   | 14900  | 16400   |
| n=8192  | log(q)=218 | KeyGen | Galois                   | iterations:10 | 8902             | 17592  | 54816   | 14700  | 16200   |
| n=8192  | log(q)=218 | BFV    | EncryptSecret            | iterations:10 | 2329             | 6361   | 15322   | 5900   | 5700    |
| n=8192  | log(q)=218 | BFV    | EncryptPublic            | iterations:10 | 3651             | 10008  | 16088   | 8200   | 8500    |
| n=8192  | log(q)=218 | BFV    | Decrypt                  | iterations:10 | 993              | 3856   | 5426    | 3100   | 3300    |
| n=8192  | log(q)=218 | BFV    | EncodeBatch              | iterations:10 | 88.2             | 317    | 398     | 0.000  | 500     |
| n=8192  | log(q)=218 | BFV    | DecodeBatch              | iterations:10 | 113              | 363    | 419     | 400    | 0.000   |
| n=8192  | log(q)=218 | BFV    | EvaluateAddCt            | iterations:10 | 100              | 349    | 270     | 200    | 100.0   |
| n=8192  | log(q)=218 | BFV    | EvaluateAddPt            | iterations:10 | 336              | 1912   | 2761    | 2100   | 1800    |
| n=8192  | log(q)=218 | BFV    | EvaluateMulCt            | iterations:10 | 12301            | 41927  | 66550   | 35700  | 38500   |
| n=8192  | log(q)=218 | BFV    | EvaluateMulPt            | iterations:10 | 2002             | 6889   | 8103    | 5100   | 5300    |
| n=8192  | log(q)=218 | BFV    | EvaluateSquare           | iterations:10 | 9116             | 31535  | 49921   | 27000  | 28300   |
| n=8192  | log(q)=218 | BFV    | EvaluateModSwitchInplace | iterations:10 | 212              | 670    | 887     | 700    | 900     |
| n=8192  | log(q)=218 | BFV    | EvaluateRelinInplace     | iterations:10 | 3126             | 11861  | 15001   | 8700   | 9100    |
| n=8192  | log(q)=218 | BFV    | EvaluateRotateRows       | iterations:10 | 2969             | 11661  | 15285   | 8700   | 9400    |
| n=8192  | log(q)=218 | BFV    | EvaluateRotateCols       | iterations:10 | 3079             | 11431  | 15548   | 8600   | 9600    |
| n=8192  | log(q)=218 | CKKS   | EncryptSecret            | iterations:10 | 1799             | 3650   | 11429   | 3100   | 3200    |
| n=8192  | log(q)=218 | CKKS   | EncryptPublic            | iterations:10 | 4201             | 11817  | 16892   | 7800   | 8700    |
| n=8192  | log(q)=218 | CKKS   | Decrypt                  | iterations:10 | 154              | 698    | 848     | 100.0  | 800     |
| n=8192  | log(q)=218 | CKKS   | EncodeDouble             | iterations:10 | 739              | 1918   | 3085    | 2500   | 1500    |
| n=8192  | log(q)=218 | CKKS   | DecodeDouble             | iterations:10 | 1325             | 3128   | 5483    | 4700   | 2900    |
| n=8192  | log(q)=218 | CKKS   | EvaluateAddCt            | iterations:10 | 67.6             | 335    | 259     | 0.000  | 0.000   |
| n=8192  | log(q)=218 | CKKS   | EvaluateAddPt            | iterations:10 | 46.3             | 173    | 107     | 100.0  | 100.0   |
| n=8192  | log(q)=218 | CKKS   | EvaluateMulCt            | iterations:10 | 550              | 1949   | 2550    | 2200   | 2200    |
| n=8192  | log(q)=218 | CKKS   | EvaluateMulPt            | iterations:10 | 195              | 806    | 1100    | 800    | 1000    |
| n=8192  | log(q)=218 | CKKS   | EvaluateSquare           | iterations:10 | 376              | 1473   | 1812    | 1600   | 1600    |
| n=8192  | log(q)=218 | CKKS   | EvaluateRescaleInplace   | iterations:10 | 749              | 2701   | 3358    | 1900   | 1900    |
| n=8192  | log(q)=218 | CKKS   | EvaluateRelinInplace     | iterations:10 | 3224             | 11668  | 14986   | 8700   | 9400    |
| n=8192  | log(q)=218 | CKKS   | EvaluateRotate           | iterations:10 | 3098             | 11630  | 14986   | 9100   | 9300    |
| n=16384 | log(q)=438 | KeyGen | Secret                   | iterations:10 | 3460             | 8070   | 12079   | 5600   | 6100    |
| n=16384 | log(q)=438 | KeyGen | Public                   | iterations:10 | 7703             | 15024  | 44852   | 12900  | 14500   |
| n=16384 | log(q)=438 | KeyGen | Relin                    | iterations:10 | 58779            | 119280 | 369311  |        |         |
| n=16384 | log(q)=438 | KeyGen | Galois                   | iterations:10 | 57529            | 118681 | 363953  |        |         |
| n=16384 | log(q)=438 | BFV    | EncryptSecret            | iterations:10 | 8997             | 23451  | 51869   |        |         |
| n=16384 | log(q)=438 | BFV    | EncryptPublic            | iterations:10 | 12029            | 32771  | 47392   |        |         |
| n=16384 | log(q)=438 | BFV    | Decrypt                  | iterations:10 | 4028             | 15709  | 20084   |        |         |
| n=16384 | log(q)=438 | BFV    | EncodeBatch              | iterations:10 | 186              | 631    | 816     |        |         |
| n=16384 | log(q)=438 | BFV    | DecodeBatch              | iterations:10 | 242              | 744    | 840     |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateAddCt            | iterations:10 | 389              | 1253   | 1052    |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateAddPt            | iterations:10 | 1545             | 4662   | 5843    |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateMulCt            | iterations:10 | 49965            | 185973 | 296308  |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateMulPt            | iterations:10 | 8061             | 29075  | 34189   |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateSquare           | iterations:10 | 37019            | 137812 | 230896  |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateModSwitchInplace | iterations:10 | 974              | 3254   | 4025    |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateRelinInplace     | iterations:10 | 18268            | 71240  | 91871   |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateRotateRows       | iterations:10 | 18537            | 71103  | 90900   |        |         |
| n=16384 | log(q)=438 | BFV    | EvaluateRotateCols       | iterations:10 | 18643            | 71521  | 90580   |        |         |
| n=16384 | log(q)=438 | CKKS   | EncryptSecret            | iterations:10 | 6590             | 13848  | 40833   |        |         |
| n=16384 | log(q)=438 | CKKS   | EncryptPublic            | iterations:10 | 13636            | 39883  | 52729   |        |         |
| n=16384 | log(q)=438 | CKKS   | Decrypt                  | iterations:10 | 805              | 2634   | 3334    |        |         |
| n=16384 | log(q)=438 | CKKS   | EncodeDouble             | iterations:10 | 2501             | 7124   | 10073   |        |         |
| n=16384 | log(q)=438 | CKKS   | DecodeDouble             | iterations:10 | 5735             | 15365  | 25753   |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateAddCt            | iterations:10 | 368              | 1295   | 1014    |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateAddPt            | iterations:10 | 194              | 666    | 434     |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateMulCt            | iterations:10 | 2188             | 7471   | 10411   |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateMulPt            | iterations:10 | 783              | 3146   | 4279    |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateSquare           | iterations:10 | 1497             | 5561   | 7197    |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateRescaleInplace   | iterations:10 | 2823             | 11547  | 13768   |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateRelinInplace     | iterations:10 | 17745            | 71186  | 89405   |        |         |
| n=16384 | log(q)=438 | CKKS   | EvaluateRotate           | iterations:10 | 18075            | 72348  | 90717   |        |         |
| n=32768 | log(q)=881 | KeyGen | Secret                   | iterations:10 | 11451            | 29421  | 36442   |        |         |
| n=32768 | log(q)=881 | KeyGen | Public                   | iterations:10 | 26361            | 56594  | 158626  |        |         |
| n=32768 | log(q)=881 | KeyGen | Relin                    | iterations:10 | 386014           | 802450 | 2385523 |        |         |
| n=32768 | log(q)=881 | KeyGen | Galois                   | iterations:10 | 377254           | 797020 | 2378326 |        |         |
| n=32768 | log(q)=881 | BFV    | EncryptSecret            | iterations:10 | 32543            | 76962  | 186449  |        |         |
| n=32768 | log(q)=881 | BFV    | EncryptPublic            | iterations:10 | 42415            | 114184 | 148914  |        |         |
| n=32768 | log(q)=881 | BFV    | Decrypt                  | iterations:10 | 17333            | 58445  | 75091   |        |         |
| n=32768 | log(q)=881 | BFV    | EncodeBatch              | iterations:10 | 411              | 1252   | 1664    |        |         |
| n=32768 | log(q)=881 | BFV    | DecodeBatch              | iterations:10 | 513              | 1776   | 1830    |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateAddCt            | iterations:10 | 1847             | 5153   | 4244    |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateAddPt            | iterations:10 | 5404             | 12691  | 14776   |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateMulCt            | iterations:10 | 227627           | 807244 | 1357129 |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateMulPt            | iterations:10 | 31524            | 115310 | 134943  |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateSquare           | iterations:10 | 170213           | 609716 | 1027222 |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateModSwitchInplace | iterations:10 | 4263             | 14322  | 15895   |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateRelinInplace     | iterations:10 | 111049           | 443974 | 575684  |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateRotateRows       | iterations:10 | 112213           | 443623 | 584722  |        |         |
| n=32768 | log(q)=881 | BFV    | EvaluateRotateCols       | iterations:10 | 113158           | 447828 | 558419  |        |         |
| n=32768 | log(q)=881 | CKKS   | EncryptSecret            | iterations:10 | 24089            | 51807  | 146027  |        |         |
| n=32768 | log(q)=881 | CKKS   | EncryptPublic            | iterations:10 | 48190            | 147791 | 181788  |        |         |
| n=32768 | log(q)=881 | CKKS   | Decrypt                  | iterations:10 | 3237             | 10144  | 12763   |        |         |
| n=32768 | log(q)=881 | CKKS   | EncodeDouble             | iterations:10 | 10565            | 25808  | 33770   |        |         |
| n=32768 | log(q)=881 | CKKS   | DecodeDouble             | iterations:10 | 25892            | 75720  | 129281  |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateAddCt            | iterations:10 | 1701             | 5252   | 4061    |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateAddPt            | iterations:10 | 1150             | 2775   | 1819    |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateMulCt            | iterations:10 | 9700             | 28899  | 39094   |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateMulPt            | iterations:10 | 3303             | 12264  | 15796   |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateSquare           | iterations:10 | 6389             | 21483  | 26827   |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateRescaleInplace   | iterations:10 | 12060            | 45603  | 52907   |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateRelinInplace     | iterations:10 | 110248           | 472238 | 552677  |        |         |
| n=32768 | log(q)=881 | CKKS   | EvaluateRotate           | iterations:10 | 112866           | 544871 | 603159  |        |         |

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
  they can be very, very large when using the default `zstd` compression. User's who are
  experiencing OOM exceptions when saving `GaloisKeys` should try specifying a compression
  override such as `none` or the less performant `zlib`. Ex: `galoisKeys.save(seal.ComprModeType.zlib)`

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
