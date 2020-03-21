export const SecretKey = library => ({ Exception, ComprModeType }) => (
  instance = null
) => {
  const Constructor = library.SecretKey
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
      _instance = new Constructor(instance)
      instance.delete()
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
    },

    /**
     * Copy an existing SecretKey and overwrite this instance
     *
     * @function
     * @name SecretKey#copy
     * @param {SecretKey} key SecretKey to copy
     * @example
     * const keyA = keyGenerator.getSecretKey()
     * const keyB = Morfix.SecretKey()
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
     * Clone and return a new instance of this SecretKey
     *
     * @function
     * @name SecretKey#clone
     * @returns {SecretKey}
     * @example
     * const keyA = keyGenerator.getSecretKey()
     * const keyB = keyA.clone()
     * // keyB holds a copy of keyA
     */
    clone() {
      try {
        const clonedInstance = _instance.clone()
        return SecretKey(library)({ Exception, ComprModeType })(clonedInstance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a SecretKey into this one and delete the old reference
     *
     * @function
     * @name SecretKey#move
     * @param {SecretKey} key SecretKey to move
     * @example
     * const keyA = keyGenerator.getSecretKey()
     * const keyB = Morfix.SecretKey()
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
