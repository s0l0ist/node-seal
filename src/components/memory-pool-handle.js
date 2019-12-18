/**
 * MemoryPoolHandle
 * @typedef {Object} MemoryPoolHandle
 * @constructor
 */
export const MemoryPoolHandle = ({ library }) => {
  const _global = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  const _threadLocal = library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

  return {
    /**
     * Returns a MemoryPoolHandle pointing to the global memory pool.
     * @returns {MemoryPoolHandle} - pointer to the global memory pool
     */
    get global() {
      return _global()
    },

    /**
     * Returns a MemoryPoolHandle pointing to the thread-local memory pool.
     * @returns {MemoryPoolHandle} - pointer to the thread-local memory pool
     */
    get threadLocal() {
      return _threadLocal()
    }
  }
}
