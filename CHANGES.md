# List of Changes

See [Microsoft's Change log](https://github.com/microsoft/SEAL/blob/master/CHANGES.md)
for more details on each SEAL version change.

## Version 5.1.6

Feat:

- Support CloudFlare workers, thanks @xtuc!

Chore:

- Updated all build dependencies
- Compiling with EMSDK (v4.0.9)

## Version 5.1.5

Chore:

- Updated all build dependencies
- Compiling with EMSDK (v4.0.6) results in a noticable speedup from the previous build.
- Updated benchmarks and added the `Bun` runtime.

## Version 5.1.4

Feat:

- Updated to SEAL 4.1.2

Chore:

- Updated all dev dependencies
- Removed mentions of morfix-io in URL links as it doesn't exist anymore
- Updated import ordering in all source files (no functional changes)
- Moved .eslintrc.js to .eslint.config.js
- Updated github workflow deps

## Version 5.1.3

Chore:

- Updated new links to Github pages and republish for npm to also have the updated links. No functional changes.

## Version 5.1.2

Chore:

- Updated all dev dependencies
- Updated GHA runners to use Node v20 LTS (Iron)

Fix:

- Updated a test's return value that changed when using the latest emscripten SDK.

Breaking:

- Removed support for the pure JS build. Most modern JS environments use the
  WASM variant and this particular build was incredibly slow and did not support memory over 2GB when invoking wasm2js

## Version 5.1.1

Feat:

- Updated to SEAL 4.1.1

## Version 5.1.0

Feat:

- Updated to SEAL 4.1.0
- Added new bindings for `modReduceTo` and `modReduceToNext`.
- `addPlain` and `subPlain` now take an optional memory pool parameter (defaults
  to global). This is a non-breaking change.

## Version 5.0.0

Feat:

- Updated to SEAL 4.0.0
- Added tests for the new `BGV` scheme type
- Added missing public getter `EncryptionParameters.paramsId`

## Version 4.6.4

Feat:

- Updated to SEAL 3.7.3

## Version 4.6.3

Feat:

- Updated dev deps
- Changed the emsdk submodule to use the upstream repository
- Add `.Version` to `node-seal` to get the npm package version at runtime
- Updated to include latest MS Seal commits

## Version 4.6.2

Feat:

- Upgrade to seal v3.7.2
- Upgrade emsdk

## Version 4.6.1

Feat:

- Upgrade to seal v3.7.1
- Upgrade emsdk
- Upgrade JS dev deps

## Version 4.6.0

Feat:

- Upgrade to seal v3.7.0
- Upgrade emsdk
- Upgrade JS dev deps
- eslint/prettier reformat
- Added TS SealError type

## Version 4.5.7

Feat:

- Upgrade to seal v3.6.6
- Upgrade emsdk
- Upgrade JS dev deps

## Version 4.5.6

Feat:

- Upgrade to seal v3.6.5

Docs:

- Update to clarify React-Native support

## Version 4.5.5

Feat:

- Upgrade to seal v3.6.4

## Version 4.5.4

Feat:

- Upgrade to seal v3.6.3

## Version 4.5.3

Feat:

- Upgrade to seal v3.6.2

## Version 4.5.2

Feat:

- Upgrade to seal v3.6.1 to address zstd memory bug.

## Version 4.5.1

Feat:

- Increase maximum memory for WASM to be 4gb instead of the default 2gb. This will be beneficial to applications where the VM can handle WASM memory size larger than 2gb such as NodeJS and Chrome.
- Docs have been updated and reflect the proper functions for the KeyGenerator type.

## Version 4.5.0

### Highlights

- Updated to **SEAL v3.6.0** (See [Microsoft's Change log](https://github.com/microsoft/SEAL/blob/master/CHANGES.md))

Feat:

- Renamed all key generator functions to match the new MS API.
  - `publicKey` -> `createPublicKey`
  - `relinKeysLocal` -> `createRelinKeys`
  - `galoisKeysLocal` -> `createGaloisKeys`
- Added `*Serializable` functions to match the new MS API overloads.
  - `createPublicKeySerializable`
  - `createRelinKeysSerializable`
  - `createGaloisKeysSerializable`
- Added the evaulator function, `encryptSerializable`, as well as two missing functions `encryptZero`, `encryptZeroSerializable`.
- All enum types (scheme type, compression mode) have been made lower case. Ex: `SchemeType.BFV` -> `SchemeType.bfv`
- Added a new compression mode type to support zstandard `ComprModeType.zstd` which is used by default. This version can decompress previous serialized objects (using `deflate`), but all new serialized objects will use `zstd`.
- Removed the `IntegerEncoder`.

## Version 4.4.2

Fix:

- Consolidate type definitions for deno

## Version 4.4.1

Feat:

- Add bundle suffix to builds for `umd`
- New bundle for `es` for support. ex: `throws_wasm_node_es`

Breaking:

- Importing/Requiring syntax has changed from `import SEAL from 'node-seal/throws_wasm_node'` => `import SEAL from 'node-seal/throws_wasm_node_umd'`.

## Version 4.4.0

### Highlights

- Updated the entire library to TypeScript which fixed numerous inconsistencies
- Added support for more builds:
  - [`allows`, `throws`] each with [`js`, `wasm`] each with [`node`, `web`, `worker`] builds
- Support for WebAssembly in React Native
- More consistencies with 64-bit types using `BigInt`

Feat:

- Supporting Seal v3.5.9
- `Context` can be created with only the `EncryptionParameters`. By default, it will set expandModulus = `true`, security = `tc128`.
- `SecretKey.save()` now uses compression (`deflate`) by default
- `ParmsIdType.values()` returns a `BigUint64Array` containing the underlying values
- `PlainModulus.Batching()` returns a `Modulus` type instead of the raw WASM instance
- `Modulus` supports constructing with a `BigInt`
- `Modulus.setValue()` accepts a `BigInt`

Breaking

- Importing/Requiring syntax has changed from `import { Seal } from 'node-seal/dist/throws_transparent/node/wasm/cjs'` => `import SEAL from 'node-seal/throws_wasm_node'`. You may use any default name.

## Version 4.3.10

Feat:

- Updated to Seal v3.5.8 (v3.5.7 skipped because of a bug)
- Updated emsdk to latest

## Version 4.3.9

Feat:

- Added `setScale` function to allow users to manually set the scale on either PlainTexts or CipherTexts
- Updated emsdk to lastest

## Version 4.3.8

Feat:

- Updated to Seal v3.5.6
- Updated emsdk to latest

## Version 4.3.7

Feat:

- Changed the deep import links to account for additional builds that do _not_ throw on transparent ciphertexts

## Version 4.3.6

This release now supports true 64-bit numbers with the BFV scheme leveraging BigInt.
However, there is a performance penalty marshaling data to and from (encoding/decoding)
JS <-> WASM as they are not natively supported.

Feat:

- Updated to Seal v3.5.5 (hotfix)
- Modified `BatchEncoder.encode` to also accept `BigInt64Array`/`BigUint64Array` types
- Added a new function `BatchEncoder.decodeBigInt` for support of 64-bit values using BigInt

## Version 4.3.5

Feat:

- Updated to Seal v3.5.5

## Version 4.3.4

Feat:

- Updated to Seal v3.5.4

## Version 4.3.2

Fix:

- Updated to support building with the latest emsdk

Feat:

- Updated to Seal v3.5.3

## Version 4.3.1

Chore:

- Updated to lastest emscripten version and rebuilt.
- Added another optimization flag to the build process.

## Version 4.3.0

Feat:

- Upgraded to [SEAL v3.5.1](https://github.com/microsoft/SEAL/blob/master/CHANGES.md)
- Removed submodule and scripts for `zlib` as this is now contained within SEAL.
- The seeded versions of Encryptor's symmetric-key encryption and KeyGenerator's RelinKeys and GaloisKeys generation now output Serializable objects. See more details in the [MS SEAL API Changes](https://github.com/microsoft/SEAL/blob/master/CHANGES.md).
- `SmallModulus` has been renamed to `Modulus`.
- `Ciphertext.coeffModCount` has been renamed to `Ciphertext.coeffModulusSize`.
- Renamed KeyGenerator.[get|gen]\* functions to their original C++ names. Ex: `KeyGenerator.getPublicKey()` -> `KeyGenerator.publicKey()`, `KeyGenerator.genRelinKeys()` -> `KeyGenerator.relinKeys()`.
- KeyGenerator now may only be instantiated with a `SecretKey`.
- `parametersSet` is now a function (`parametersSet()`) instead of a getter property for `Context` and `EncryptionParameterQualifiers` instances.
- `Encryptor.encryptSymmetricSerializable` outputs a `Serializable` object for a `CipherText`. This new object cannot be used directly, but instead provides 50% space savings and is meant to be used when serialized over a network where the receiver would deserialize and use it accordingly.

## Version 4.2.4

Chore:

- Updated to lastest emscripten version and rebuilt.

Fix:

- Moved all builds into `dist` directory. User's need to update their import path if using the deep import links.
  ex: `import { Seal } from 'node-seal/dist/node/wasm' // Specifies the WASM build for NodeJS`

## Version 4.2.3

Feat:

- Added optional `steps` argument to `galoisKeys`. You can now specify the rotations you need to reduce
  the size of GaloisKeys and the time it takes to generate them. Ex: you only need specific keys when performing
  `sumElements` or `dotProduct`.
- Added `galoisSave` function to the `KeyGenerator`. Allows direct serialization of Galois Keys leveraging the seeded
  compression which saves 50% of space. This method also accepts an optional `steps` array for further optimization.
- Added support for symmetric encryption using `Evaluator.encryptSymmetric`.

## Version 4.2.2

Fix:

- JS build was crashing due to OOM when using higher encryption parameters. The build now allows for memory growth.

## Version 4.2.1

Feat:

- Added `dotProductPlain` which is the same as `dotProduct` except with a `PlainText` for the second parameter.

## Version 4.2.0

Breaking:

- Minor breaking change to allow for functional closure.
  ```javascript
  import { Seal } from 'node-seal'
  ...
  const morfix = await Seal // Deprecated
  const morfix = await Seal() // Use the parenthesis
  ```

Feat:

- Added default export.
- Added to specify a specific import for a given environment. The pure JS variant is only useful for environments which do not
  support Web Assembly, such as React Native. Where possible, use the WASM variant (included by default) as the JS
  version is noticeably slower (10-60x). Ex:

  ```javascript
  import { Seal } from 'node-seal' // Auto-detects browser or nodejs, defaults to WASM build

  // Manually specify a build
  import { Seal } from 'node-seal/node/wasm' // Specifies the WASM build for NodeJS
  import { Seal } from 'node-seal/node/js' // Specifies the JS build for NodeJS
  import { Seal } from 'node-seal/web/wasm' // Specifies the WASM build for the browser
  import { Seal } from 'node-seal/web/js' // Specifies the JS build for the browser
  ```

## Version 4.1.5

Feat:

- Added `saveArray` and `loadArray` functions to all serializable components. These methods allow the objects to save
  and load from a Uint8Array containing binary data.

## Version 4.1.4

Feat:

- Increased performance roughly by **30%**. Disabled seal intrinsics inside cmake script. This was defining an
  optimization which was actually performing worse when compiled to web assembly.

## Version 4.1.3

Feat:

- Added default values for the security level inside `CoeffModulus.BFVDefault`.
- Removed benchmarks from npm dist to avoid bloat. To run benchmarks will require to clone the repo.

Fix:

- Memory leak inside benchmarks

## Version 4.1.2

Fix:

- Added benchmarks to npm package

## Version 4.1.1

Feat:

- Added constructor overload options to both cipher and plain texts. These help in optimization cases.
- Code coverage unit tests at 100%

Refactor:

- Complete refactor of the code structure to allow for code coverage
- Removed underutilized `Util` export for functional composition.
- Removed print methods for `Vector` as these were used for internal debugging only.
- Renamed `context.print` to `toHuman` which now returns a string instead of printing to
  the console.
- Optimized code by removed unnecessary checks for exceptions.

## Version 4.1.0

Breaking:

- `CipherText.reserve` now requires two arguments to be provided, `context, sizeCapacity`. This is because reserving
  memory before data is encrypted into the cipher instance will have no effect. Due to current constructor limitations
  , this is the only way to preemptively reserve memory for a cipher.

Feat:

- `applyGalois` is now supported!
- `GaloisKeys` has two new methods: `getIndex`, `hasKey`.
- `RelinKeys` has two new methods: `getIndex`, `hasKey`.
- `SmallModulus` has a `load` method which takes in a base64 string produces from `save`

Fix:

- `cipherTransformFromNtt` was calling the wrong method when destination parameter was not supplied.
- `decode` in the batch encoder is now wrapped with the WASM error handler.
- `PlainText.resize` now actually resizes to the specified value

Chore:

- Unit tests have been made for all objects.

## Version 4.0.3

Fix:

- `ContextData.parms` was throwing an exception when attempting to access this parameter.
- `SmallModulus.setValue` now properly sets the value by passing a string representing
  a 64-bit integer.
- `SmallModulus` constructor now accepts a string representing a 64-bit integer as a constructor
- **Internal** changes to some WASM constructors to use the 'move' constructor overload as opposed to 'copy'.
- `PlainModulus.Batching` now returns a wrapped instance of `SmallModulus`
- You may now pass in a specific `SmallModulus` into `parms.setPlainModulus(Morfix.SmallModulus('786433'))` in addition to
  generating one using `PlainModulus.Batching(...)`. This string argument is converted to a 64-bit unsigned integer
  for the C++ method to consume.

Feat:

- Added benchmark script in the [benchmark](benchmark) folder. More will be added in the near future.

## Version 4.0.2

Feat:

- Added `copy`, `clone` and `move` instance methods to `CipherTexts`, `PlainTexts`, and all variants of `Keys`.

  - Instead of assignment by reference in JS, use the new methods (this goes for all variables and key types)
  - Examples can be found in the docs. For example, the [CipherText Docs](https://s0l0ist.github.io/node-seal/CipherText.html)

  ```javascript
  const cipherText = Morfix.CipherText()
  // ... after some data has been encrypted...

  // Naïve assignment
  // This newCipherText.instance will be a reference to the cipherText.instance, which may not be desirable.
  // If cipherText.delete() is called, then newCipherText.instance will also be `null`.
  const newCipherText = cipherText

  // Ex: `clone` generates a new CipherText containing the cloned instance
  // copyCipherText.instance is now an exact clone of cipherText.instance.
  // If cipherText.delete() is called, it will have no effect on newCipherText.instance and vice versa.
  const cloneCipherText = cipherText.clone()

  // Ex: `copy` copies an existing CipherText and overwrites its own internal instance.
  // copyCipherText.instance is now a copy of cipherText.instance.
  // If cipherText.delete() is called, it will have no effect on newCipherText.instance and vice versa.
  const copyCipherText = Morfix.CipherText()
  copyCipherText.copy(cipherText)

  // Ex: `move` moves an existing CipherText and overwites its own internal instance, but sets the old one to null.
  // cipherText.instance has been moved to moveCipherText.instance and cipherText.instance is now null.
  const moveCipherText = Morfix.CipherText()
  moveCipherText.move(cipherText)
  ```

- Added `size` getter to `CipherTexts` and `PlainTexts`.
- Added new method `evaluator.dotProduct` for obtaining the dot product of two `CipherTexts`. The result contains the
  sum inside every slot of the vector.
  ```javascript
  // pseudo code
  // CipherText (cipherA) contains the following encrypted values: [1, 2, 3, 4, 0, ..., 0]
  // CipherText (cipherB) contains the following encrypted values: [5, 5, 5, 5, 0, ..., 0]
  const dot = evaluator.dotProduct(
    cipherA,
    cipherB,
    relinKeys,
    galoisKeys,
    SchemeType.BFV
  )
  // dot is a CipherText containing the encrypted result of [50, 50, 50, 50, 50, ..., 50]
  ```
- Added new method `evaluator.sumElements` for obtaining the sum of all elements in a `CipherText`. The result
  contains the sum inside every slot of the vector.
  ```javascript
  // pseudo code
  // say some CipherText (cipher) contains the following encrypted values: [1, 2, 3, 4, 0, ..., 0]
  const sum = evaluator.sumElements(cipher, galoisKeys, SchemeType.BFV)
  // sum is a CipherText containing the encrypted result of [10, 10, 10, 10, 10, ..., 10]
  ```
- Added wasm type checking when using private `inject` methods to help reduce development bugs. Renamed a few
  dangerous methods as `unsafeInject` which don't check for type binding.
- Added overload checks to perform safe construction if the `instance` overload is used to all objects. This
  catches cases of injecting the wrong instance type. This comes at a tiny performance cost since it internally
  performs a copy or in some cases a move, but ensures type safety.

Chore:

- Removed unused encode/decode functions which operated on deprecated vectors.
- Updated emsdk to latest version and rebuilt.

## Version 4.0.1

Hotfix:

- Generating key instances were broken for some keys

## Version 4.0.0

This library aims at being easier to use. To meet this goal, there had to be some significant changes
in the way components are used. The most notable is a complete refactor of all components to not use
object destructuring for their arguments. This change allows for the composition of specialized functions
that are easier to understand and test - all with less code.

Ultimately, `Vectors` had to die. They were an abstraction on top of the TypedArrays
in the JS world to WebAssembly, but had no significant use-case outside. Therefore,
they have been removed and are instead used internally.

Instead of processing separate `encode -> encrypt` and `decrypt -> decode` actions,
we can compose a higher-order function which performs both transparently using a `pipe` function
from our `Utils` provider.

```javascript
import { Seal, Utils } from 'node-seal'
const Morfix = await Seal

// Parameters
const schemeType = Morfix.SchemeType.BFV
const securityLevel = Morfix.SecurityLevel.tc128
const polyModulusDegree = 4096
const bitSizes = [36,36,37]
const bitSize = 20
...
```

Create curried functions. In this case we have created functions which take
the one argument and returns a function that accepts the second argument. This
converts the n-ary functions into the unary function form which allows us to use them
with `pipe` much more clearly.

```javascript
import { Utils } from 'node-seal'
const { pipe } = Utils
const curriedEncode =
  (dest = null) =>
  array =>
    encoder.encode(array, dest)
const curriedEncrypt =
  (dest = null) =>
  plain =>
    encryptor.encrypt(plain, dest)
const curriedDecrypt =
  (dest = null) =>
  cipher =>
    decryptor.decrypt(cipher, dest)
const curriedDecode =
  (sign = true) =>
  plain =>
    encoder.decode(plain, sign)
```

Create partial applications. Curried functions allow us to construct specific
functions by partially applying arguments.

```javascript
const encodeNoDest = curriedEncode(null)
const encryptNoDest = curriedEncode(null)
const decryptNoDest = curriedEncode(null)
const decodeSigned = curriedEncode(true)
```

`pipe` essentially runs the first argument and 'pipes' its
returned value into the input of the next argument and so on.

```javascript
const encodeEncrypt = pipe(encodeNoDest, encryptNoDest)
const decryptDecode = pipe(decryptNoDest, decodeSigned)
```

An equivalent way to write these functions without pipe would be:

```javascript
const encodeEncrypt = array => encryptNoDest(encodeNoDest(array))
const decryptDecode = cipher => decodeSigned(decryptNoDest(cipher))
```

With `encodeEncrypt`, data can be immediately turned from a TypedArray to a cipher without
needing to manually encode. Similarly, `decryptDecode` accepts a cipher
and returns a TypedArray containing the results.

```javascript
const cipherText = encodeEncrypt(Int32Array.from([1, 2, -3]))
const result = decryptDecode(cipherText)

// Will have a length of polyModulusDegree (if BFV) _or_ polyModulusDegree / 2 (if CKKS)
// result = Int32Array([1,2,-3, 0, 0, ...])
```

Breaking:

- All functions which used to take an argument with an object containing named parameters have been
  replaced with just their named parameters. Ex: `instance.function({ param1, param2 })` have now
  become `instance.function(param1, param2)`.
- `Vector` is now _private_ for use inside this library. Any public use of a `Vector` will throw.

Feat:

- New utility methods are exposed for convenience to assist in functional programing.
  ```javascript
  import { Utils } from 'node-seal'
  const { Utils } = require('node-seal')
  ```
- Several internal functions have been rewritten for clarity. Should be transparent to the user.
- All evaluator methods accept an optional destination parameter. If one is supplied, the evaluation's
  result well be stored there. Otherwise, a new variable containing the result will be returned. Ex:

  ```javascript
  // With optional destination
  const destinationCipher = Morfix.CipherText()
  evaluator.add(cipherTextA, cipherTextB, destinationCipher)`

  // Without destination
  const resultCipher = evaluator.add(cipherTextA, cipherTextB)

  // destinationCipher and resultCipher contain the same encrypted result
  ```

## Version 3.2.4

Chore:

- Updated to latest emsdk, rebuilt

## Version 3.2.3

Feat:

- Added bindings for PlainText methods `reserve`, `resize`, and `release`.
- Added bindings for CipherText methods `reserve`, `resize`, and `release`.

Fix:

- Missing binding for method `PlainText.setZero` has now been fixed

## Version 3.2.2

Fix:

- Both `BatchEncoder` and `CKKSEncoder` methods for `decode` have been re-written to
  use vectors internally to prevent possible data loss on memory views when a C++
  object gets dereferenced.

## Version 3.2.1

Feat:

- `Encryptor.encrypt`/`Decryptor.decrypt` now accept optional cipherText and plainText
  parameters, respectively. If provided, the methods will modify in place and return void.
  Otherwise, the methods will return a new instance of cipherText and plainText, respectively.

## Version 3.2.0

Feat:

- No more dealing with `Vector` types! All methods now accept a valid
  TypedArray as a parameter or return one where applicable

Deprecated:

- In `BatchEncode`, replace `encodeVectorInt32`, `encodeVectorUInt32` with `BatchEncode.encode` using a TypedArray
- In `BatchEncode`, replace `decodeVectorInt32`, `decodeVectorUInt32` with `BatchEncode.decode`. This method returns
  a either an Int32Array or Uint32Array with the results.
- In `CKKSEncode`, replace `decodeVectorDouble` with `CKKSEncode.decode`. This method returns
  a Float64Array with the results.
- Creating a `Vector` is now obsolete, however it is still available.
- `CoeffModulus.Create` now accepts `bitSizes` as an Int32Array in addition to the legacy Vector type.

## Version 3.1.1

Some methods now accept optional parameters and if omitted,
will return an instance for you. This change allows more compact
syntax.

Feat:

- `BatchEncoder.encoder` returns a `PlainText` if one is not specified in the arguments.
- `CKKSEncoder.encoder` returns a `PlainText` if one is not specified in the arguments.
- `Encryptor.encrypt` returns a `CipherText` if one is not specified in the arguments.
- `Decryptor.decrypt` returns a `PlainText` if one is not specified in the arguments.

## Version 3.1.0

Fix:

- `Context.getContextData({ parmsId })` now returns an instance of `ContextData`
- `Context.keyContextData` now returns an instance of `ContextData`
- `Context.firstContextData` now returns an instance of `ContextData`
- `Context.lastContextData` now returns an instance of `ContextData`
- `EncryptionParameters.plainModulus` now returns a wrapped instance of `SmallModulus` instead of the raw WASM instance.
- `EncryptionParameters.coeffModulus` returns an array of BigInts containing the primes instead of an overly complex
  `vector<SmallModulus>` which had no direct methods to extract the internal values and was therefore useless.

Feat:

- Added `ContextData` binding which can be used for inspecting a `Context` information in greater detail.
- Added `EncryptionParameterQualifiers` binding to be used for advanced debugging.

Breaking:

- `SmallModulus.value` now returns a BigInt containing the value stored inside
  the instance instead of a string.

## Version 3.0.6

Fix:

- Added missing ParmsIdType binding which allows for `parmsId` to be passed
  into all related methods correctly without throwing an unbound type exception.
- ParmsIdType has an instance method which returns an array of bigints for
  read-only inspection.

Chore:

- Updated to the latest release of emsdk version (1.39.6) and rebuilt dist.
  This has removed some build warnings in seal:build and introduced
  harmless others during seal:make.

## Version 3.0.5

Chore:

- Updated to the latest release of emsdk version (1.39.5) and rebuilt dist

## Version 3.0.4

Fix:

- IntegerEncoder:

  C++ Binding encode now uses the method which accepts a destination
  plaintext as a parameter and returns void.

  The respective JavaScript wrapper now returns the result of decode.

## Version 3.0.3

Fix:

- Latest bundle for npm was not built correctly. Rebuilt with exception handling
  and the other changes.

## Version 3.0.2

Feat:

- Added `delete` method to applicable components. This method should
  be called before dereferencing a JavaScript component. This is
  because there is no way to automatically call the destructors
  on C++ objects.

## Version 3.0.1

No updates to core library functionality.

Chore:

- Removed unnecessary files from the packed distribution.
  Size is now ~2MB for both Node.js and browser versions
  instead of ~20MB.
- Removed use of 'new' keyword for all objects.

Docs:

- Updated documentation

## Version 3.0.0

Feat:

- All functions will throw nicely. Previously, if the WASM threw an exception you had to
  manually invoke `Seal.Exception.getHuman()` to obtain the human readable string. This is
  now done automatically.
- Slight reduction in code size due to the major refactoring.

Refactor:

- Library is now written with no `classes` - now using object composition, making it much easier
  to extend in the future.
- All tests use the low level API and can now be viewed as examples.

Breaking:

- Morfix high level APIs are no longer present as they would fail upon more complex
  functions and ultimately because they didn't ease the burden of learning SEAL.

## Version 2.2.2

Feat:

- Replaced the previous base64 implementation
- Saving/loading from strings is now much faster

## Version 2.2.1

Feat:

- Compiled with intrinsics (wasm_simd128.h)
- Code execution should be noticeably faster (no benchmarks, yet)

## Version 2.2.0

Microsoft SEAL 3.4.5

Feat:

- Supporting [zlib](https://github.com/madler/zlib) - `deflate` is by default enabled.
- SecretKeys will be saved with no compression for security. This can be overridden.

## Version 2.1.14

Microsoft SEAL 3.4.5

No updates to core library functionality.

## Version 2.1.13

Feat:

- Upgraded emscripten to LLVM backend
- Code size is now ~10% smaller

## Version 2.1.12

Refactor:

- Library initialization is now slightly faster as it is done on callback instead of a timer checking a ready state

Chore:

- Updated emsdk toolchain to be on the latest version
- Build scripts now build a static SEAL library which is then converted to JS
- Build scripts now include an additional argument to remove `import.meta.url` from the output build from webpack

## Version 2.1.11

Refactor:

- Moved all emscripten dependent code that was added to Microsoft SEAL to bindings.cpp. This cleans up the codebase and
  leaves the SEAL library left untouched for future upstream merges.

Fix:

- Encryption Parameters loading/saving methods are now instance methods instead of static. Should not affect any
  users since we use an adapter class.

## Version 2.1.10

Chore:

- removed unused code that we aren't supporting for now (int64, complex double, etc)

## Version 2.1.9

Refactor:

- Renamed emscripten binding method to reflect previous change for the Exponentiate method that uses cast uint32_t
- Fixed a bug when passing in more than 2 parameters to `cipherTransformToNtt`

## Version 2.1.8

Refactor:

- Exponentiate method accepts an `exponent` as a uint32_t which is then cast to a uint64_t to be compatible
  with the native implementation. Reasonable exponentiations shouldn't exceede 2^32 in realistic use-cases.

## Version 2.1.7

Refactor:

- Conversion from JS TypedArrays and C++ Vectors (and vice versa) are now an order of magnitude faster
- Added `shrinkToFit` and `setZero` to PlainText
- Removed unused methods for the encoders which we do not support now (Int64, etc)
- Added `sizeCapacity` method to CipherText

## Version 2.1.6

Bugfix:

- `delete` method to prevent memory leak when objects are created with `inject` methods.

## Version 2.1.5

Added an Exception class to retrieve the human readable exception string thrown from emscripen.

## Version 2.1.4

Microsoft SEAL 3.4.4

No updates to core library functionality.

## Version 2.1.3

Microsoft SEAL 3.4.3

## Version 2.1.2

Microsoft SEAL 3.4.2

## Version 2.1.1

Microsoft SEAL 3.4.1

## Version 2.1.0

Microsoft SEAL 3.4.0

## Version 2.0.4

Microsoft SEAL 3.3.4

## Version 2.0.3

Microsoft SEAL 3.3.3

## Version 2.0.2

Microsoft SEAL 3.3.2

## Version 2.0.1

Microsoft SEAL 3.3.1

## Version 2.0.0

Microsoft SEAL 3.3.0

### Features

This version includes a core update to version 3.3.0 of Microsoft SEAL in web assembly.

### API Changes

There is now an exposed low level API in web assembly which can be found in [src/lib/Seal.js](src/lib/Seal.js).
This can be used by more advanced users who wish to be as close to the original library as
possible without much abstraction.
