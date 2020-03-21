export const Encryptor = library => ({
  Exception,
  MemoryPoolHandle,
  CipherText
}) => (context, publicKey) => {
  const Constructor = library.Encryptor
  let _instance = null
  try {
    _instance = new Constructor(context.instance, publicKey.instance)
  } catch (e) {
    throw Exception.safe(e)
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
    }
  }
}
