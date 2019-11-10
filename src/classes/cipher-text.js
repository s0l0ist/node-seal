export class CipherText {
  constructor({library}) {
    this._instance = new library.Ciphertext()
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
   Returns the number of primes in the coefficient modulus of the
   associated encryption parameters. This directly affects the
   allocation size of the ciphertext.
   */
  coeffModCount() {
    return this._instance.coeffModCount()
  }

  /**
   Returns the degree of the polynomial modulus of the associated
   encryption parameters. This directly affects the allocation size
   of the ciphertext.
   */
  polyModulusDegree() {
    return this._instance.polyModulusDegree()
  }

  /**
   Returns the size of the ciphertext.
   */
  size() {
    return this._instance.size()
  }

  /**
   * Check whether the current ciphertext is transparent, i.e. does not require
   * a secret key to decrypt. In typical security models such transparent
   * ciphertexts would not be considered to be valid. Starting from the second
   * polynomial in the current ciphertext, this function returns true if all
   * following coefficients are identically zero. Otherwise, returns false.
   * @returns {boolean}
   */
  isTransparent() {
    return this._instance.isTransparent()
  }

  /**
   * Returns whether the ciphertext is in NTT form.
   * @returns {boolean}
   */
  isNttForm() {
    return this._instance.isNttForm()
  }

  /**
   * Returns a reference to parmsId.
   *
   * @see EncryptionParameters for more information about parmsId.
   * @returns {number}
   *
   */
  parmsId() {
    // TODO: Binding type is not defined
    return this._instance.parmsId()
  }

  /**
   * Returns a reference to the scale. This is only needed when using the
   * CKKS encryption scheme. The user should have little or no reason to ever
   * change the scale by hand.
   * @returns {number}
   */
  scale() {
    return this._instance.scale()
  }

  /**
   * Returns the currently used MemoryPoolHandle.
   * @returns {pool}
   */
  pool() {
    return this._instance.pool()
  }

  /**
   * Save a cipherText to a base64 string
   * @returns {string}
   */
  save() {
    return this._instance.saveToString()
  }

  /**
   * Load a cipherText from a base64 string
   * @param context
   * @param encoded
   */
  load({context, encoded}) {
    this._instance.loadFromString(context.instance, encoded)
  }

  /*
    Helper methods
   */
  setVectorSize({size}) {
    this._vectorSize = size
  }
  getVectorSize() {
    return this._vectorSize
  }

  setVectorType({type}) {
    this._type = type
  }
  getVectorType() {
    return this._type
  }

  setSchemeType({scheme}) {
    this._scheme = scheme
  }
  getSchemeType() {
    return this._scheme
  }
}
