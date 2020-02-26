export const KeyGenerator = library => (
  Exception,
  PublicKey,
  SecretKey,
  RelinKeys,
  GaloisKeys
) => (context, secretKey = null, publicKey = null) => {
  const constructInstance = (secretKey, publicKey) => {
    try {
      if (secretKey && publicKey) {
        return new library.KeyGenerator(
          context.instance,
          secretKey.instance,
          publicKey.instance
        )
      }
      if (secretKey && !publicKey) {
        return new library.KeyGenerator(context.instance, secretKey.instance)
      }
      return new library.KeyGenerator(context.instance)
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
      _instance = instance
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
        return SecretKey(_instance.getSecretKey())
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
        return PublicKey(_instance.getPublicKey())
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
        return RelinKeys(_instance.createRelinKeys())
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
        return GaloisKeys(_instance.createGaloisKeys())
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
