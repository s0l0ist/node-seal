export const IntegerEncoder = ({library, context}) => {

  let _instance = new library.IntegerEncoder(context.instance)

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
      _instance.encodeInt32(value)
    },

    /**
     * Encode an UInt32 value
     *
     * @param value
     */
    encodeUInt32({value}) {
      _instance.encodeUInt32(value)
    },
    /**
     * Decode an Int32 value
     *
     * @param value
     */
    decodeInt32({plainText}) {
      _instance.decodeInt32(plainText.instance)
    },

    /**
     * Decode an UInt32 value
     *
     * @param value
     */
    decodeUInt32({plainText}) {
      _instance.decodeUInt32(plainText.instance)
    }
  }
}
