import { ComprModeType } from './compr-mode-type'
import { Context } from './context'
import { LoaderOptions, Library, Instance } from './seal'
import { Exception, SealError } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'
import { ParmsIdType, ParmsIdTypeConstructorOptions } from './parms-id-type'
import { VectorConstructorOptions } from './vector'
import { INVALID_CIPHER_CONSTRUCTOR_OPTIONS } from './constants'
export type CipherTextDependencyOptions = {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly ParmsIdType: ParmsIdTypeConstructorOptions
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly Vector: VectorConstructorOptions
}

export type CipherTextDependencies = {
  ({
    Exception,
    ComprModeType,
    ParmsIdType,
    MemoryPoolHandle,
    Vector
  }: CipherTextDependencyOptions): CipherTextConstructorOptions
}

export type CipherTextConstructorOptions = {
  ({
    context,
    parmsId,
    sizeCapacity,
    pool
  }?: {
    context?: Context
    parmsId?: ParmsIdType
    sizeCapacity?: number
    pool?: MemoryPoolHandle
  }): CipherText
}

export type CipherText = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly reserve: (context: Context, capacity: number) => void
  readonly resize: (size: number) => void
  readonly release: () => void
  readonly coeffModulusSize: number
  readonly polyModulusDegree: number
  readonly size: number
  readonly sizeCapacity: number
  readonly isTransparent: boolean
  readonly isNttForm: boolean
  readonly parmsId: ParmsIdType
  readonly scale: number
  readonly setScale: (scale: number) => void
  readonly pool: MemoryPoolHandle
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (context: Context, encoded: string) => void
  readonly loadArray: (context: Context, array: Uint8Array) => void
  readonly copy: (cipher: CipherText) => void
  readonly clone: () => CipherText
  readonly move: (cipher: CipherText) => void
}

