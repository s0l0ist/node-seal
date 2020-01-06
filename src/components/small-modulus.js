import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

export const SmallModulus = ({ library }) => {
  const _Exception = Exception({ library })
  const _saveToString = library.SmallModulus.saveToString
  // const _createFromString = library.SmallModulus.createFromString
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.SmallModulus()
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} SmallModulus
   * @implements ISmallModulus
   */

  /**
   * @interface ISmallModulus
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name ISmallModulus#instance
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
     * @name ISmallModulus#inject
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
     * @name ISmallModulus#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Loads a SmallModulus from a string representing an uint64 value.
     *
     * @function
     * @name ISmallModulus#setValue
     * @param {String} value String representation of a uint64 value
     */
    setValue({ value }) {
      try {
        _instance.loadFromString(value + '')
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The value of the current SmallModulus as a string.
     *
     * @readonly
     * @name ISmallModulus#value
     * @type {String}
     */
    get value() {
      return _instance.Value()
    },

    /**
     * The significant bit count of the value of the current SmallModulus.
     *
     * @readonly
     * @name ISmallModulus#bitCount
     * @type {Number}
     */
    get bitCount() {
      return _instance.bitCount()
    },

    /**
     * Whether the value of the current SmallModulus is zero.
     *
     * @readonly
     * @name ISmallModulus#isZero
     * @type {Boolean}
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     * Whether the value of the current SmallModulus is a prime number.
     *
     * @readonly
     * @name ISmallModulus#isPrime
     * @type {Boolean}
     */
    get isPrime() {
      return _instance.isPrime()
    },

    /**
     * Save the SmallModulus as a base64 string
     *
     * @function
     * @name ISmallModulus#save
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression=ComprModeType.deflate] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _saveToString(compression)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
