export const MemoryPoolHandle = ({ library }) => {
  const _global = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  const _threadLocal = library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

  /**
   * @typedef {Object} MemoryPoolHandle
   * @implements IMemoryPoolHandle
   */

  /**
   * @interface IMemoryPoolHandle
   */
  return {
    /**
     * The MemoryPoolHandle pointing to the global memory pool.
     *
     * @name IMemoryPoolHandle.global
     * @type {MemoryPoolHandle.global}
     */
    get global() {
      return _global()
    },

    /**
     * The MemoryPoolHandle pointing to the thread-local memory pool.
     *
     * @name IMemoryPoolHandle.threadLocal
     * @type {MemoryPoolHandle.threadLocal}
     */
    get threadLocal() {
      return _threadLocal()
    }
  }
}
