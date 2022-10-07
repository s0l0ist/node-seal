import { LoaderOptions, Library, Instance } from './seal'
import { Exception, SealError } from './exception'
import { VectorConstructorOptions } from './vector'
import { ComprModeType } from './compr-mode-type'
import { Context } from './context'

export type PublicKeyDependencyOptions = {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly Vector: VectorConstructorOptions
}

export type PublicKeyDependencies = {
  ({
    Exception,
    ComprModeType,
    Vector
  }: PublicKeyDependencyOptions): PublicKeyConstructorOptions
}

export type PublicKeyConstructorOptions = {
  (): PublicKey
}

export type PublicKey = {
  readonly instance: Instance
  readonly inject: (instance: Instance) => void
  readonly delete: () => void
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (context: Context, encoded: string) => void
  readonly loadArray: (context: Context, array: Uint8Array) => void
  readonly copy: (key: PublicKey) => void
  readonly clone: () => PublicKey
  readonly move: (key: PublicKey) => void
}

const PublicKeyConstructor =
  (library: Library): PublicKeyDependencies =>
  ({
    Exception,
    ComprModeType,
    Vector
  }: PublicKeyDependencyOptions): PublicKeyConstructorOptions =>
  (): PublicKey => {
    const Constructor = library.PublicKey
    let _instance = new Constructor()

    /**
     * @implements PublicKey
     */

    /**
     * @interface PublicKey
     */
    return {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name PublicKey#instance
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
       * @name PublicKey#inject
       * @param {Instance} instance WASM instance
       */
      inject(instance: Instance) {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
        _instance = new Constructor(instance)
        instance.delete()
      },

      /**
       * Delete the underlying WASM instance.
       *
       * Should be called before dereferencing this object to prevent the
       * WASM heap from growing indefinitely.
       * @function
       * @name PublicKey#delete
       */
      delete() {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
      },

      /**
       * Save the Encryption Parameters to a base64 string
       *
       * @function
       * @name PublicKey#save
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
       * Save the PublicKey as a binary Uint8Array
       *
       * @function
       * @name PublicKey#saveArray
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {Uint8Array} A byte array containing the PublicKey in binary form
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
       * Load a PublicKey from a base64 string
       *
       * @function
       * @name PublicKey#load
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
       * Load a PublicKey from an Uint8Array holding binary data
       *
       * @function
       * @name PublicKey#loadArray
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
       * Copy an existing PublicKey and overwrite this instance
       *
       * @function
       * @name PublicKey#copy
       * @param {PublicKey} key PublicKey to copy
       * @example
       * const keyA = keyGenerator.createPublicKey()
       * const keyB = seal.PublicKey()
       * keyB.copy(keyA)
       * // keyB holds a copy of keyA
       */
      copy(key: PublicKey) {
        try {
          _instance.copy(key.instance)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Clone and return a new instance of this PublicKey
       *
       * @function
       * @name PublicKey#clone
       * @returns {PublicKey}
       * @example
       * const keyA = keyGenerator.createPublicKey()
       * const keyB = keyA.clone()
       * // keyB holds a copy of keyA
       */
      clone(): PublicKey {
        try {
          const clonedInstance = _instance.clone()
          const key = PublicKeyConstructor(library)({
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
       * Move a PublicKey into this one and delete the old reference
       *
       * @function
       * @name PublicKey#move
       * @param {PublicKey} key PublicKey to move
       * @example
       * const keyA = keyGenerator.createPublicKey()
       * const keyB = seal.PublicKey()
       * keyB.move(keyA)
       * // keyB holds a the instance of keyA.
       * // keyA no longer holds an instance
       */
      move(key: PublicKey) {
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
  }

export const PublicKeyInit = ({
  loader
}: LoaderOptions): PublicKeyDependencies => {
  const library: Library = loader.library
  return PublicKeyConstructor(library)
}
