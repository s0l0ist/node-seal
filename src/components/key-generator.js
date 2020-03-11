export const KeyGenerator = library => (
  Exception,
  PublicKey,
  SecretKey,
  RelinKeys,
  GaloisKeys
) => (context, secretKey = null, publicKey = null) => {
  const Constructor = library.KeyGenerator

  const constructInstance = (secretKey, publicKey) => {
    try {
      if (secretKey && publicKey) {
        return new Constructor(
          context.instance,
          secretKey.instance,
          publicKey.instance
        )
      }
      if (secretKey && !publicKey) {
        return new Constructor(context.instance, secretKey.instance)
      }
      return new Constructor(context.instance)
    } catch (e) {
      throw Exception.safe(e)
    }
  }
  let _instance = constructInstance(secretKey, publicKey)

  /**
   * @implements KeyGenerator
   */

  /**
   * @interface KeyGenerator
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name KeyGenerator#instance
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
     * @name KeyGenerator#inject
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
     * @name KeyGenerator#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Return the generated SecretKey
     *
     * @function
     * @name KeyGenerator#getSecretKey
     * @returns {SecretKey} The secret key that was generated upon instantiation of this KeyGenerator
     */
    getSecretKey() {
      try {
        const key = SecretKey()
        const instance = _instance.getSecretKey()
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Return the generated PublicKey
     *
     * @function
     * @name KeyGenerator#getPublicKey
     * @returns {PublicKey} The public key that was generated upon instantiation of this KeyGenerator
     */
    getPublicKey() {
      try {
        const key = PublicKey()
        const instance = _instance.getPublicKey()
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generate and return a set of RelinKeys
     *
     * @function
     * @name KeyGenerator#genRelinKeys
     * @returns {RelinKeys} New RelinKeys from the KeyGenerator's internal secret key
     */
    genRelinKeys() {
      try {
        const key = RelinKeys()
        const instance = _instance.createRelinKeys()
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generate and return a set of GaloisKeys
     *
     * @function
     * @name KeyGenerator#genGaloisKeys
     * @returns {GaloisKeys} New GaloisKeys from the KeyGenerator's internal secret key
     */
    genGaloisKeys() {
      try {
        const key = GaloisKeys()
        const instance = _instance.createGaloisKeys()
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
