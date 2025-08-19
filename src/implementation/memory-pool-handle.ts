import { Library, LoaderOptions } from './seal'

export interface MemoryPoolHandleDependencies {
  (): MemoryPoolHandleConstructorOptions
}

export interface MemoryPoolHandleConstructorOptions {
  (): MemoryPoolHandle
}

export interface MemoryPoolHandle {
  readonly global: any
  readonly threadLocal: any
}

const MemoryPoolHandleConstructor =
  (library: Library): MemoryPoolHandleDependencies =>
  (): MemoryPoolHandleConstructorOptions =>
  (): MemoryPoolHandle => {
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

export const MemoryPoolHandleInit = ({
  loader
}: LoaderOptions): MemoryPoolHandleDependencies => {
  const library: Library = loader.library
  return MemoryPoolHandleConstructor(library)
}
