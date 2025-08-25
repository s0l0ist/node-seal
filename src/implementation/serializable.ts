import { ComprModeType } from './compr-mode-type'
import { Exception, SealError } from './exception'
import { autoFinalize } from './finalizer'
import { Instance } from './seal'
import { VectorConstructorOptions } from './vector'

export interface SerializableDependencyOptions {
  readonly Exception: Exception
  readonly Vector: VectorConstructorOptions
  readonly ComprModeType: ComprModeType
}

export interface SerializableDependencies {
  ({
    Exception,
    Vector,
    ComprModeType
  }: SerializableDependencyOptions): SerializableConstructorOptions
}

export interface SerializableConstructorOptions {
  (): Serializable
}

export interface Serializable {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
}

const SerializableConstructor =
  (): SerializableDependencies =>
  ({
    Exception,
    Vector,
    ComprModeType
  }: SerializableDependencyOptions): SerializableConstructorOptions =>
  (): Serializable => {
    let _instance: Instance

    /**
     * @implements Serializable
     */

    /**
     * @interface Serializable
     */
    const self: Serializable = {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name Serializable#instance
       * @type {Instance}
       */
      get instance() {
        return _instance
      },

      /**
       * Inject this object with a raw WASM instance. No type checking is performed.
       *
       * @private
       * @function
       * @name Serializable#unsafeInject
       * @param {Instance} instance WASM instance
       */
      unsafeInject(instance: Instance) {
        self.delete()
        _instance = instance
        fin.reregister(_instance)
      },

      /**
       * Delete the underlying WASM instance.
       *
       * Should be called before dereferencing this object to prevent the
       * WASM heap from growing indefinitely.
       * @function
       * @name Serializable#delete
       */
      delete() {
        if (!_instance) {
          return
        }
        fin.unregister()
        _instance.delete()
        _instance = undefined
      },

      /**
       * Save to a base64 string
       *
       * @function
       * @name Serializable#save
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {string} Base64 encoded string
       */
      save(compression: ComprModeType = ComprModeType.zstd): string {
        try {
          return _instance.saveToString(compression)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Save as a binary Uint8Array
       *
       * @function
       * @name Serializable#saveArray
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {Uint8Array} A byte array containing the Serializable object in binary form
       */
      saveArray(compression: ComprModeType = ComprModeType.zstd): Uint8Array {
        const tempVect = Vector()
        const instance = _instance.saveToArray(compression)
        tempVect.unsafeInject(instance)
        tempVect.setType('Uint8Array')
        const tempArr = tempVect.toArray() as Uint8Array
        tempVect.delete()
        return tempArr
      }
    }

    const fin = autoFinalize(self, _instance)

    return self
  }

export const SerializableInit = (): SerializableDependencies => {
  return SerializableConstructor()
}
