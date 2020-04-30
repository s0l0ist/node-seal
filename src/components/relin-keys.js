export const RelinKeys = library => ({
  Exception,
  ComprModeType,
  Vector
}) => () => {
  const Constructor = library.RelinKeys
  let _instance = new Constructor()

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
     * Returns the index of a relinearization key in the backing KSwitchKeys
     * instance that corresponds to the given secret key power, assuming that
     * it exists in the backing KSwitchKeys.
     *
     * @function
     * @name RelinKeys#getIndex
     * @param {Number} keyPower The power of the secret key
     * @returns {Number} The index of the relin key
     */
    getIndex(keyPower) {
      try {
        return _instance.getIndex(keyPower)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Returns whether a relinearization key corresponding to a given power of
     * the secret key exists.
     *
     * @function
     * @name RelinKeys#hasKey
     * @param {Number} keyPower The power of the secret key
     * @returns {Boolean} True if the power exists
     */
    hasKey(keyPower) {
      try {
        return _instance.hasKey(keyPower)
      } catch (e) {
        throw Exception.safe(e)
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
     * Save the RelinKeys as a binary Uint8Array
     *
     * @function
     * @name RelinKeys#saveArray
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {Uint8Array} A byte array containing the RelinKeys in binary form
     */
    saveArray(compression = ComprModeType.deflate) {
      const tempVect = Vector(new Uint8Array(0))
      const instance = _instance.saveToArray(compression)
      tempVect.unsafeInject(instance)
      const tempArr = tempVect.toArray()
      tempVect.delete()
      return tempArr
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
     * Load a RelinKeys from an Uint8Array holding binary data
     *
     * @function
     * @name RelinKeys#loadArray
     * @param {Context} context Encryption context to enforce
     * @param {Uint8Array} array TypedArray containing binary data
     */
    loadArray(context, array) {
      try {
        _instance.loadFromArray(context.instance, array)
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
     * @example
     * const keyA = keyGenerator.relinKeysLocal()
     * const keyB = Morfix.RelinKeys()
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
     * Clone and return a new instance of this RelinKeys
     *
     * @function
     * @name RelinKeys#clone
     * @returns {RelinKeys}
     * @example
     * const keyA = keyGenerator.relinKeysLocal()
     * const keyB = keyA.clone()
     * // keyB holds a copy of keyA
     */
    clone() {
      try {
        const clonedInstance = _instance.clone()
        const relKeys = RelinKeys(library)({
          Exception,
          ComprModeType,
          Vector
        })()
        relKeys.inject(clonedInstance)
        return relKeys
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
     * @example
     * const keyA = keyGenerator.relinKeysLocal()
     * const keyB = Morfix.RelinKeys()
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
