export const GaloisKeys = library => (Exception, ComprModeType) => () => {
  let _instance = null
  try {
    _instance = new library.GaloisKeys()
  } catch (e) {
    throw Exception.safe(e)
  }

  /**
   * @implements GaloisKeys
   */

  /**
   * @interface GaloisKeys
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name GaloisKeys#instance
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
     * @name GaloisKeys#inject
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
     * @name GaloisKeys#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Save the GaloisKeys to a base64 string
     *
     * @function
     * @name GaloisKeys#save
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
     * Load a set of GaloisKeys from a base64 string
     *
     * @function
     * @name GaloisKeys#load
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
