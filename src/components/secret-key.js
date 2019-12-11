export const SecretKey = ({library}) => {

  const _ComprModeType = library.ComprModeType
  let _instance = new library.SecretKey()

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
     * Save the SecretKey to a base64 string
     *
     * By default, we don't use compression on the SecretKey
     *
     * @returns {string}
     */
    save({compression = _ComprModeType.none} = {}) {
      return _instance.saveToString(compression)
    },

    /**
     * Load a SecretKey from a base64 string
     *
     * @param context
     * @param encoded
     */
    load({context, encoded}) {
      _instance.loadFromString(context.instance, encoded)
    }
  }
}
