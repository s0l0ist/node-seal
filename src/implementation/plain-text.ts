import { ComprModeType } from './compr-mode-type'
import { Context } from './context'
import { LoaderOptions, Library, Instance } from './emscripten'
import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'
import { ParmsIdType, ParmsIdTypeConstructorOptions } from './parms-id-type'
import { VectorConstructorOptions } from './vector'
export type PlainTextDependencyOptions = {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly ParmsIdType: ParmsIdTypeConstructorOptions
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly Vector: VectorConstructorOptions
}

export type PlainTextDependencies = {
  ({
    Exception,
    ComprModeType,
    ParmsIdType,
    MemoryPoolHandle,
    Vector
  }: PlainTextDependencyOptions): PlainTextConstructorOptions
}

export type PlainTextConstructorOptions = {
  ({
    capacity,
    coeffCount,
    pool
  }?: {
    capacity?: number
    coeffCount?: number
    pool?: MemoryPoolHandle
  }): PlainText
}

export type PlainText = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly reserve: (capacity: number) => void
  readonly shrinkToFit: () => void
  readonly release: () => void
  readonly resize: (coeffCount: number) => void
  readonly setZero: () => void
  readonly isZero: boolean
  readonly capacity: number
  readonly coeffCount: number
  readonly significantCoeffCount: number
  readonly nonzeroCoeffCount: number
  readonly toPolynomial: () => string
  readonly isNttForm: boolean
  readonly parmsId: ParmsIdType
  readonly scale: number
  readonly setScale: (scale: number) => void
  readonly pool: MemoryPoolHandle
  readonly save: (compression: ComprModeType) => string
  readonly saveArray: (compression: ComprModeType) => Uint8Array
  readonly load: (context: Context, encoded: string) => void
  readonly loadArray: (context: Context, array: Uint8Array) => void
  readonly copy: (plain: PlainText) => void
  readonly clone: () => PlainText
  readonly move: (plain: PlainText) => void
}

