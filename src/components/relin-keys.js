export const RelinKeys = ({library}) => {

  const _ComprModeType = library.ComprModeType
  let _instance = new library.RelinKeys()

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
     * Save the RelinKeys to a base64 string
     *
     * @returns {string}
     */
    save({compression = _ComprModeType.deflate} = {}) {
      return _instance.saveToString(compression)
    },

    /**
     * Load a set of RelinKeys from a base64 string
     *
     * @param context
     * @param encoded
     */
    load({context, encoded}) {
      _instance.loadFromString(context.instance, encoded)
    }
  }
}
