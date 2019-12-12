export const IntegerEncoder = ({library, context}) => {

  const _getException = library.getException
  let _instance = null
  try {
    _instance = new library.IntegerEncoder(context.instance)
  } catch (e) {
    throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
  }

  return {
    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Encode an Int32 value
     *
     * @param value
     */
    encodeInt32({value}) {
      try {
        _instance.encodeInt32(value)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Encode an UInt32 value
     *
     * @param value
     */
    encodeUInt32({value}) {
      try {
        _instance.encodeUInt32(value)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },
    /**
     * Decode an Int32 value
     *
     * @param value
     */
    decodeInt32({plainText}) {
      try {
        _instance.decodeInt32(plainText.instance)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Decode an UInt32 value
     *
     * @param value
     */
    decodeUInt32({plainText}) {
      try {
        _instance.decodeUInt32(plainText.instance)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    }
  }
}
