import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

export const EncryptionParameters = ({ library, schemeType }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.EncryptionParameters(schemeType)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} EncryptionParameters
   * @implements IEncryptionParameters
   */

  /**
   * @interface IEncryptionParameters
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IEncryptionParameters#instance
     * @type {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name IEncryptionParameters#inject
     * @param {Object} options Options
     * @param {instance} options.instance WASM instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
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
     * @name IEncryptionParameters#setPolyModulusDegree
     * @param {Object} options Options
     * @param {Number} options.polyModulusDegree The degree of the polynomial modulus
     */
    setPolyModulusDegree({ polyModulusDegree }) {
      try {
        _instance.setPolyModulusDegree(polyModulusDegree)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Sets the coefficient modulus parameter. The coefficient modulus consists
     * of a list of distinct prime numbers, and is represented by a vector of
     * SmallModulus objects. The coefficient modulus directly affects the size
     * of CipherText elements, the amount of computation that the scheme can perform
     * (bigger is better), and the security level (bigger is worse). In Microsoft SEAL each
     * of the prime numbers in the coefficient modulus must be at most 60 bits,
     * and must be congruent to 1 modulo 2*degree(poly_modulus).
     *
     * @function
     * @name IEncryptionParameters#setCoeffModulus
     * @param {Object} options Options
     * @param {Vector} options.coeffModulus Vector of SmallModulus primes
     */
    setCoeffModulus({ coeffModulus }) {
      try {
        _instance.setCoeffModulus(coeffModulus)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Sets the PlainText modulus parameter. The PlainText modulus is an integer
     * modulus represented by the SmallModulus class. The PlainText modulus
     * determines the largest coefficient that PlainText polynomials can represent.
     * It also affects the amount of computation that the scheme can perform
     * (bigger is worse). In Microsoft SEAL the PlainText modulus can be at most 60 bits
     * long, but can otherwise be any integer. Note, however, that some features
     * (e.g. batching) require the PlainText modulus to be of a particular form.
     *
     * @function
     * @name IEncryptionParameters#setPlainModulus
     * @param {Object} options Options
     * @param {SmallModulus} options.plainModulus PlainText modulus parameter
     */
    setPlainModulus({ plainModulus }) {
      try {
        _instance.setPlainModulus(plainModulus)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The encryption scheme type.
     *
     * @readonly
     * @name IEncryptionParameters#scheme
     * @type {SchemeType}
     */
    get scheme() {
      return _instance.scheme()
    },

    /**
     * The degree of the polynomial modulus parameter.
     *
     * @readonly
     * @name IEncryptionParameters#polyModulusDegree
     * @type {Number}
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * Returns the currently set coefficient modulus parameter.
     *
     * @readonly
     * @name IEncryptionParameters#coeffModulus
     * @type {Vector<SmallModulus>}
     */
    get coeffModulus() {
      return _instance.coeffModulus()
    },

    /**
     * Returns the currently set PlainText modulus parameter.
     *
     * @readonly
     * @name IEncryptionParameters#plainModulus
     * @type {SmallModulus}
     */
    get plainModulus() {
      return _instance.plainModulus()
    },

    /**
     * Save the Encryption Parameters to a base64 string
     *
     * @function
     * @name IEncryptionParameters#save
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression=ComprModeType.deflate] The compression mode to use
     * @returns {String} base64 encoded string
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Load the Encryption Parameters from a base64 string
     *
     * @function
     * @name IEncryptionParameters#load
     * @param {Object} options Options
     * @param {String} options.encoded base64 encoded string
     */
    load({ encoded }) {
      try {
        _instance.loadFromString(encoded)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
