import { ComprModeType } from './compr-mode-type'
import { Context } from './context'
import { Exception, SealError } from './exception'
import { autoFinalize } from './finalizer'
import { Instance, Library, LoaderOptions } from './seal'
import { VectorConstructorOptions } from './vector'

export interface RelinKeysDependencyOptions {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly Vector: VectorConstructorOptions
}

export interface RelinKeysDependencies {
  ({
    Exception,
    ComprModeType,
    Vector
  }: RelinKeysDependencyOptions): RelinKeysConstructorOptions
}

export interface RelinKeysConstructorOptions {
  (): RelinKeys
}

export interface RelinKeys {
  readonly instance: Instance
  readonly inject: (instance: Instance) => void
  readonly delete: () => void
  readonly size: number
  readonly getIndex: (keyPower: number) => number
  readonly hasKey: (keyPower: number) => boolean
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (context: Context, encoded: string) => void
  readonly loadArray: (context: Context, array: Uint8Array) => void
  readonly copy: (key: RelinKeys) => void
  readonly clone: () => RelinKeys
  readonly move: (key: RelinKeys) => void
}

const RelinKeysConstructor =
  (library: Library): RelinKeysDependencies =>
  ({
    Exception,
    ComprModeType,
    Vector
  }: RelinKeysDependencyOptions): RelinKeysConstructorOptions =>
  (): RelinKeys => {
    const Constructor = library.RelinKeys
    let _instance = new Constructor()

    /**
     * @implements RelinKeys
     */

    /**
     * @interface RelinKeys
     */
    const self: RelinKeys = {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name RelinKeys#instance
       * @type {Instance}
       */
      get instance() {
        return _instance
      },

      /**
       * Inject this object with a raw WASM instance
       *
       * @private
       * @function
       * @name RelinKeys#inject
       * @param {Instance} instance WASM instance
       */
      inject(instance: Instance) {
        self.delete()
        _instance = new Constructor(instance)
        fin.reregister(_instance)
      },

      /**
       * Delete the underlying WASM instance.
       *
       * Should be called before dereferencing this object to prevent the
       * WASM heap from growing indefinitely.
       * @function
       * @name RelinKeys#delete
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
       * Returns the current number of keyswitching keys. Only keys that are
       * non-empty are counted.
       *
       * @readonly
       * @name RelinKeys#size
       * @type {number}
       */
      get size() {
        return _instance.size()
      },

      /**
       * Returns the index of a relinearization key in the backing KSwitchKeys
       * instance that corresponds to the given secret key power, assuming that
       * it exists in the backing KSwitchKeys.
       *
       * @function
       * @name RelinKeys#getIndex
       * @param {number} keyPower The power of the secret key
       * @returns {number} The index of the relin key
       */
      getIndex(keyPower: number): number {
        try {
          return _instance.getIndex(keyPower)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Returns whether a relinearization key corresponding to a given power of
       * the secret key exists.
       *
       * @function
       * @name RelinKeys#hasKey
       * @param {number} keyPower The power of the secret key
       * @returns {boolean} True if the power exists
       */
      hasKey(keyPower: number): boolean {
        try {
          return _instance.hasKey(keyPower)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Save the Encryption Parameters to a base64 string
       *
       * @function
       * @name RelinKeys#save
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
       * Save the RelinKeys as a binary Uint8Array
       *
       * @function
       * @name RelinKeys#saveArray
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {Uint8Array} A byte array containing the RelinKeys in binary form
       */
      saveArray(compression: ComprModeType = ComprModeType.zstd): Uint8Array {
        const tempVect = Vector()
        const instance = _instance.saveToArray(compression)
        tempVect.unsafeInject(instance)
        tempVect.setType('Uint8Array')
        const tempArr = tempVect.toArray() as Uint8Array
        tempVect.delete()
        return tempArr
      },

      /**
       * Load a RelinKeys from a base64 string
       *
       * @function
       * @name RelinKeys#load
       * @param {Context} context Encryption context to enforce
       * @param {string} encoded Base64 encoded string
       */
      load(context: Context, encoded: string) {
        try {
          _instance.loadFromString(context.instance, encoded)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Load a RelinKeys from an Uint8Array holding binary data
       *
       * @function
       * @name RelinKeys#loadArray
       * @param {Context} context Encryption context to enforce
       * @param {Uint8Array} array TypedArray containing binary data
       */
      loadArray(context: Context, array: Uint8Array) {
        try {
          _instance.loadFromArray(context.instance, array)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Copy an existing RelinKeys and overwrite this instance
       *
       * @function
       * @name RelinKeys#copy
       * @param {RelinKeys} key RelinKeys to copy
       * @example
       * const keyA = keyGenerator.createRelinKeys()
       * const keyB = seal.RelinKeys()
       * keyB.copy(keyA)
       * // keyB holds a copy of keyA
       */
      copy(key: RelinKeys) {
        try {
          _instance.copy(key.instance)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Clone and return a new instance of this RelinKeys
       *
       * @function
       * @name RelinKeys#clone
       * @returns {RelinKeys}
       * @example
       * const keyA = keyGenerator.createRelinKeys()
       * const keyB = keyA.clone()
       * // keyB holds a copy of keyA
       */
      clone(): RelinKeys {
        try {
          const clonedInstance = _instance.clone()
          const key = RelinKeysConstructor(library)({
            Exception,
            ComprModeType,
            Vector
          })()
          key.inject(clonedInstance)
          return key
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Move a RelinKeys into this one and delete the old reference
       *
       * @function
       * @name RelinKeys#move
       * @param {RelinKeys} key RelinKeys to move
       * @example
       * const keyA = keyGenerator.createRelinKeys()
       * const keyB = seal.RelinKeys()
       * keyB.move(keyA)
       * // keyB holds a the instance of keyA.
       * // keyA no longer holds an instance
       */
      move(key: RelinKeys) {
        try {
          _instance.move(key.instance)
          // TODO: find optimization
          // This method results in a copy instead of a real move.
          // Therefore, we need to delete the old instance.
          key.delete()
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      }
    }

    const fin = autoFinalize(self, _instance)

    return self
  }

export const RelinKeysInit = ({
  loader
}: LoaderOptions): RelinKeysDependencies => {
  const library: Library = loader.library
  return RelinKeysConstructor(library)
}
