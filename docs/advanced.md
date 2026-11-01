# Advanced usage

Start with [getting started](getting-started.md). This guide covers the choices
that matter when turning that example into an application. Code snippets use
its `seal`, `context`, `keygen`, `encoder`, `encryptor`, and plaintext/ciphertext
objects.

## Choose a scheme

| Scheme | Use it for | Encoder |
| --- | --- | --- |
| BFV | Exact modular integer arithmetic. A useful starting point for integer workloads. | `BatchEncoder` |
| BGV | Exact modular integer arithmetic with different noise and modulus-switching behavior. Compare it with BFV for your multiplication-heavy workloads. | `BatchEncoder` |
| CKKS | Approximate real arithmetic, such as statistics, distances, or numerical models that tolerate a chosen error. | `CKKSEncoder` |

BFV and BGV results wrap modulo the plaintext modulus; they are not unbounded
JavaScript integers. CKKS trades exactness for real-number arithmetic and
requires a plan for precision and multiplication depth. Neither BFV nor BGV
is universally faster: benchmark the calculation with suitable parameters.

SEAL's [BFV](https://github.com/microsoft/SEAL/blob/main/native/examples/1_bfv_basics.cpp),
[BGV](https://github.com/microsoft/SEAL/blob/main/native/examples/4_bgv_basics.cpp),
and [CKKS](https://github.com/microsoft/SEAL/blob/main/native/examples/5_ckks_basics.cpp)
examples explain the arithmetic and noise/scale management.

## Plan parameters around the calculation

Parameters usually matter more than binding-level optimizations. Larger
polynomial degrees increase operation cost, memory use, and ciphertext size.
Choose them around the value ranges, multiplication depth, precision, and
security level your application needs. BFV/BGV batch up to `degree` integers;
our CKKS binding encodes up to `degree / 2` real values per ciphertext.

`CoeffModulus.BFVDefault()` is a starting point, not a planner for your program.
`context.parametersSet()` checks that the configuration is valid; it does not
prove that the calculation has enough noise budget or precision. Test the
whole calculation against cleartext results at your expected input bounds.

For automated CKKS parameter selection, see Microsoft's
[EVA compiler](https://github.com/microsoft/EVA#readme), referenced by
[SEAL's README](https://github.com/microsoft/SEAL#readme). It selects parameters
and inserts rescaling and relinearization for a program and its precision
requirements.

## Choose how to create and send objects

### Symmetric or public-key encryption

Use `encrypt()` when the sender has a public key. Use `encryptSymmetric()` when
the sender owns the secret key; it avoids the cost of public-key encryption.
Both produce ciphertexts that the same evaluator and decryptor can use.
The side performing outsourced computation needs neither encryption key to
add ciphertexts; operations such as relinearization and rotation need the
corresponding evaluation keys.

### Regular or serializable factories

| What happens next | Method to choose |
| --- | --- |
| Use a key locally | `createPublicKey()`, `createRelinKeys()`, `createGaloisKeysWithSteps()` |
| Save a key to send elsewhere | `createPublicKeySerializable()`, `createRelinKeysSerializable()`, `createGaloisKeysSerializableWithSteps()` |
| Use a ciphertext locally or reuse its storage | `encrypt(plain, destination)` or `encryptSymmetric(plain, destination)` |
| Save a secret-key ciphertext to send elsewhere | `encryptSymmetricSerializable(plain)` |

Create `Serializable*` objects through these factory methods. They expose saving
methods, and the recipient loads the bytes into a regular key or ciphertext.
For keys and symmetric ciphertexts, the seeded form saves a random seed in place
of part of the generated data. This reduces the bytes sent; loading expands it
back into the full object. Use regular factories for local work to avoid a
save/load round trip.

```javascript
using exportedKey = keygen.createPublicKeySerializable()
const keyBytes = exportedKey.saveToArray(seal.ComprModeType.zstd)

// On the recipient, with matching parameters:
using loadedPublicKey = new seal.PublicKey()
loadedPublicKey.loadFromArray(context, keyBytes)
```

On the secret-key owner's side, configure the encryptor with that key to produce
compact symmetric ciphertexts:

```javascript
encryptor.setSecretKey(secretKey)
using request = encryptor.encryptSymmetricSerializable(plain)
const symmetricBytes = request.saveToArray(seal.ComprModeType.zstd)
```

`encryptSerializable()` also supports direct saving in public-key mode, but
public-key ciphertexts do not have the seeded size reduction. SEAL's
[serialization example](https://github.com/microsoft/SEAL/blob/main/native/examples/7_serialization.cpp)
explains which objects support it.

Start with `zstd` for saved objects, and compare `none` when serialization time
matters more than size. `zlib` is also available. The Base64 methods use the same
serialization and compression modes when a string is needed.

## Reuse work and storage

| Choice | When it helps |
| --- | --- |
| Reuse the initialized module, context, keys, and helpers | Setup and key generation should happen once for a stable parameter/key set. |
| Fill batching slots | Amortize one encrypted operation over many values instead of encrypting each value separately. |
| Encode public constants once and use `addPlain` / `multiplyPlain` | Avoid encrypting values that do not need to be private. |
| Use `*Inplace()` methods | The input can become the result, avoiding a separate destination object. |
| Reuse destination objects and reserve capacity | Repeated calls can reuse their existing buffers. |
| Generate only the evaluation keys you need | Addition needs no relinearization or rotation keys. Request specific Galois steps with an `Int32Array`. |

For repeated ciphertext multiplication, keep the destination outside the loop:

```javascript
using relinKeys = keygen.createRelinKeys()
using destination = new seal.Ciphertext()

for (const encrypted of encryptedInputs) {
  evaluator.square(encrypted, destination)
  evaluator.relinearizeInplace(destination, relinKeys)
  // Consume or save destination before the next iteration overwrites it.
}
```

CKKS plaintext constants must match the level and scale of the operation. Follow
SEAL's [levels](https://github.com/microsoft/SEAL/blob/main/native/examples/3_levels.cpp)
and CKKS examples for that schedule. Measure the full pipeline, including key
setup when relevant, serialization, and steady-state computation.

The default memory pools and profiles shoud be sufficient, but the [pool reference](memory-pools.md) describes the exposed APIs.

## JavaScript inputs

| API | Input |
| --- | --- |
| `BatchEncoder.encode()` | `BigInt64Array` or `BigUint64Array` |
| `CKKSEncoder.encode()` | `Float64Array` |
| `CoeffModulus.Create()`, Galois-key step factories | `Int32Array` |
| `loadFromArray()` | `Uint8Array` |

Use `bigint` for modulus values and other 64-bit integers. Sizes and rotation
steps use `number`. `CoeffModulus.Create()` returns `VectorModulus`;
`modulusValues(vector)` extracts `bigint[]`, and `modulusVectorFromArray(moduli)`
builds a vector from `Modulus[]`.

CKKS values and scales must be finite. Encoding rejects `NaN` and infinities
before arithmetic begins.

## Object lifetime

Emscripten supports finalizers, but our generated runtime attaches them only to
smart-pointer-backed handles, with cleanup scheduled by the garbage collector.
Ordinary constructors such as `Plaintext`,
`Ciphertext`, and keys are not covered. Garbage collection alone will not release
those native objects. See [Embind's memory-management documentation](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management).

Use `using` to release native handles at scope exit. Where `using` is unavailable,
call `.delete()` in `finally`. Returned handles, including getters, need cleanup
too; a function returning a native handle leaves cleanup to its caller.
Decoded arrays and saved bytes are JS-owned and need no native cleanup.

In hot loops, reuse destinations and reserve capacity rather than repeatedly
constructing objects. Cleanup and reuse make storage available inside the Wasm
heap; they do not shrink its linear memory.

`.clone()` shares the same native object; `.copy()` creates an independent copy
where available, and `.assign()` reuses an existing destination. Keep mutable
plaintexts and ciphertexts local when requests can interleave across `await` calls.

## Wasm deployment

If your bundler relocates the Wasm file, point the loader at its served location:

```javascript
const seal = await SEAL({
  locateFile: file => `/wasm/${file}`
})
```

Keep the JS module and the selected `seal_throws.wasm` or `seal_allows.wasm`
binary from the same release.

## Native errors

C++ failures throw `WebAssembly.Exception`. Its `.message` contains
`[type, description]`, such as `['std::invalid_argument', 'expected Uint8Array']`.
Handle that shape when logging errors or wrapping them in an application error.
