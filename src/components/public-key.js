export const PublicKey = library => (Exception, ComprModeType) => (
  instance = null
) => {
  const Constructor = library.PublicKey
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
   * @implements PublicKey
   */

  /**
   * @interface PublicKey
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name PublicKey#instance
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
     * @name PublicKey#inject
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
     * @name PublicKey#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Save the PublicKey to a base64 string
     *
     * @function
     * @name PublicKey#save
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
     * Load a PublicKey from a base64 string
     *
     * @function
     * @name PublicKey#load
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
     * Copy an existing PublicKey and overwrite this instance
     *
     * @function
     * @name PublicKey#copy
     * @param {PublicKey} key PublicKey to copy
     * @example
     * const keyA = keyGenerator.getPublicKey()
     * const keyB = Morfix.PublicKey()
     * keyB.copy(keyA)
     * // keyB holds a copy of keyA
     */
    copy(key) {
      try {
        _instance.copy(key.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Clone and return a new instance of this PublicKey
     *
     * @function
     * @name PublicKey#clone
     * @returns {PublicKey}
     * @example
     * const keyA = keyGenerator.getPublicKey()
     * const keyB = keyA.clone()
     * // keyB holds a copy of keyA
     */
    clone() {
      try {
        const clonedInstance = _instance.clone()
        return PublicKey(library)(Exception, ComprModeType)(clonedInstance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a PublicKey into this one and delete the old reference
     *
     * @function
     * @name PublicKey#move
     * @param {PublicKey} key PublicKey to move
     * @example
     * const keyA = keyGenerator.getPublicKey()
     * const keyB = Morfix.PublicKey()
     * keyB.move(keyA)
     * // keyB holds a the instance of keyA.
     * // keyA no longer holds an instance
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
