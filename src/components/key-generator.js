export const KeyGenerator = library => ({
  Exception,
  PublicKey,
  SecretKey,
  RelinKeys,
  GaloisKeys,
  Serializable
}) => (context, secretKey = null) => {
  const Constructor = library.KeyGenerator
  let _instance = constructInstance(context, secretKey)

  function constructInstance(context, secretKey) {
    try {
      if (secretKey) {
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
     * Generates and returns relinearization keys. This function returns
     * relinearization keys in a fully expanded form and is meant to be used
     * primarily for demo, testing, and debugging purposes.
     *
     * @function
     * @name KeyGenerator#relinKeysLocal
     * @returns {RelinKeys} New RelinKeys from the KeyGenerator's internal secret key
     */
    relinKeysLocal() {
      try {
        const key = RelinKeys()
        const instance = _instance.relinKeysLocal()
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generates and returns relinearization keys as a serializable object.
     *
     * Half of the key data is pseudo-randomly generated from a seed to reduce
     * the object size. The resulting serializable object cannot be used
     * directly and is meant to be serialized for the size reduction to have an
     * impact.
     *
     * @function
     * @name KeyGenerator#relinKeys
     * @returns {RelinKeys} New RelinKeys from the KeyGenerator's internal secret key
     */
    relinKeys() {
      try {
        const serialized = Serializable()
        const instance = _instance.relinKeys()
        serialized.unsafeInject(instance)
        return serialized
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generates and returns Galois keys. This function returns Galois keys in
     * a fully expanded form and is meant to be used primarily for demo, testing,
     * and debugging purposes. The user can optionally give an input a vector of desired
     * Galois rotation step counts, where negative step counts correspond to
     * rotations to the right and positive step counts correspond to rotations to
     * the left. A step count of zero can be used to indicate a column rotation
     * in the BFV scheme complex conjugation in the CKKS scheme.
     *
     * @function
     * @name KeyGenerator#galoisKeysLocal
     * @param {Int32Array} [steps=null] Specific Galois Elements to generate
     * @returns {GaloisKeys} New GaloisKeys from the KeyGenerator's internal secret key
     */
    galoisKeysLocal(steps = null) {
      try {
        if (steps) {
          const key = GaloisKeys()
          const instance = _instance.galoisKeysLocal(steps)
          key.inject(instance)
          return key
        }
        const key = GaloisKeys()
        const instance = _instance.galoisKeysLocal(Int32Array.from(0))
        key.inject(instance)
        return key
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Generates and returns Galois keys as a serializable object. This function
     * creates specific Galois keys that can be used to apply specific Galois
     * automorphisms on encrypted data. The user can optionally give an input a vector
     * of desired Galois rotation step counts, where negative step counts
     * correspond to rotations to the right and positive step counts correspond
     * to rotations to the left. A step count of zero can be used to indicate
     * a column rotation in the BFV scheme complex conjugation in the CKKS scheme.
     * Half of the key data is pseudo-randomly generated from a seed to reduce
     * the object size. The resulting serializable object cannot be used
     * directly and is meant to be serialized for the size reduction to have an
     * impact.
     *
     * @function
     * @name KeyGenerator#galoisKeys
     * @param {Int32Array} [steps=null] Specific Galois Elements to generate
     * @returns {String} Base64 encoded string
     */
    galoisKeys(steps = null) {
      try {
        if (steps) {
          const serialized = Serializable()
          const instance = _instance.galoisKeys(steps)
          serialized.unsafeInject(instance)
          return serialized
        }
        const serialized = Serializable()
        const instance = _instance.galoisKeys(Int32Array.from(0))
        serialized.unsafeInject(instance)
        return serialized
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
