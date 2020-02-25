export const SecretKey = library => (Exception, ComprModeType) => () => {
  let _instance = null
  try {
    _instance = new library.SecretKey()
  } catch (e) {
    throw Exception.safe(e)
  }

  /**
   * @implements SecretKey
   */

  /**
   * @interface SecretKey
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name SecretKey#instance
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
     * @name SecretKey#inject
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
     * @name SecretKey#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Save the Encryption Parameters to a base64 string
     *
     * @function
     * @name SecretKey#save
     * @param {ComprModeType} [compression={@link ComprModeType.none}] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    save(compression = ComprModeType.none) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Load a SecretKey from a base64 string
     *
     * @function
     * @name SecretKey#load
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
