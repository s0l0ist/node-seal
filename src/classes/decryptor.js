export class Decryptor {
  constructor({library, context, secretKey}) {
    this._Decryptor = library.Decryptor
    this._instance = new this._Decryptor(context.instance, secretKey.instance)
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      this._instance.delete()
      this._instance = null
    }
    this._instance = instance
  }

  /**
   * Decrypts a Ciphertext and stores the result in the destination parameter.
   *
   * @param cipherText
   * @param plainText
   */
  decrypt({cipherText, plainText}) {
    this._instance.decrypt(cipherText.instance, plainText.instance)
  }

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
  invariantNoiseBudget({cipherText}) {
    return this._instance.invariantNoiseBudget(cipherText.instance)
  }
}
