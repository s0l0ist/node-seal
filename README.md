# [node-seal](https://github.com/s0l0ist/node-seal)

[![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_shield&issueType=license)

Homomorphic encryption for TypeScript and JavaScript, powered by Microsoft SEAL
**4.7.2** and WebAssembly. Compute on encrypted data, then decrypt the result
with the secret key.

## Install

```sh
npm install node-seal
```

## Quick start

This doubles three encrypted integers using BFV:

```javascript
import SEAL from 'node-seal'

const seal = await SEAL()
const degree = 4096
const security = seal.SecLevelType.tc128

using parameters = new seal.EncryptionParameters(seal.SchemeType.bfv)
using coeffModulus = seal.CoeffModulus.BFVDefault(degree, security)
using plainModulus = seal.PlainModulus.Batching(degree, 20)
parameters.setPolyModulusDegree(degree)
parameters.setCoeffModulus(coeffModulus)
parameters.setPlainModulus(plainModulus)
using context = new seal.SEALContext(parameters, true, security)
if (!context.parametersSet()) {
  throw new Error(context.parameterErrorMessage())
}

using keygen = new seal.KeyGenerator(context)
using publicKey = keygen.createPublicKey()
using secretKey = keygen.secretKey()
using encoder = new seal.BatchEncoder(context)
using encryptor = new seal.Encryptor(context, publicKey)
using evaluator = new seal.Evaluator(context)
using decryptor = new seal.Decryptor(context, secretKey)

using plain = new seal.Plaintext()
using cipher = new seal.Ciphertext()
encoder.encode(BigInt64Array.from([1n, 2n, 3n]), plain)
encryptor.encrypt(plain, cipher)
evaluator.addInplace(cipher, cipher)
decryptor.decrypt(cipher, plain)
console.log(Array.from(encoder.decodeBigInt64(plain).slice(0, 3)))
// [2n, 4n, 6n]
```

The examples use `using` to release native objects at scope exit. See
[object lifetime](docs/advanced.md#object-lifetime) for cleanup details.
Initialize once and reuse the SEAL instance.

## Guides

- [Getting started](docs/getting-started.md): encrypt, serialize, compute, and
  decrypt a result.
- [Advanced usage](docs/advanced.md): schemes, parameters, key generation,
  compact serialization, and performance choices.

## Runtime

The package includes ES modules, Wasm binaries, and TypeScript declarations.
The runtime needs WebAssembly exception handling and BigInt typed arrays.
For bundlers that relocate the Wasm file, see
[Wasm deployment](docs/advanced.md#wasm-deployment).

`node-seal` and `node-seal/throws` reject transparent ciphertext results.
Use `node-seal/allows` when your calculation needs those results, such as
subtracting a ciphertext from itself. Both variants expose the same API.

## Reference

- [Bindings](https://github.com/s0l0ist/SEAL/tree/main/native/src/seal/bindings)
  and [tests](src/__tests__) cover the available API.
- [Microsoft SEAL examples](https://github.com/microsoft/SEAL/tree/main/native/examples)
  explain the underlying library. Some C++ overloads are not available here.
- [Contributing](CONTRIBUTING.md) and [release notes](CHANGES.md).

## License

[MIT](LICENSE).

[![FOSSA
Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs0l0ist%2Fnode-seal?ref=badge_large&issueType=license)
