export const SmallModulus = library => (Exception, ComprModeType) => () => {
  // Static methods
  const _saveToString = library.SmallModulus.saveToString
  // const _createFromString = library.SmallModulus.createFromString
  let _instance = null
  try {
    _instance = new library.SmallModulus()
  } catch (e) {
    throw Exception.safe(e)
  }

  /**
   * @implements SmallModulus
   */

  /**
   * @interface SmallModulus
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name SmallModulus#instance
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
     * @name SmallModulus#inject
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
     * @name SmallModulus#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Loads a SmallModulus from a string representing an uint64 value.
     *
     * @function
     * @name SmallModulus#setValue
     * @param {String} value String representation of a uint64 value
     */
    setValue(value) {
      try {
        _instance.loadFromString(value + '')
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * The value of the current SmallModulus as a BigInt.
     *
     * @readonly
     * @name SmallModulus#value
     * @type {BigInt}
     */
    get value() {
      // eslint-disable-next-line no-undef
      return BigInt(_instance.value())
    },

    /**
     * The significant bit count of the value of the current SmallModulus.
     *
     * @readonly
     * @name SmallModulus#bitCount
     * @type {Number}
     */
    get bitCount() {
      return _instance.bitCount()
    },

    /**
     * Whether the value of the current SmallModulus is zero.
     *
     * @readonly
     * @name SmallModulus#isZero
     * @type {Boolean}
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     * Whether the value of the current SmallModulus is a prime number.
     *
     * @readonly
     * @name SmallModulus#isPrime
     * @type {Boolean}
     */
    get isPrime() {
      return _instance.isPrime()
    },

    /**
     * Save the SmallModulus as a base64 string
     *
     * @function
     * @name SmallModulus#save
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    save(compression = ComprModeType.deflate) {
      try {
        return _saveToString(compression)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
