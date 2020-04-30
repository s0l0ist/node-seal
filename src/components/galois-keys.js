export const GaloisKeys = library => ({
  Exception,
  ComprModeType,
  Vector
}) => () => {
  const Constructor = library.GaloisKeys
  let _instance = new Constructor()

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
      _instance = new Constructor(instance)
      instance.delete()
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
     * Returns the current number of keyswitching keys. Only keys that are
     * non-empty are counted.
     *
     * @readonly
     * @name GaloisKeys#size
     * @type {Number}
     */
    get size() {
      return _instance.size()
    },

    /**
     * Returns the index of a Galois key in the backing KSwitchKeys instance that
     * corresponds to the given Galois element, assuming that it exists in the
     * backing KSwitchKeys.
     *
     * @function
     * @name GaloisKeys#getIndex
     * @param {Number} galoisElt The Galois element
     * @returns {Number} The index of the galois element
     */
    getIndex(galoisElt) {
      try {
        return _instance.getIndex(galoisElt)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Returns whether a Galois key corresponding to a given Galois element exists.
     *
     * @function
     * @name GaloisKeys#hasKey
     * @param {Number} galoisElt The Galois element
     * @returns {Boolean} True if the key exists
     */
    hasKey(galoisElt) {
      try {
        return _instance.hasKey(galoisElt)
      } catch (e) {
        throw Exception.safe(e)
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
     * Save the GaloisKeys as a binary Uint8Array
     *
     * @function
     * @name GaloisKeys#saveArray
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {Uint8Array} A byte array containing the GaloisKeys in binary form
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
    },

    /**
     * Load a GaloisKeys from an Uint8Array holding binary data
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
     * Copy an existing GaloisKeys and overwrite this instance
     *
     * @function
     * @name GaloisKeys#copy
     * @param {GaloisKeys} key GaloisKeys to copy
     * @example
     * const keyA = keyGenerator.galoisKeysLocal()
     * const keyB = Morfix.GaloisKeys()
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
     * Clone and return a new instance of this GaloisKeys
     *
     * @function
     * @name GaloisKeys#clone
     * @returns {GaloisKeys}
     * @example
     * const keyA = keyGenerator.galoisKeysLocal()
     * const keyB = keyA.clone()
     * // keyB holds a copy of keyA
     */
    clone() {
      try {
        const clonedInstance = _instance.clone()
        const galKeys = GaloisKeys(library)({
          Exception,
          ComprModeType,
          Vector
        })()
        galKeys.inject(clonedInstance)
        return galKeys
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a GaloisKeys into this one and delete the old reference
     *
     * @function
     * @name GaloisKeys#move
     * @param {GaloisKeys} key GaloisKeys to move
     * @example
     * const keyA = keyGenerator.galoisKeysLocal()
     * const keyB = Morfix.GaloisKeys()
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
