export const PublicKey = ({library}) => {

  const _ComprModeType = library.ComprModeType
  let _instance = new library.PublicKey()

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
     * Save the PublicKey to a base64 string
     *
     * @returns {string}
     */
    save({compression = _ComprModeType.deflate} = {}) {
      return _instance.saveToString(compression)
    },

    /**
     * Load a PublicKey from a base64 string
     *
     * @param context
     * @param encoded
     */
    load({context, encoded}) {
      _instance.loadFromString(context.instance, encoded)
    }
  }
}
