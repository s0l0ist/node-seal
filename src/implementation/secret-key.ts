import { ComprModeType } from './compr-mode-type'
import { Context } from './context'
import { Exception, SealError } from './exception'
import { autoFinalize } from './finalizer'
import { Instance, Library, LoaderOptions } from './seal'
import { VectorConstructorOptions } from './vector'

export interface SecretKeyDependencyOptions {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly Vector: VectorConstructorOptions
}

export interface SecretKeyDependencies {
  ({
    Exception,
    ComprModeType,
    Vector
  }: SecretKeyDependencyOptions): SecretKeyConstructorOptions
}

export interface SecretKeyConstructorOptions {
  (): SecretKey
}

export interface SecretKey {
  readonly instance: Instance
  readonly inject: (instance: Instance) => void
  readonly delete: () => void
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (context: Context, encoded: string) => void
  readonly loadArray: (context: Context, array: Uint8Array) => void
  readonly copy: (key: SecretKey) => void
  readonly clone: () => SecretKey
  readonly move: (key: SecretKey) => void
}

const SecretKeyConstructor =
  (library: Library): SecretKeyDependencies =>
  ({
    Exception,
    ComprModeType,
    Vector
  }: SecretKeyDependencyOptions): SecretKeyConstructorOptions =>
  (): SecretKey => {
    const Constructor = library.SecretKey
    let _instance = new Constructor()

    /**
     * @implements SecretKey
     */

    /**
     * @interface SecretKey
     */
    const self: SecretKey = {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name SecretKey#instance
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
       * @name SecretKey#inject
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
       * @name SecretKey#delete
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
       * Save the Encryption Parameters to a base64 string
       *
       * @function
       * @name SecretKey#save
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
       * Save the SecretKey as a binary Uint8Array
       *
       * @function
       * @name SecretKey#saveArray
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {Uint8Array} A byte array containing the SecretKey in binary form
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
       * Load a SecretKey from a base64 string
       *
       * @function
       * @name SecretKey#load
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
       * Load a SecretKey from an Uint8Array holding binary data
       *
       * @function
       * @name SecretKey#loadArray
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
       * Copy an existing SecretKey and overwrite this instance
       *
       * @function
       * @name SecretKey#copy
       * @param {SecretKey} key SecretKey to copy
       * @example
       * const keyA = keyGenerator.secretKey()
       * const keyB = seal.SecretKey()
       * keyB.copy(keyA)
       * // keyB holds a copy of keyA
       */
      copy(key: SecretKey) {
        try {
          _instance.copy(key.instance)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Clone and return a new instance of this SecretKey
       *
       * @function
       * @name SecretKey#clone
       * @returns {SecretKey}
       * @example
       * const keyA = keyGenerator.secretKey()
       * const keyB = keyA.clone()
       * // keyB holds a copy of keyA
       */
      clone(): SecretKey {
        try {
          const clonedInstance = _instance.duplicate()
          const key = SecretKeyConstructor(library)({
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
       * Move a SecretKey into this one and delete the old reference
       *
       * @function
       * @name SecretKey#move
       * @param {SecretKey} key SecretKey to move
       * @example
       * const keyA = keyGenerator.secretKey()
       * const keyB = seal.SecretKey()
       * keyB.move(keyA)
       * // keyB holds a the instance of keyA.
       * // keyA no longer holds an instance
       */
      move(key: SecretKey) {
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

export const SecretKeyInit = ({
  loader
}: LoaderOptions): SecretKeyDependencies => {
  const library: Library = loader.library
  return SecretKeyConstructor(library)
}
