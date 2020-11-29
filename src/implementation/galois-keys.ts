import { LoaderOptions, Library, Instance } from './seal'
import { Exception } from './exception'
import { VectorConstructorOptions } from './vector'
import { ComprModeType } from './compr-mode-type'
import { Context } from './context'

export type GaloisKeysDependencyOptions = {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly Vector: VectorConstructorOptions
}

export type GaloisKeysDependencies = {
  ({
    Exception,
    ComprModeType,
    Vector
  }: GaloisKeysDependencyOptions): GaloisKeysConstructorOptions
}

export type GaloisKeysConstructorOptions = {
  (): GaloisKeys
}

export type GaloisKeys = {
  readonly instance: Instance
  readonly inject: (instance: Instance) => void
  readonly delete: () => void
  readonly size: number
  readonly getIndex: (galoisElt: number) => number
  readonly hasKey: (galoisElt: number) => boolean
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (context: Context, encoded: string) => void
  readonly loadArray: (context: Context, array: Uint8Array) => void
  readonly copy: (key: GaloisKeys) => void
  readonly clone: () => GaloisKeys
  readonly move: (key: GaloisKeys) => void
}

const GaloisKeysConstructor = (library: Library): GaloisKeysDependencies => ({
  Exception,
  ComprModeType,
  Vector
}: GaloisKeysDependencyOptions): GaloisKeysConstructorOptions => (): GaloisKeys => {
  const Constructor = library.GaloisKeys
  let _instance = new Constructor()

  /**
   * @implements GaloisKeys
   */

  /**
   * @interface GaloisKeys
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name GaloisKeys#instance
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
     * @name GaloisKeys#inject
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
     * @name GaloisKeys#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
    },

    /**
     * Returns the current number of keyswitching keys. Only keys that are
     * non-empty are counted.
     *
     * @readonly
     * @name GaloisKeys#size
     * @type {number}
     */
    get size() {
      return _instance.size()
    },

    /**
     * Returns the index of a Galois key in the backing KSwitchKeys instance that
     * corresponds to the given Galois element, assuming that it exists in the
     * backing KSwitchKeys.
     *
     * @function
     * @name GaloisKeys#getIndex
     * @param {number} galoisElt The Galois element
     * @returns {number} The index of the galois element
     */
    getIndex(galoisElt: number): number {
      try {
        return _instance.getIndex(galoisElt)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Returns whether a Galois key corresponding to a given Galois element exists.
     *
     * @function
     * @name GaloisKeys#hasKey
     * @param {number} galoisElt The Galois element
     * @returns {boolean} True if the key exists
     */
    hasKey(galoisElt: number): boolean {
      try {
        return _instance.hasKey(galoisElt)
      } catch (e) {
        throw Exception.safe(e)
      }
    },
    /**
     * Save the Encryption Parameters to a base64 string
     *
     * @function
     * @name GaloisKeys#save
     * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
     * @returns {string} Base64 encoded string
     */
    save(compression: ComprModeType = ComprModeType.zstd): string {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Save the GaloisKeys as a binary Uint8Array
     *
     * @function
     * @name GaloisKeys#saveArray
     * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
     * @returns {Uint8Array} A byte array containing the GaloisKeys in binary form
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
     * Load a GaloisKeys from a base64 string
     *
     * @function
     * @name GaloisKeys#load
     * @param {Context} context Encryption context to enforce
     * @param {string} encoded Base64 encoded string
     */
    load(context: Context, encoded: string) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Load a GaloisKeys from an Uint8Array holding binary data
     *
     * @function
     * @name GaloisKeys#loadArray
     * @param {Context} context Encryption context to enforce
     * @param {Uint8Array} array TypedArray containing binary data
     */
    loadArray(context: Context, array: Uint8Array) {
      try {
        _instance.loadFromArray(context.instance, array)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Copy an existing GaloisKeys and overwrite this instance
     *
     * @function
     * @name GaloisKeys#copy
     * @param {GaloisKeys} key GaloisKeys to copy
     * @example
     * const keyA = keyGenerator.galoisKeys()
     * const keyB = seal.GaloisKeys()
     * keyB.copy(keyA)
     * // keyB holds a copy of keyA
     */
    copy(key: GaloisKeys) {
      try {
        _instance.copy(key.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Clone and return a new instance of this GaloisKeys
     *
     * @function
     * @name GaloisKeys#clone
     * @returns {GaloisKeys}
     * @example
     * const keyA = keyGenerator.galoisKeys()
     * const keyB = keyA.clone()
     * // keyB holds a copy of keyA
     */
    clone(): GaloisKeys {
      try {
        const clonedInstance = _instance.clone()
        const key = GaloisKeysConstructor(library)({
          Exception,
          ComprModeType,
          Vector
        })()
        key.inject(clonedInstance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a GaloisKeys into this one and delete the old reference
     *
     * @function
     * @name GaloisKeys#move
     * @param {GaloisKeys} key GaloisKeys to move
     * @example
     * const keyA = keyGenerator.galoisKeys()
     * const keyB = seal.GaloisKeys()
     * keyB.move(keyA)
     * // keyB holds a the instance of keyA.
     * // keyA no longer holds an instance
     */
    move(key: GaloisKeys) {
      try {
        _instance.move(key.instance)
        // TODO: find optimization
        // This method results in a copy instead of a real move.
        // Therefore, we need to delete the old instance.
        key.delete()
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}

export const GaloisKeysInit = ({
  loader
}: LoaderOptions): GaloisKeysDependencies => {
  const library: Library = loader.library
  return GaloisKeysConstructor(library)
}
