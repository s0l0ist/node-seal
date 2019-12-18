import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

/**
 * SmallModulus
 * @typedef {Object} SmallModulus
 * @constructor
 */
export const SmallModulus = ({ library }) => {
  const _Exception = Exception({ library })
  const _saveToString = library.SmallModulus.saveToString
  // const _createFromString = library.SmallModulus.createFromString
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.SmallModulus()
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
     * @param {instance} options.instance - wasm instance
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
     * Loads a SmallModulus from a string representing an uint64 value.
     * @param {string} value - string representation of a uint64 value
     */
    setValue({ value }) {
      try {
        _instance.loadFromString(value + '')
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
     * Returns the value of the current SmallModulus as a string.
     *
     * It's a string because JS does not support uint64
     * data type very well
     * @returns {string} integer value of the SmallModulus
     */
    get value() {
      return _instance.Value()
    },

    /**
     * Returns the significant bit count of the value of the current SmallModulus.
     * @returns {number} - significant bit count of the value of the current SmallModulus
     */
    get bitCount() {
      return _instance.bitCount()
    },

    /**
     * Returns whether the value of the current SmallModulus is zero.
     * @returns {boolean} - value of the current SmallModulus is zero
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     * Returns whether the value of the current SmallModulus is a prime number.
     * @returns {boolean} - value of the current SmallModulus is a prime number
     */
    get isPrime() {
      return _instance.isPrime()
    },

    /**
     * Save the SmallModulus as a base64 string
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression=ComprModeType.deflate] - activate compression
     * @returns {string} - base64 encoded string
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _saveToString(compression)
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
