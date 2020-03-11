export const RelinKeys = library => (Exception, ComprModeType) => (
  instance = null
) => {
  const Constructor = library.RelinKeys
  let _instance
  try {
    if (instance) {
      _instance = new Constructor(instance)
      instance.delete()
    } else {
      _instance = new Constructor()
    }
  } catch (e) {
    throw Exception.safe(e)
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
      _instance = new Constructor(instance)
      instance.delete()
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
     * Returns the current number of keyswitching keys. Only keys that are
     * non-empty are counted.
     *
     * @readonly
     * @name RelinKeys#size
     * @type {Number}
     */
    get size() {
      return _instance.size()
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
    },

    /**
     * Copy an existing RelinKeys and overwrite this instance
     *
     * @function
     * @name RelinKeys#copy
     * @param {RelinKeys} key RelinKeys to copy
     */
    copy(key) {
      try {
        _instance.copy(key.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Clone and return a new instance of this RelinKeys
     *
     * @function
     * @name RelinKeys#clone
     * @returns {RelinKeys}
     */
    clone() {
      try {
        const clonedInstance = _instance.clone()
        return RelinKeys(library)(Exception, ComprModeType)(clonedInstance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a RelinKeys into this one and delete the old reference
     *
     * @function
     * @name RelinKeys#move
     * @param {RelinKeys} key RelinKeys to move
     */
    move(key) {
      try {
        _instance.move(key.instance)
        // TODO: find optimization
        // This method results in a copy instead of a real move.
        // Therefore, we need to delete the old instance.
        key.delete()
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
