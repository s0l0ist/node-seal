export const Decryptor = ({ library, context, secretKey }) => {
  const _getException = library.getException
  let _instance = null
  try {
    _instance = new library.Decryptor(context.instance, secretKey.instance)
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(
      typeof e === 'number'
        ? _getException(e)
        : e instanceof Error
        ? e.message
        : e
    )
  }

  return {
    get instance() {
      return _instance
    },
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Decrypts a Ciphertext and stores the result in the destination parameter.
     *
     * @param cipherText
     * @param plainText
     */
    decrypt({ cipherText, plainText }) {
      try {
        _instance.decrypt(cipherText.instance, plainText.instance)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _getException(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Computes the invariant noise budget (in bits) of a ciphertext. The invariant
     * noise budget measures the amount of room there is for the noise to grow while
     * ensuring correct decryptions. This function works only with the BFV scheme.
     *
     * @par Invariant Noise Budget
     * The invariant noise polynomial of a ciphertext is a rational coefficient
     * polynomial, such that a ciphertext decrypts correctly as long as the
     * coefficients of the invariantnoise polynomial are of absolute value less
     * than 1/2. Thus, we call the infinity-norm of the invariant noise polynomial
     * the invariant noise, and for correct decryption requireit to be less than
     * 1/2. If v denotes the invariant noise, we define the invariant noise budget
     * as -log2(2v). Thus, the invariant noise budget starts from some initial
     * value, which depends on the encryption parameters, and decreases when
     * computations are performed. When the budget reaches zero, the ciphertext
     * becomes too noisy to decrypt correctly.
     *
     * @param cipherText
     * @returns {number}
     */
    invariantNoiseBudget({ cipherText }) {
      try {
        return _instance.invariantNoiseBudget(cipherText.instance)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _getException(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    }
  }
}
