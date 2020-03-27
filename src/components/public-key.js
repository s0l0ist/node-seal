export const PublicKey = library => ({
  Exception,
  ComprModeType,
  Vector
}) => () => {
  const Constructor = library.PublicKey
  let _instance = new Constructor()

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
     * Save the PublicKey as a binary Uint8Array
     *
     * @function
     * @name PublicKey#saveArray
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {Uint8Array} A byte array containing the PublicKey in binary form
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
     * Load a PublicKey from an Uint8Array holding binary data
     *
     * @function
     * @name PublicKey#loadArray
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
        const pubKey = PublicKey(library)({
          Exception,
          ComprModeType,
          Vector
        })()
        pubKey.inject(clonedInstance)
        return pubKey
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
