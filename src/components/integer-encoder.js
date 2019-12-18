import { Exception } from './exception'

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
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {instance} instance - wasm instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Encode an Int32 value
     * @param {number} value - Integer to encode
     * @param {PlainText} destination - Plaintext to store the encoded data
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
     * Encode an UInt32 value
     * @param {number} value - Unsigned integer to encode
     * @param {PlainText} destination - Plaintext to store the encoded data
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
     * Decode an Int32 value
     * @param {PlainText} plainText - Plaintext to decode
     * @returns {number} - Int32 value
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
     * Decode an UInt32 value
     * @param {PlainText} plainText - Plaintext to decode
     * @returns {number} - Uint32 value
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
