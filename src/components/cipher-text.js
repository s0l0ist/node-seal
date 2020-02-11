import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'
import { ParmsIdType } from './parms-id-type'

export const CipherText = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  const _library = library
  let _instance = null
  try {
    _instance = new library.Ciphertext()
  } catch (e) {
    throw _Exception.safe({ error: e })
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
     * @name CipherText#inject
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
     * @name CipherText#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Allocates enough memory to accommodate the backing array of a ciphertext
     * with given capacity. In addition to the capacity, the allocation size is
     * determined by the current encryption parameters.
     *
     * @function
     * @name CipherText#reserve
     * @param {Object} options Options
     * @param {Number} options.capacity The capacity to reserve
     */
    reserve({ capacity }) {
      try {
        return _instance.reserve(capacity)
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @param {Object} options Options
     * @param {Number} options.size The new size
     */
    resize({ size }) {
      try {
        return _instance.resize(size)
      } catch (e) {
        throw _Exception.safe({ error: e })
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
      try {
        return _instance.release()
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The number of primes in the coefficient modulus of the
     * associated encryption parameters. This directly affects the
     * allocation size of the CipherText.
     *
     * @readonly
     * @name CipherText#coeffModCount
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
     * @name CipherText#polyModulusDegree
     * @type {Number}
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * The size of the CipherText.
     *
     * @readonly
     * @name CipherText#size
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
     * @name CipherText#sizeCapacity
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
     * @name CipherText#isTransparent
     * @type {Boolean}
     */
    get isTransparent() {
      return _instance.isTransparent()
    },

    /**
     * Whether the CipherText is in NTT form.
     *
     * @readonly
     * @name CipherText#isNttForm
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
     * @name CipherText#parmsId
     * @type {ParmsIdType}
     */
    get parmsId() {
      const instance = _instance.parmsId()
      const parmsId = ParmsIdType({ library: _library })
      parmsId.inject({ instance })
      return parmsId
    },

    /**
     * The reference to the scale. This is only needed when using the
     * CKKS encryption scheme. The user should have little or no reason to ever
     * change the scale by hand.
     *
     * @readonly
     * @name CipherText#scale
     * @type {Number}
     */
    get scale() {
      return _instance.scale()
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
     * Save a cipherText to a base64 string
     *
     * @function
     * @name CipherText#save
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression={@link ComprModeType.deflate}] The compression mode to use
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
     * @name CipherText#load
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
