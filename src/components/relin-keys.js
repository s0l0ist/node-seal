export const RelinKeys = library => (Exception, ComprModeType) => (
  instance = null
) => {
  let _instance = instance

  if (!instance) {
    try {
      _instance = new library.RelinKeys()
    } catch (e) {
      throw Exception.safe(e)
    }
  }

  /**
   * @implements RelinKeys
   */

  /**
   * @interface RelinKeys
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name RelinKeys#instance
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
     * @name RelinKeys#inject
     * @param {instance} instance WASM instance
     */
    inject(instance) {
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
     * @name RelinKeys#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Save the RelinKeys to a base64 string
     *
     * @function
     * @name RelinKeys#save
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    save(compression = ComprModeType.deflate) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Load a set of RelinKeys from a base64 string
     *
     * @function
     * @name RelinKeys#load
     * @param {Context} context Encryption context to enforce
     * @param {String} encoded Base64 encoded string
     */
    load(context, encoded) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
