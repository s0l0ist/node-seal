export const MemoryPool = ({ library }) => {
  const _MemoryPoolHandleGlobal =
    library.MemoryPoolHandle.MemoryPoolHandleGlobal
  const _MemoryPoolHandleThreadLocal =
    library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

  return {
    /**
     * Returns a MemoryPoolHandle pointing to the global memory pool.
     * @returns MemoryPoolHandle
     */
    get MemoryPoolHandleGlobal() {
      return _MemoryPoolHandleGlobal()
    },

    /**
     * Returns a MemoryPoolHandle pointing to the thread-local memory pool.
     * @returns MemoryPoolHandle
     */
    get MemoryPoolHandleThreadLocal() {
      return _MemoryPoolHandleThreadLocal()
    }
  }
}
