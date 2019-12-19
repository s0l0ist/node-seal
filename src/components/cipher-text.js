import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

/**
 * CipherText
 * @typedef {Object} CipherText
 * @constructor
 */
export const CipherText = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.Ciphertext()
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(
      typeof e === 'number'
        ? _Exception.getHuman(e)
        : e instanceof Error
        ? e.message
        : e
    )
  }

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     * @private
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {Object} options Options
     * @param {instance} options.instance wasm instance
     * @private
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Returns the number of primes in the coefficient modulus of the
     * associated encryption parameters. This directly affects the
     * allocation size of the ciphertext.
     * @returns {number} number of primes in the coefficient modulus
     */
    get coeffModCount() {
      return _instance.coeffModCount()
    },

    /**
     * Returns the degree of the polynomial modulus of the associated
     * encryption parameters. This directly affects the allocation size
     * of the ciphertext.
     * @returns {number} degree of the polynomial modulus
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * Returns the size of the ciphertext.
     * @returns {number} size of the ciphertext
     */
    get size() {
      return _instance.size()
    },

    /**
     * Returns the capacity of the allocation. This means the largest size
     * of the ciphertext that can be stored in the current allocation with
     * the current encryption parameters.
     * @returns {number} capacity of the allocation
     */
    get sizeCapacity() {
      return _instance.sizeCapacity()
    },

    /**
     * Check whether the current ciphertext is transparent, i.e. does not require
     * a secret key to decrypt. In typical security models such transparent
     * ciphertexts would not be considered to be valid. Starting from the second
     * polynomial in the current ciphertext, this function returns true if all
     * following coefficients are identically zero. Otherwise, returns false.
     * @returns {boolean} ciphertext is transparent
     */
    get isTransparent() {
      return _instance.isTransparent()
    },

    /**
     * Returns whether the ciphertext is in NTT form.
     * @returns {boolean} ciphertext is in NTT form
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * Returns a reference to parmsId.
     * @see EncryptionParameters for more information about parmsId.
     * @returns {pointer} pointer to the parmsId
     */
    get parmsId() {
      return _instance.parmsId()
    },

    /**
     * Returns a reference to the scale. This is only needed when using the
     * CKKS encryption scheme. The user should have little or no reason to ever
     * change the scale by hand.
     * @returns {pointer} pointer to the scale
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * Returns the currently used MemoryPoolHandle.
     * @returns {pointer} pointer to the MemoryPoolHandle
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save a cipherText to a base64 string
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression=ComprModeType.deflate] activate compression
     * @returns {string} base64 encoded string
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Load a cipherText from a base64 string
     * @param {Object} options Options
     * @param {Context} options.context Encryption context to enforce
     * @param {string} options.encoded base64 encoded string
     */
    load({ context, encoded }) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    }
  }
}
