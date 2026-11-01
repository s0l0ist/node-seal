# Memory pools and profiles

These
APIs are available for allocation experiments, not required application setup.

## What changes in Wasm

SEAL's pools manage buffer allocation and reuse inside Wasm's linear memory.
Releasing a private pool makes its buffers available to the underlying allocator,
but does not shrink the Wasm memory buffer or return that capacity to the host.
Changing pools is not a way to reduce the size of an already-grown Wasm heap.

For normal application work, reuse contexts, keys, and destinations, and release
native handles with `using` or `.delete()`. The default pool already reuses
buffers.

## API reference

| API | Role |
| --- | --- |
| `MemoryPool` | SEAL's native allocator and cached buffers; accessed through a handle in JS. |
| `MemoryPoolHandle` | A reference to a pool. Explicit pool factories select object storage; `WithPool` methods select temporary working storage. |
| `MemoryManager` | Selects default pools through the active profile. `GetPool()` returns a handle; `SwitchProfile()` installs a profile and returns the previous one. |
| `MMProfGlobal` | Selects the global pool. This is the default. |
| `MMProfFixed(pool)` | Selects the supplied pool for default-pool requests. |
| `MMProfNew` | Creates a new pool on every default-pool request, losing reuse across those requests. |
| `MMProfThreadLocal` | Selects the native thread's pool; usually unnecessary in this single-threaded build. |

`MMProf` is the base type for profiles. Creating a profile does not activate it.
Switching profiles changes defaults for the entire SEAL instance and does not
move existing objects between pools. If experimenting with a temporary switch,
restore the previous profile in `finally` and do not `await` while it is installed.

`pool.allocByteCount()` measures that pool's buffers, including cached ones,
not the total Wasm heap or process memory. A lower pool count does not mean the
Wasm memory buffer has shrunk. Measure the complete workload before keeping a
custom allocation policy.

See [SEAL's memory manager reference](https://github.com/microsoft/SEAL/blob/main/native/src/seal/memorymanager.h)
for the native API details.
