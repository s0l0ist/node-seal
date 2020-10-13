import { LoaderOptions, Library, Instance } from './seal'
import { Vector, VectorConstructorOptions } from './vector'
import { ComprModeType } from './compr-mode-type'
import { SchemeType } from './scheme-type'
import { Exception } from './exception'
import { Modulus, ModulusConstructorOptions } from './modulus'

export type EncryptionParametersDependencyOptions = {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly Modulus: ModulusConstructorOptions
  readonly SchemeType: SchemeType
  readonly Vector: VectorConstructorOptions
}

export type EncryptionParametersDependencies = {
  ({
    Exception,
    ComprModeType,
    Modulus,
    SchemeType,
    Vector
  }: EncryptionParametersDependencyOptions): EncryptionParametersConstructorOptions
}

export type EncryptionParametersConstructorOptions = {
  (schemeType?: SchemeType): EncryptionParameters
}

export type EncryptionParameters = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly setPolyModulusDegree: (polyModulusDegree: number) => void
  readonly setCoeffModulus: (coeffModulus: Vector) => void
  readonly setPlainModulus: (plainModulus: Modulus) => void
  readonly scheme: SchemeType
  readonly polyModulusDegree: number
  readonly coeffModulus: BigUint64Array
  readonly plainModulus: Modulus
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (encoded: string) => void
  readonly loadArray: (array: Uint8Array) => void
}

const EncryptionParametersConstructor = (
  library: Library
): EncryptionParametersDependencies => ({
  Exception,
  ComprModeType,
  Modulus,
  SchemeType,
  Vector
}: EncryptionParametersDependencyOptions): EncryptionParametersConstructorOptions => (
  schemeType: SchemeType = SchemeType.none
): EncryptionParameters => {
  const Constructor = library.EncryptionParameters
  let _instance = new Constructor(schemeType)

  /**
   * @implements EncryptionParameters
   */

  /**
   * @interface EncryptionParameters
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name EncryptionParameters#instance
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
     * @name EncryptionParameters#unsafeInject
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
     * @name EncryptionParameters#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
    },

    /**
     * Sets the degree of the polynomial modulus parameter to the specified value.
     * The polynomial modulus directly affects the number of coefficients in
     * PlainText polynomials, the size of CipherText elements, the computational
     * performance of the scheme (bigger is worse), and the security level (bigger
     * is better). In Microsoft SEAL the degree of the polynomial modulus must be a power
     * of 2 (e.g.  1024, 2048, 4096, 8192, 16384, or 32768).
     *
     * @function
     * @name EncryptionParameters#setPolyModulusDegree
     * @param {number} polyModulusDegree The degree of the polynomial modulus
     */
    setPolyModulusDegree(polyModulusDegree: number) {
      try {
        _instance.setPolyModulusDegree(polyModulusDegree)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Sets the coefficient modulus parameter. The coefficient modulus consists
     * of a list of distinct prime numbers, and is represented by a vector of
     * Modulus objects. The coefficient modulus directly affects the size
     * of CipherText elements, the amount of computation that the scheme can perform
     * (bigger is better), and the security level (bigger is worse). In Microsoft SEAL each
     * of the prime numbers in the coefficient modulus must be at most 60 bits,
     * and must be congruent to 1 modulo 2*degree(poly_modulus).
     *
     * @function
     * @name EncryptionParameters#setCoeffModulus
     * @param {Vector} coeffModulus Vector of Modulus primes
     */
    setCoeffModulus(coeffModulus: Vector) {
      try {
        _instance.setCoeffModulus(coeffModulus.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Sets the PlainText modulus parameter. The PlainText modulus is an integer
     * modulus represented by the Modulus class. The PlainText modulus
     * determines the largest coefficient that PlainText polynomials can represent.
     * It also affects the amount of computation that the scheme can perform
     * (bigger is worse). In Microsoft SEAL the PlainText modulus can be at most 60 bits
     * long, but can otherwise be any integer. Note, however, that some features
     * (e.g. batching) require the PlainText modulus to be of a particular form.
     *
     * @function
     * @name EncryptionParameters#setPlainModulus
     * @param {Modulus} plainModulus PlainText modulus parameter
     */
    setPlainModulus(plainModulus: Modulus) {
      try {
        _instance.setPlainModulus(plainModulus.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * The encryption scheme type.
     *
     * @readonly
     * @name EncryptionParameters#scheme
     * @type {SchemeType.none|SchemeType.BFV|SchemeType.CKKS}
     */
    get scheme() {
      return _instance.scheme()
    },

    /**
     * The degree of the polynomial modulus parameter.
     *
     * @readonly
     * @name EncryptionParameters#polyModulusDegree
     * @type {number}
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * Returns the currently set coefficient modulus parameter.
     *
     * @readonly
     * @name EncryptionParameters#coeffModulus
     * @type {BigUint64Array}
     */
    get coeffModulus() {
      const tempVect = Vector()
      const instance = _instance.coeffModulus()
      tempVect.unsafeInject(instance)
      tempVect.setType('Modulus')
      const tempArr = tempVect.toArray() as BigUint64Array
      tempVect.delete()
      return tempArr
    },

    /**
     * Returns the currently set PlainText modulus parameter.
     *
     * @readonly
     * @name EncryptionParameters#plainModulus
     * @type {Modulus}
     */
    get plainModulus() {
      const instance = _instance.plainModulus()
      const smallModulus = Modulus(BigInt(0))
      smallModulus.inject(instance)
      return smallModulus
    },

    /**
     * Save the Encryption Parameters to a base64 string
     *
     * @function
     * @name EncryptionParameters#save
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {string} base64 encoded string
     */
    save(compression: ComprModeType = ComprModeType.deflate): string {
      return _instance.saveToString(compression)
    },

    /**
     * Save the Encryption Parameters as a binary Uint8Array
     *
     * @function
     * @name EncryptionParameters#saveArray
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {Uint8Array} A byte array containing the CipherText in binary form
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
     * Load the Encryption Parameters from a base64 string
     *
     * @function
     * @name EncryptionParameters#load
     * @param {string} encoded base64 encoded string
     */
    load(encoded: string) {
      try {
        _instance.loadFromString(encoded)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Load the Encryption Parameters from an Uint8Array holding binary data
     *
     * @function
     * @name EncryptionParameters#loadArray
     * @param {Uint8Array} array TypedArray containing binary data
     */
    loadArray(array: Uint8Array) {
      try {
        _instance.loadFromArray(array)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}

export const EncryptionParametersInit = ({
  loader
}: LoaderOptions): EncryptionParametersDependencies => {
  const library: Library = loader.library
  return EncryptionParametersConstructor(library)
}
