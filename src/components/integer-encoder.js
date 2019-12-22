import { Exception } from './exception'

export const IntegerEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  let _instance = null
  try {
    _instance = new library.IntegerEncoder(context.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} IntegerEncoder
   * @implements IIntegerEncoder
   */

  /**
   * @interface IIntegerEncoder
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IIntegerEncoder#instance
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
     * @name IIntegerEncoder#inject
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
     * Encode an Int32 value to a PlainText
     *
     * @function
     * @name IIntegerEncoder#encodeInt32
     * @param {Object} options Options
     * @param {Number} options.value Integer to encode
     * @param {PlainText} options.destination Plaintext to store the encoded data
     */
    encodeInt32({ value, destination }) {
      try {
        _instance.encodeInt32(value, destination.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Encode an UInt32 value to a PlainText
     *
     * @function
     * @name IIntegerEncoder#encodeUInt32
     * @param {Object} options Options
     * @param {Number} options.value Unsigned integer to encode
     * @param {PlainText} options.destination Plaintext to store the encoded data
     */
    encodeUInt32({ value, destination }) {
      try {
        _instance.encodeUInt32(value, destination.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },
    /**
     * Decode an Int32 value from a PlainText
     *
     * @function
     * @name IIntegerEncoder#decodeInt32
     * @param {Object} options Options
     * @param {PlainText} options.plainText Plaintext to decode
     * @returns {Number} Int32 value
     */
    decodeInt32({ plainText }) {
      try {
        _instance.decodeInt32(plainText.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Decode an UInt32 value from a PlainText
     *
     * @function
     * @name IIntegerEncoder#decodeUInt32
     * @param {Object} options Options
     * @param {PlainText} options.plainText Plaintext to decode
     * @returns {Number} Uint32 value
     */
    decodeUInt32({ plainText }) {
      try {
        _instance.decodeUInt32(plainText.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
