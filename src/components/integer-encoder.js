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
   * @implements IntegerEncoder
   */

  /**
   * @interface IntegerEncoder
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IntegerEncoder#instance
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
     * @name IntegerEncoder#inject
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
     * @name IntegerEncoder#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Encode an Int32 value to a PlainText
     *
     * @function
     * @name IntegerEncoder#encodeInt32
     * @param {Object} options Options
     * @param {Number} options.value Integer to encode
     * @param {PlainText} options.destination PlainText to store the encoded data
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
     * @name IntegerEncoder#encodeUInt32
     * @param {Object} options Options
     * @param {Number} options.value Unsigned integer to encode
     * @param {PlainText} options.destination PlainText to store the encoded data
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
     * @name IntegerEncoder#decodeInt32
     * @param {Object} options Options
     * @param {PlainText} options.plainText PlainText to decode
     * @returns {Number} Int32 value
     */
    decodeInt32({ plainText }) {
      try {
        return _instance.decodeInt32(plainText.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Decode an UInt32 value from a PlainText
     *
     * @function
     * @name IntegerEncoder#decodeUInt32
     * @param {Object} options Options
     * @param {PlainText} options.plainText PlainText to decode
     * @returns {Number} Uint32 value
     */
    decodeUInt32({ plainText }) {
      try {
        return _instance.decodeUInt32(plainText.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
