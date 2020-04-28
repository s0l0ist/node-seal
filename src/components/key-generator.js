export const KeyGenerator = library => ({
  Exception,
  PublicKey,
  SecretKey,
  RelinKeys,
  GaloisKeys,
  ComprModeType
}) => (context, secretKey = null, publicKey = null) => {
  const Constructor = library.KeyGenerator
  let _instance = constructInstance(context, secretKey, publicKey)

  function constructInstance(context, secretKey, publicKey) {
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
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name KeyGenerator#unsafeInject
     * @param {instance} instance WASM instance
     */
    unsafeInject(instance) {
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
      const key = SecretKey()
      const instance = _instance.getSecretKey()
      key.inject(instance)
      return key
    },

    /**
     * Return the generated PublicKey
     *
     * @function
     * @name KeyGenerator#getPublicKey
     * @returns {PublicKey} The public key that was generated upon instantiation of this KeyGenerator
     */
    getPublicKey() {
      const key = PublicKey()
      const instance = _instance.getPublicKey()
      key.inject(instance)
      return key
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
        const instance = _instance.genRelinKeysLocal()
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generates and returns GaloisKeys. If provided with an array of steps,
     * this function creates specific GaloisKeys that can be used to apply
     * specific Galois automorphisms on encrypted data. The user needs to give
     * as input a vector of desired Galois rotation step counts, where negative
     * step counts correspond to rotations to the right and positive step counts
     * correspond to rotations to the left. A step count of zero can be used to
     * indicate a column rotation in the BFV scheme complex conjugation in the
     * CKKS scheme.
     *
     * @function
     * @name KeyGenerator#genGaloisKeys
     * @param {Int32Array} [steps=null] Specific Galois Elements to generate
     * @returns {GaloisKeys} New GaloisKeys from the KeyGenerator's internal secret key
     */
    genGaloisKeys(steps = null) {
      try {
        if (steps) {
          const key = GaloisKeys()
          const instance = _instance.genGaloisKeysLocal(steps)
          key.inject(instance)
          return key
        }
        const key = GaloisKeys()
        const instance = _instance.genGaloisKeysLocal(Int32Array.from(0))
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generates and saves Galois keys to a base64 string. If provided with steps,
     * This function creates specific Galois keys that can be used to apply
     * specific Galois automorphisms on encrypted data. The user needs to give
     * as input a vector of Galois elements corresponding to the keys that are
     * to be created.

     * Half of the polynomials in Galois keys are randomly generated and are
     * replaced with the seed used to compress output size. The output is in
     * binary format and not human-readable. The output stream must have the
     * "binary" flag set.
     *
     * @function
     * @name KeyGenerator#galoisKeysSave
     * @param {Int32Array} [steps=null] Specific Galois Elements to generate
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    galoisKeysSave(steps = null, compression = ComprModeType.deflate) {
      try {
        if (steps) {
          return _instance.galoisKeysSave(steps, compression)
        }
        return _instance.galoisKeysSaveAll(compression)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
