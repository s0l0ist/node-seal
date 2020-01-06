import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

export const CipherText = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.Ciphertext()
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} CipherText
   * @implements ICipherText
   */

  /**
   * @interface ICipherText
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name ICipherText#instance
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
     * @name ICipherText#inject
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
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name ICipherText#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * The number of primes in the coefficient modulus of the
     * associated encryption parameters. This directly affects the
     * allocation size of the CipherText.
     *
     * @readonly
     * @name ICipherText#coeffModCount
     * @type {Number}
     */
    get coeffModCount() {
      return _instance.coeffModCount()
    },

    /**
     * The degree of the polynomial modulus of the associated
     * encryption parameters. This directly affects the allocation size
     * of the CipherText.
     *
     * @readonly
     * @name ICipherText#polyModulusDegree
     * @type {Number}
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * The size of the CipherText.
     *
     * @readonly
     * @name ICipherText#size
     * @type {Number}
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
     * @name ICipherText#sizeCapacity
     * @type {Number}
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
     * @name ICipherText#isTransparent
     * @type {Boolean}
     */
    get isTransparent() {
      return _instance.isTransparent()
    },

    /**
     * Whether the CipherText is in NTT form.
     *
     * @readonly
     * @name ICipherText#isNttForm
     * @type {Boolean}
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * The reference to parmsId.
     * @see {@link EncryptionParameters} for more information about parmsId.
     *
     * @readonly
     * @name ICipherText#parmsId
     * @type {parmsId}
     */
    get parmsId() {
      return _instance.parmsId()
    },

    /**
     * The reference to the scale. This is only needed when using the
     * CKKS encryption scheme. The user should have little or no reason to ever
     * change the scale by hand.
     *
     * @readonly
     * @name ICipherText#scale
     * @type {Number}
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * The currently used MemoryPoolHandle.
     *
     * @readonly
     * @name ICipherText#pool
     * @type {MemoryPoolHandle}
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save a cipherText to a base64 string
     *
     * @function
     * @name ICipherText#save
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
     * Load a cipherText from a base64 string
     *
     * @function
     * @name ICipherText#load
     * @param {Object} options Options
     * @param {Context} options.context Encryption context to enforce
     * @param {String} options.encoded base64 encoded string
     */
    load({ context, encoded }) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