const CipherTextConstructor =
  (library: Library): CipherTextDependencies =>
  ({
    Exception,
    ComprModeType,
    ParmsIdType,
    MemoryPoolHandle,
    Vector
  }: CipherTextDependencyOptions): CipherTextConstructorOptions =>
  ({
    context,
    parmsId,
    sizeCapacity,
    pool = MemoryPoolHandle.global
  } = {}): CipherText => {
    // Static methods
    const Constructor = library.Ciphertext

    let _instance = construct({
      context,
      parmsId,
      sizeCapacity,
      pool
    })

    function construct({
      context,
      parmsId,
      sizeCapacity,
      pool = MemoryPoolHandle.global
    }: {
      context?: Context
      parmsId?: ParmsIdType
      sizeCapacity?: number
      pool?: MemoryPoolHandle
    }) {
      try {
        if (!context && !parmsId && sizeCapacity === undefined) {
          return new Constructor(pool)
        } else if (context && !parmsId && sizeCapacity === undefined) {
          return new Constructor(context.instance, pool)
        } else if (context && parmsId && sizeCapacity === undefined) {
          return new Constructor(context.instance, parmsId.instance, pool)
        } else if (context && parmsId && sizeCapacity !== undefined) {
          return new Constructor(
            context.instance,
            parmsId.instance,
            sizeCapacity,
            pool
          )
        } else {
          throw new Error(INVALID_CIPHER_CONSTRUCTOR_OPTIONS)
        }
      } catch (e) {
        throw Exception.safe(e as SealError)
      }
    }
    /**
     * @implements CipherText
     */

    /**
     * @interface CipherText
     */
    return {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name CipherText#instance
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
       * @name CipherText#unsafeInject
       * @param {Instance} instance WASM instance
       */
      unsafeInject(instance: Instance) {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
        _instance = instance
      },

      /**
       * Delete the underlying WASM instance.
       *
       * Should be called before dereferencing this object to prevent the
       * WASM heap from growing indefinitely.
       * @function
       * @name CipherText#delete
       */
      delete() {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
      },

      /**
       * Allocates enough memory to accommodate the backing array of a ciphertext
       * with given capacity. In addition to the capacity, the allocation size is
       * determined by the current encryption parameters.
       *
       * @function
       * @name CipherText#reserve
       * @param {Context} context The SEAL Context
       * @param {number} capacity The capacity to reserve
       */
      reserve(context: Context, capacity: number) {
        try {
          return _instance.reserve(context.instance, capacity)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Resizes the CipherText to given size, reallocating if the capacity
       * of the CipherText is too small.
       *
       * This function is mainly intended for internal use and is called
       * automatically by functions such as Evaluator.multiply and
       * Evaluator.relinearize. A normal user should never have a reason
       * to manually resize a CipherText.
       *
       * @function
       * @name CipherText#resize
       * @param {number} size The new size
       */
      resize(size: number) {
        try {
          return _instance.resize(size)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Resets the CipherText. This function releases any memory allocated
       * by the CipherText, returning it to the memory pool. It also sets all
       * encryption parameter specific size information to zero.
       *
       * @function
       * @name CipherText#release
       */
      release() {
        _instance.release()
      },

      /**
       * The number of primes in the coefficient modulus of the
       * associated encryption parameters. This directly affects the
       * allocation size of the CipherText.
       *
       * @readonly
       * @name CipherText#coeffModulusSize
       * @type {number}
       */
      get coeffModulusSize() {
        return _instance.coeffModulusSize()
      },

      /**
       * The degree of the polynomial modulus of the associated
       * encryption parameters. This directly affects the allocation size
       * of the CipherText.
       *
       * @readonly
       * @name CipherText#polyModulusDegree
       * @type {number}
       */
      get polyModulusDegree() {
        return _instance.polyModulusDegree()
      },

      /**
       * The size of the CipherText.
       *
       * @readonly
       * @name CipherText#size
       * @type {number}
       */
      get size() {
        return _instance.size()
      },

      /**
       * The capacity of the allocation. This means the largest size
       * of the CipherText that can be stored in the current allocation with
       * the current encryption parameters.
       *
       * @readonly
       * @name CipherText#sizeCapacity
       * @type {number}
       */
      get sizeCapacity() {
        return _instance.sizeCapacity()
      },

      /**
       * Whether the current CipherText is transparent, i.e. does not require
       * a secret key to decrypt. In typical security models such transparent
       * CipherTexts would not be considered to be valid. Starting from the second
       * polynomial in the current CipherText, this function returns true if all
       * following coefficients are identically zero. Otherwise, returns false.
       *
       * @readonly
       * @name CipherText#isTransparent
       * @type {boolean}
       */
      get isTransparent() {
        return _instance.isTransparent()
      },

      /**
       * Whether the CipherText is in NTT form.
       *
       * @readonly
       * @name CipherText#isNttForm
       * @type {boolean}
       */
      get isNttForm() {
        return _instance.isNttForm()
      },

      /**
       * The reference to parmsId.
       * @see {@link EncryptionParameters} for more information about parmsId.
       *
       * @readonly
       * @name CipherText#parmsId
       * @type {ParmsIdType}
       */
      get parmsId() {
        const parms = ParmsIdType()
        parms.inject(_instance.parmsId())
        return parms
      },

      /**
       * The reference to the scale. This is only needed when using the
       * CKKS encryption scheme. The user should have little or no reason to ever
       * change the scale by hand.
       *
       * @readonly
       * @name CipherText#scale
       * @type {number}
       */
      get scale() {
        return _instance.scale()
      },

      /**
       * Sets the CipherText scale. This is only needed when using the
       * CKKS encryption scheme. The user should have little or no reason to ever
       * change the scale by hand.
       *
       * @function
       * @name CipherText#setScale
       * @param {number} scale The scale to set
       */
      setScale(scale: number) {
        _instance.setScale(scale)
      },

      /**
       * The currently used MemoryPoolHandle.
       *
       * @readonly
       * @name CipherText#pool
       * @type {MemoryPoolHandle}
       */
      get pool() {
        return _instance.pool()
      },

      /**
       * Save the CipherText to a base64 string
       *
       * @function
       * @name CipherText#save
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {string} Base64 encoded string
       */
      save(compression: ComprModeType = ComprModeType.zstd): string {
        return _instance.saveToString(compression)
      },

      /**
       * Save the CipherText as a binary Uint8Array
       *
       * @function
       * @name CipherText#saveArray
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {Uint8Array} A byte array containing the CipherText in binary form
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
       * Load a CipherText from a base64 string
       *
       * @function
       * @name CipherText#load
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
       * Load a CipherText from an Uint8Array holding binary data
       *
       * @function
       * @name CipherText#loadArray
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
       * Copy an existing CipherText and overwrite this instance
       *
       * @function
       * @name CipherText#copy
       * @param {CipherText} cipher CipherText to copy
       * @example
       * const cipherTextA = seal.CipherText()
       * // ... after encoding some data ...
       * const cipherTextB = seal.CipherText()
       * cipherTextB.copy(cipherTextA)
       * // cipherTextB holds a copy of cipherTextA
       */
      copy(cipher: CipherText) {
        try {
          _instance.copy(cipher.instance)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Clone and return a new instance of this CipherText
       *
       * @function
       * @name CipherText#clone
       * @returns {CipherText}
       * @example
       * const cipherTextA = seal.CipherText()
       * // ... after encoding some data ...
       * const cipherTextB = cipherTextA.clone()
       * // cipherTextB holds a copy of cipherTextA
       */
      clone(): CipherText {
        try {
          const clonedInstance = _instance.clone()
          const cipher = CipherTextConstructor(library)({
            Exception,
            ComprModeType,
            ParmsIdType,
            MemoryPoolHandle,
            Vector
          })()
          cipher.unsafeInject(clonedInstance)
          return cipher
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Move a CipherText into this one and delete the old reference
       *
       * @function
       * @name CipherText#move
       * @param {CipherText} cipher CipherText to move
       * @example
       * const cipherTextA = seal.CipherText()
       * // ... after encoding some data ...
       * const cipherTextB = seal.CipherText()
       * cipherTextB.move(cipherTextA)
       * // cipherTextB holds a the instance of cipherTextA.
       * // cipherTextA no longer holds an instance
       */
      move(cipher: CipherText) {
        try {
          _instance.move(cipher.instance)
          // TODO: find optimization
          // This method results in a copy instead of a real move.
          // Therefore, we need to delete the old instance.
          cipher.delete()
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      }
    }
  }

export const CipherTextInit = ({
  loader
}: LoaderOptions): CipherTextDependencies => {
  const library: Library = loader.library
  return CipherTextConstructor(library)
}
