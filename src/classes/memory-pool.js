export class MemoryPool {
  constructor({library}) {
    this._MemoryPoolHandle = library.MemoryPoolHandle

    // Static methods
    this._MemoryPoolHandleGlobal = this._MemoryPoolHandle.MemoryPoolHandleGlobal
    this._MemoryPoolHandleThreadLocal = this._MemoryPoolHandle.MemoryPoolHandleThreadLocal
  }

  /**
   * Returns a MemoryPoolHandle pointing to the global memory pool.
   * @returns MemoryPoolHandle
   */
  get MemoryPoolHandleGlobal() {
    return this._MemoryPoolHandleGlobal()
  }

  /**
   * Returns a MemoryPoolHandle pointing to the thread-local memory pool.
   * @returns MemoryPoolHandle
   */
  get MemoryPoolHandleThreadLocal() {
    return this._MemoryPoolHandleThreadLocal()
  }

}
