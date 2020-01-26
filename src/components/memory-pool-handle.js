export const MemoryPoolHandle = ({ library }) => {
  const _global = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  const _threadLocal = library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

  /**
   * @implements MemoryPoolHandle
   */

  /**
   * @interface MemoryPoolHandle
   */
  return {
    /**
     * The MemoryPoolHandle pointing to the global memory pool.
     *
     * @name MemoryPoolHandle.global
     * @type {MemoryPoolHandle.global}
     */
    get global() {
      /**
       * @typedef {MemoryPoolHandle.global} MemoryPoolHandle.global
       */
      return _global()
    },

    /**
     * The MemoryPoolHandle pointing to the thread-local memory pool.
     *
     * @name MemoryPoolHandle.threadLocal
     * @type {MemoryPoolHandle.threadLocal}
     */
    get threadLocal() {
      /**
       * @typedef {MemoryPoolHandle.threadLocal} MemoryPoolHandle.threadLocal
       */
      return _threadLocal()
    }
  }
}
