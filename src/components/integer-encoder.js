import { Exception } from './exception'

/**
 * IntegerEncoder
 * @typedef {Object} IntegerEncoder
 * @constructor
 */
export const IntegerEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  let _instance = null
  try {
    _instance = new library.IntegerEncoder(context.instance)
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
     * Encode an Int32 value to a PlainText
     * @param {Object} options Options
     * @param {number} options.value Integer to encode
     * @param {PlainText} options.destination Plaintext to store the encoded data
     */
    encodeInt32({ value, destination }) {
      try {
        _instance.encodeInt32(value, destination.instance)
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
     * Encode an UInt32 value to a PlainText
     * @param {Object} options Options
     * @param {number} options.value Unsigned integer to encode
     * @param {PlainText} options.destination Plaintext to store the encoded data
     */
    encodeUInt32({ value, destination }) {
      try {
        _instance.encodeUInt32(value, destination.instance)
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
     * Decode an Int32 value from a PlainText
     * @param {Object} options Options
     * @param {PlainText} options.plainText Plaintext to decode
     * @returns {number} Int32 value
     */
    decodeInt32({ plainText }) {
      try {
        _instance.decodeInt32(plainText.instance)
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
     * Decode an UInt32 value from a PlainText
     * @param {Object} options Options
     * @param {PlainText} options.plainText Plaintext to decode
     * @returns {number} Uint32 value
     */
    decodeUInt32({ plainText }) {
      try {
        _instance.decodeUInt32(plainText.instance)
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
