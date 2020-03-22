export const IntegerEncoder = library => ({
  Exception,
  PlainText
}) => context => {
  const Constructor = library.IntegerEncoder
  let _instance = null
  try {
    _instance = new Constructor(context.instance)
  } catch (e) {
    throw Exception.safe(e)
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
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name IntegerEncoder#unsafeInject
     * @param {instance} instance WASM instance
     */
    unsafeInject(instance) {
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
     * @param {Number} value Integer to encode
     * @param {PlainText} [destination=null] PlainText to store the encoded data
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     */
    encodeInt32(value, destination = null) {
      try {
        if (destination) {
          _instance.encodeInt32(value, destination.instance)
          return
        }
        const tempPlain = PlainText()
        _instance.encodeInt32(value, tempPlain.instance)
        return tempPlain
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Encode an UInt32 value to a PlainText
     *
     * @function
     * @name IntegerEncoder#encodeUInt32
     * @param {Number} value Unsigned integer to encode
     * @param {PlainText} [destination=null] PlainText to store the encoded data
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     */
    encodeUInt32(value, destination = null) {
      try {
        if (destination) {
          _instance.encodeUInt32(value, destination.instance)
          return
        }
        const tempPlain = PlainText()
        _instance.encodeUInt32(value, tempPlain.instance)
        return tempPlain
      } catch (e) {
        throw Exception.safe(e)
      }
    },
    /**
     * Decode an Int32 value from a PlainText
     *
     * @function
     * @name IntegerEncoder#decodeInt32
     * @param {PlainText} plainText PlainText to decode
     * @returns {Number} Int32 value
     */
    decodeInt32(plainText) {
      try {
        return _instance.decodeInt32(plainText.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Decode an UInt32 value from a PlainText
     *
     * @function
     * @name IntegerEncoder#decodeUInt32
     * @param {PlainText} plainText PlainText to decode
     * @returns {Number} Uint32 value
     */
    decodeUInt32(plainText) {
      try {
        return _instance.decodeUInt32(plainText.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
