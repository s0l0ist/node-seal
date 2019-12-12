export const PublicKey = ({library}) => {

  const _getException = library.getException
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
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException({ pointer: e }) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Load a PublicKey from a base64 string
     *
     * @param context
     * @param encoded
     */
    load({context, encoded}) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException({ pointer: e }) : e instanceof Error ? e.message : e)
      }
    }
  }
}
