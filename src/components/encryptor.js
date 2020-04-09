export const Encryptor = library => ({
  Exception,
  MemoryPoolHandle,
  CipherText
}) => (context, publicKey, secretKey = null) => {
  const Constructor = library.Encryptor
  let _instance = constructInstance(context, publicKey, secretKey)

  function constructInstance(context, publicKey, secretKey) {
    try {
      if (secretKey) {
        return new Constructor(
          context.instance,
          publicKey.instance,
          secretKey.instance
        )
      }
      return new Constructor(context.instance, publicKey.instance)
    } catch (e) {
      throw Exception.safe(e)
    }
  }

  /**
   * @implements Encryptor
   */

  /**
   * @interface Encryptor
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Encryptor#instance
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
     * @name Encryptor#unsafeInject
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
     * @name Encryptor#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Encrypts a PlainText and stores the result in the destination parameter.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encrypt
     * @param {PlainText} plainText PlainText to encrypt
     * @param {CipherText} [cipherText] CipherText destination to store the encrypted result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} Returns undefined if a CipherText was specified. Otherwise returns a
     * CipherText containing the encrypted result
     */
    encrypt(plainText, cipherText, pool = MemoryPoolHandle.global) {
      try {
        if (cipherText) {
          _instance.encrypt(plainText.instance, cipherText.instance, pool)
          return
        }
        const cipher = CipherText()
        _instance.encrypt(plainText.instance, cipher.instance, pool)
        return cipher
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Encrypts a PlainText with the secret key and stores the result in
     * destination. The encryption parameters for the resulting CipherText
     * correspond to:
     * 1) in BFV, the highest (data) level in the modulus switching chain,
     * 2) in CKKS, the encryption parameters of the plaintext.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encryptSymmetric
     * @param {PlainText} plainText PlainText to encrypt
     * @param {CipherText} [cipherText] CipherText destination to store the encrypted result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} Returns undefined if a CipherText was specified. Otherwise returns a
     * CipherText containing the encrypted result
     */
    encryptSymmetric(plainText, cipherText, pool = MemoryPoolHandle.global) {
      try {
        if (cipherText) {
          _instance.encryptSymmetric(
            plainText.instance,
            cipherText.instance,
            pool
          )
          return
        }
        const cipher = CipherText()
        _instance.encryptSymmetric(plainText.instance, cipher.instance, pool)
        return cipher
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
