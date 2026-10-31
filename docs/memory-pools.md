# Memory pools in JavaScript

Keep the default pool unless profiling shows a reason to change it. Reuse
contexts and keys, and check handle cleanup first.

## Pass a pool explicitly

Use the pool factories for object storage and evaluator `WithPool` methods for
temporary allocations. With an existing evaluator, ciphertext, and keys:

```javascript
using storagePool = seal.MemoryPoolHandle.New(false)
using plain = seal.Plaintext.withCoeffCountAndPool(1024, storagePool)

using scratchPool = seal.MemoryPoolHandle.New(false)
evaluator.squareInplaceWithPool(cipher, scratchPool)
evaluator.relinearizeInplaceWithPool(cipher, relinKeys, scratchPool)
```

Reuse the scratch pool across calls. Deleting the pool's JS handle doesn't free
it while native objects still use it. A handle returned from a function can keep
that pool alive after the function returns.

## Switch defaults for synchronous work

`MMProfFixed` lets a group of calls use the same default pool. Restore the previous
profile in `finally`, and dispose the handle returned by the restoring call too:

```javascript
using jobPool = seal.MemoryPoolHandle.New(false)
using profile = new seal.MMProfFixed(jobPool)
using previous = seal.MemoryManager.SwitchProfile(profile)

try {
  using jobPlain = new seal.Plaintext(1024)
} finally {
  seal.MemoryManager.SwitchProfile(previous).delete()
}
```

This changes defaults for the entire SEAL instance. Keep temporary switches
synchronous: don't `await` while a job's profile is installed, since other
requests could allocate from its pool. Existing objects keep their pools.
Creating or deleting a profile handle doesn't activate or deactivate it;
`SwitchProfile()` controls that.

See [SEAL's memory manager reference](https://github.com/microsoft/SEAL/blob/main/native/src/seal/memorymanager.h)
for the behavior of the other profile types. The shipped Wasm build doesn't use
pthreads; separate workers have separate SEAL instances and pools.

## Reading memory usage

`pool.allocByteCount()` includes cached native blocks. It doesn't include
JS-owned decoded arrays or serialized data. Released objects can leave cached
memory in the pool, so a rising count alone doesn't establish a leak.

Releasing a private pool returns its blocks to the Wasm allocator. It doesn't
shrink the Wasm `ArrayBuffer`. Measure both operation time and memory use before
keeping a pool change.
