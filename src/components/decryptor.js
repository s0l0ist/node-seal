export const Decryptor = library => (Exception, PlainText) => (
  context,
  secretKey
) => {
  const Constructor = library.Decryptor
  let _instance = null
  try {
    _instance = new Constructor(context.instance, secretKey.instance)
  } catch (e) {
    throw Exception.safe(e)
  }

  /**
   * @implements Decryptor
   */

  /**
   * @interface Decryptor
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Decryptor#instance
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
     * @name Decryptor#unsafeInject
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
     * @name Decryptor#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Decrypts a CipherText and stores the result in the destination parameter.
     *
     * @function
     * @name Decryptor#decrypt
     * @param {CipherText} cipherText CipherText to decrypt
     * @param {PlainText} [plainText=null] PlainText destination to store the decrypted result
     * @returns {PlainText|undefined} Returns undefined if a PlainText was specified. Otherwise returns a
     * PlainText containng the decrypted result
     */
    decrypt(cipherText, plainText = null) {
      try {
        if (plainText) {
          _instance.decrypt(cipherText.instance, plainText.instance)
          return
        }
        const plain = PlainText()
        _instance.decrypt(cipherText.instance, plain.instance)
        return plain
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Computes the invariant noise budget (in bits) of a CipherText. The invariant
     * noise budget measures the amount of room there is for the noise to grow while
     * ensuring correct decryptions. This function works only with the BFV scheme.
     *
     * @par Invariant Noise Budget
     * The invariant noise polynomial of a CipherText is a rational coefficient
     * polynomial, such that a CipherText decrypts correctly as long as the
     * coefficients of the invariantnoise polynomial are of absolute value less
     * than 1/2. Thus, we call the infinity-norm of the invariant noise polynomial
     * the invariant noise, and for correct decryption requireit to be less than
     * 1/2. If v denotes the invariant noise, we define the invariant noise budget
     * as -log2(2v). Thus, the invariant noise budget starts from some initial
     * value, which depends on the encryption parameters, and decreases when
     * computations are performed. When the budget reaches zero, the CipherText
     * becomes too noisy to decrypt correctly.
     *
     * @function
     * @name Decryptor#invariantNoiseBudget
     * @param {CipherText} cipherText CipherText to measure
     * @returns {Number} Invariant noise budget (in bits)
     */
    invariantNoiseBudget(cipherText) {
      try {
        return _instance.invariantNoiseBudget(cipherText.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
