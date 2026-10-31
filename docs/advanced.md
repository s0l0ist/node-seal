# Advanced JavaScript usage

Start with the [basic example](getting-started.md). For parameter selection,
levels, scales, and rotations, see the
[Microsoft SEAL examples](https://github.com/microsoft/SEAL/tree/main/native/examples).

## Typed arrays

| API                                                    | JavaScript input                    |
| ------------------------------------------------------ | ----------------------------------- |
| `BatchEncoder.encode()`                                | `BigInt64Array` or `BigUint64Array` |
| `CKKSEncoder.encode()`                                 | `Float64Array`                      |
| `CoeffModulus.Create()`, `createGaloisKeysWithSteps()` | `Int32Array`                        |
| `loadFromArray()`                                      | `Uint8Array`                        |

Use `bigint` for modulus values and other 64-bit integers. Sizes and rotation
steps use `number`.

Encoding and loading copy data into Wasm. Decoded and saved arrays are independent
JS copies, so they remain usable after the source handle is deleted.

`loadFromArray()` checks the array type. Wrap a Node.js `Buffer` before passing it:

```javascript
const bytes = new Uint8Array(
  buffer.buffer,
  buffer.byteOffset,
  buffer.byteLength
)
```

## Object lifetime

Objects such as `Plaintext` and `Ciphertext` need explicit cleanup. Use `using`
in runtimes that support it and `Symbol.dispose`. With an existing encoder and
decryptor:

```javascript
function decryptValues(cipher) {
  using plain = new seal.Plaintext()
  decryptor.decrypt(cipher, plain)
  return encoder.decodeBigInt64(plain)
}
```

The returned array survives cleanup. If you return a native handle instead,
leave its cleanup to the caller; a local `using` would delete it on return.
Without `using`, call `.delete()` in `finally`.

Returned handles, including getters, need cleanup too. `.clone()` creates
another handle to the same native object; `.copy()` creates an independent copy
where available. `.assign()` lets you reuse an existing destination.

Reuse contexts, keys, encoders, and evaluators across calls. Keep mutable
plaintexts and ciphertexts local to each request when work can interleave across
`await` calls.

## Saving and loading

Save objects before sending them to another process or runtime:

```javascript
const bytes = cipher.saveToArray(seal.ComprModeType.zstd)
using loaded = new seal.Ciphertext()
loaded.loadFromArray(context, bytes)
```

`saveToBase64()` and `loadFromBase64()` provide the string form. Saving requires
a compression mode: `none`, `zlib`, or `zstd`.

`Serializable*` factory results expose saving methods. Save them, then load into
a regular key or ciphertext before evaluation.

## Workers

Initialization is asynchronous, but encryption and evaluation calls are
synchronous. Move long jobs to a Web Worker or Node.js `worker_threads` worker
to keep them off the main thread.

Initialize SEAL inside the worker and load the same parameters there. Native
handles belong to the instance that created them. Send saved bytes between
instances:

```javascript
const bytes = cipher.saveToArray(seal.ComprModeType.zstd)
worker.postMessage(bytes, [bytes.buffer])
```

The saved array owns its buffer, so it can be transferred without another JS
copy. Transferring detaches the sender's array. Load it into a ciphertext using
the worker's context.

## Wasm deployment

If your bundler moves the Wasm file, point the loader at its served location:

```javascript
const seal = await SEAL({
  locateFile: file => `/wasm/${file}`
})
```

Serve `seal_throws.wasm` or `seal_allows.wasm` for the selected variant. Keep
the JS module and Wasm binary from the same release.

## Native errors

C++ failures throw `WebAssembly.Exception`, whose `.message` contains
`[type, description]`, such as `['std::invalid_argument', 'expected Uint8Array']`.
Account for this when logging errors or wrapping them in an application error.

## Memory and context data

Most applications can keep the default memory pool. See [memory pools](memory-pools.md)
for scoped allocations and profile switching in JavaScript, and
[context data](context-data.md) for the return types and cleanup of low-level accessors.
