export const MemoryPoolHandle = library => () => {
  // Static methods
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
     * @readonly
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
     * @readonly
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