const PlainTextConstructor = (library: Library): PlainTextDependencies => ({
  Exception,
  ComprModeType,
  ParmsIdType,
  MemoryPoolHandle,
  Vector
}: PlainTextDependencyOptions): PlainTextConstructorOptions => ({
  capacity,
  coeffCount,
  pool = MemoryPoolHandle.global
} = {}): PlainText => {
  // Static methods
  const Constructor = library.Plaintext

  let _instance = construct({
    capacity,
    coeffCount,
    pool
  })

  function construct({
    capacity,
    coeffCount,
    pool = MemoryPoolHandle.global
  }: {
    capacity?: number,
    coeffCount?: Number,
    pool?: MemoryPoolHandle
  }) {
    try {
      if (capacity === undefined && coeffCount === undefined) {
        return new Constructor(pool)
      } else if (capacity === undefined && coeffCount !== undefined) {
        return new Constructor(coeffCount, pool)
      } else if (capacity !== undefined && coeffCount !== undefined) {
        return new Constructor(capacity, coeffCount, pool)
      } else {
        throw new Error('Must specify a (coeffCount), (coeffCount, capacity)')
      }
    } catch (e) {
      throw Exception.safe(e)
    }
  }
  /**
   * @implements PlainText
   */

  /**
   * @interface PlainText
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name PlainText#instance
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
     * @name PlainText#unsafeInject
     * @param {Instance} instance WASM instance
     */
    unsafeInject(instance: Instance) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name PlainText#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Allocates enough memory to accommodate the backing array of a plaintext
     * with given capacity.
     *
     * @function
     * @name PlainText#reserve
     * @param {number} capacity The capacity to reserve
     */
    reserve(capacity: number) {
      try {
        return _instance.reserve(capacity)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Allocates enough memory to accommodate the backing array of the current
     * PlainText and copies it over to the new location. This function is meant
     * to reduce the memory use of the PlainText to smallest possible and can be
     * particularly important after modulus switching.
     *
     * @function
     * @name PlainText#shrinkToFit
     */
    shrinkToFit() {
      _instance.shrinkToFit()
    },

    /**
     * Resets the PlainText. This function releases any memory allocated by the
     * PlainText, returning it to the memory pool.
     *
     * @function
     * @name PlainText#release
     */
    release() {
      _instance.release()
    },

    /**
     * Resizes the PlainText to have a given coefficient count. The PlainText
     * is automatically reallocated if the new coefficient count does not fit in
     * the current capacity.
     *
     * @function
     * @name PlainText#resize
     * @param {number} coeffCount The number of coefficients in the plaintext polynomial
     */
    resize(coeffCount: number) {
      try {
        _instance.resize(coeffCount)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Sets the PlainText polynomial to zero.
     *
     * @function
     * @name PlainText#setZero
     */
    setZero() {
      _instance.setZero()
    },

    /**
     * Whether the current PlainText polynomial has all zero coefficients.
     *
     * @readonly
     * @name PlainText#isZero
     * @type {boolean}
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     * The capacity of the current allocation.
     *
     * @readonly
     * @name PlainText#capacity
     * @type {number}
     */
    get capacity() {
      return _instance.capacity()
    },

    /**
     * The coefficient count of the current PlainText polynomial.
     *
     * @readonly
     * @name PlainText#coeffCount
     * @type {number}
     */
    get coeffCount() {
      return _instance.coeffCount()
    },

    /**
     * The significant coefficient count of the current PlainText polynomial.
     *
     * @readonly
     * @name PlainText#significantCoeffCount
     * @type {number}
     */
    get significantCoeffCount() {
      return _instance.significantCoeffCount()
    },

    /**
     * Returns the non-zero coefficient count of the current PlainText polynomial.
     *
     * @readonly
     * @name PlainText#nonzeroCoeffCount
     * @type {number}
     */
    get nonzeroCoeffCount() {
      return _instance.nonzeroCoeffCount()
    },

    /**
     * Returns a human-readable string description of the PlainText polynomial.
     *
     * The returned string is of the form "7FFx^3 + 1x^1 + 3" with a format
     * summarized by the following:
     * 1. Terms are listed in order of strictly decreasing exponent
     * 2. Coefficient values are non-negative and in hexadecimal format (hexadecimal
     * letters are in upper-case)
     * 3. Exponents are positive and in decimal format
     * 4. Zero coefficient terms (including the constant term) are omitted unless
     * the polynomial is exactly 0 (see rule 9)
     * 5. Term with the exponent value of one is written as x^1
     * 6. Term with the exponent value of zero (the constant term) is written as
     * just a hexadecimal number without x or exponent
     * 7. Terms are separated exactly by <space>+<space>
     * 8. Other than the +, no other terms have whitespace
     * 9. If the polynomial is exactly 0, the string "0" is returned
     *
     * @function
     * @name PlainText#toPolynomial
     * @throws std::invalid_argument if the PlainText is in NTT transformed form
     * @returns {string} Polynomial string
     */
    toPolynomial(): string {
      try {
        return _instance.toPolynomial()
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Whether the PlainText is in NTT form.
     *
     * @readonly
     * @name PlainText#isNttForm
     * @type {boolean}
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * The reference to parmsId of the PlainText. The parmsId must remain zero unless the
     * PlainText polynomial is in NTT form.
     *
     * @see {@link EncryptionParameters} for more information about parmsId.
     *
     * @readonly
     * @name PlainText#parmsId
     * @type {ParmsIdType}
     */
    get parmsId() {
      const parms = ParmsIdType()
      parms.inject(_instance.parmsId())
      return parms
    },

    /**
     * The reference to the scale. This is only needed when using the CKKS
     * encryption scheme. The user should have little or no reason to ever change
     * the scale by hand.
     *
     * @readonly
     * @name PlainText#scale
     * @type {number}
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * Sets the PlainText scale. This is only needed when using the
     * CKKS encryption scheme. The user should have little or no reason to ever
     * change the scale by hand.
     *
     * @function
     * @name PlainText#setScale
     * @param {number} scale The scale to set
     */
    setScale(scale: number) {
      _instance.setScale(scale)
    },

    /**
     * The currently used MemoryPoolHandle.
     *
     * @readonly
     * @name PlainText#pool
     * @type {MemoryPoolHandle}
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save the PlainText to a base64 string
     *
     * @function
     * @name PlainText#save
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {string} Base64 encoded string
     */
    save(compression: ComprModeType = ComprModeType.deflate): string {
      return _instance.saveToString(compression)
    },

    /**
     * Save the PlainText as a binary Uint8Array
     *
     * @function
     * @name PlainText#saveArray
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {Uint8Array} A byte array containing the PlainText in binary form
     */
    saveArray(compression: ComprModeType = ComprModeType.deflate): Uint8Array {
      const tempVect = Vector()
      const instance = _instance.saveToArray(compression)
      tempVect.unsafeInject(instance)
      tempVect.setType('Uint8Array')
      const tempArr = tempVect.toArray() as Uint8Array
      tempVect.delete()
      return tempArr
    },

    /**
     * Load a PlainText from a base64 string
     *
     * @function
     * @name PlainText#load
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
     * Load a PlainText from an Uint8Array holding binary data
     *
     * @function
     * @name PlainText#loadArray
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
     * Copy an existing PlainText and overwrite this instance
     *
     * @function
     * @name PlainText#copy
     * @param {PlainText} plain PlainText to copy
     * @example
     * const plainTextA = Morfix.PlainText()
     * // ... after encoding some data ...
     * const plainTextB = Morfix.PlainText()
     * plainTextB.copy(plainTextA)
     * // plainTextB holds a copy of plainTextA
     */
    copy(plain: PlainText) {
      try {
        _instance.copy(plain.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Clone and return a new instance of this PlainText
     *
     * @function
     * @name PlainText#clone
     * @returns {PlainText}
     * @example
     * const plainTextA = Morfix.PlainText()
     * // ... after encoding some data ...
     * const plainTextB = plainTextA.clone()
     * // plainTextB holds a copy of plainTextA
     */
    clone(): PlainText {
      try {
        const clonedInstance = _instance.clone()
        const plain = PlainTextConstructor(library)({
          Exception,
          ComprModeType,
          ParmsIdType,
          MemoryPoolHandle,
          Vector
        })()
        plain.unsafeInject(clonedInstance)
        return plain
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a PlainText into this one and delete the old reference
     *
     * @function
     * @name PlainText#move
     * @param {PlainText} plain PlainText to move
     * @example
     * const plainTextA = Morfix.PlainText()
     * // ... after encoding some data ...
     * const plainTextB = Morfix.PlainText()
     * plainTextB.move(plainTextA)
     * // plainTextB holds a the instance of plainTextA.
     * // plainTextA no longer holds an instance
     */
    move(plain: PlainText) {
      try {
        _instance.move(plain.instance)
        // TODO: find optimization
        // This method results in a copy instead of a real move.
        // Therefore, we need to delete the old instance.
        plain.delete()
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}

export const PlainTextInit = ({
  loader
}: LoaderOptions): PlainTextDependencies => {
  const library: Library = loader.library
  return PlainTextConstructor(library)
}
