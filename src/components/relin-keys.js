export const RelinKeys = ({ library }) => {
  const _getException = library.getException
  const _ComprModeType = library.ComprModeType
  let _instance = null
  try {
    _instance = new library.RelinKeys()
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(
      typeof e === 'number'
        ? _getException(e)
        : e instanceof Error
        ? e.message
        : e
    )
  }

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param instance
     */
    inject({ instance }) {
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
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _getException(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Load a set of RelinKeys from a base64 string
     *
     * @param context
     * @param encoded
     */
    load({ context, encoded }) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _getException(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    }
  }
}
