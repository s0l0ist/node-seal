export class EncryptionParameters {
  constructor({library, schemeType}) {
    this._EncryptionParameters = library.EncryptionParameters

    // Static methods
    this._createFromString = library.EncryptionParameters.createFromString
    this._saveToString = library.EncryptionParameters.saveToString

    this._instance = new this._EncryptionParameters(schemeType)
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
   * Sets the degree of the polynomial modulus parameter to the specified value.
   * The polynomial modulus directly affects the number of coefficients in
   * plaintext polynomials, the size of ciphertext elements, the computational
   * performance of the scheme (bigger is worse), and the security level (bigger
   * is better). In Microsoft SEAL the degree of the polynomial modulus must be a power
   * of 2 (e.g.  1024, 2048, 4096, 8192, 16384, or 32768).
   *
   * @param polyModulusDegree
   */
  setPolyModulusDegree({polyModulusDegree}) {
    this._instance.setPolyModulusDegree(polyModulusDegree)
  }

  /**
   * Sets the coefficient modulus parameter. The coefficient modulus consists
   * of a list of distinct prime numbers, and is represented by a vector of
   * SmallModulus objects. The coefficient modulus directly affects the size
   * of ciphertext elements, the amount of computation that the scheme can perform
   * (bigger is better), and the security level (bigger is worse). In Microsoft SEAL each
   * of the prime numbers in the coefficient modulus must be at most 60 bits,
   * and must be congruent to 1 modulo 2*degree(poly_modulus).
   *
   * @param coeffModulus
   */
  setCoeffModulus({coeffModulus}) {
    this._instance.setCoeffModulus(coeffModulus)
  }

  /**
   * Sets the plaintext modulus parameter. The plaintext modulus is an integer
   * modulus represented by the SmallModulus class. The plaintext modulus
   * determines the largest coefficient that plaintext polynomials can represent.
   * It also affects the amount of computation that the scheme can perform
   * (bigger is worse). In Microsoft SEAL the plaintext modulus can be at most 60 bits
   * long, but can otherwise be any integer. Note, however, that some features
   * (e.g. batching) require the plaintext modulus to be of a particular form.
   *
   * @param {SmallModulus} plainModulus
   */
  setPlainModulus({plainModulus}) {
    this._instance.setPlainModulus(plainModulus)
  }

  /**
   * Returns the encryption scheme type.
   *
   * @returns {number}
   */
  scheme() {
    return this._instance.scheme()
  }

  /**
   * Returns the degree of the polynomial modulus parameter.
   *
   * @returns {number}
   */
  get polyModulusDegree() {
    return this._instance.polyModulusDegree()
  }

  /**
   * Returns the currently set coefficient modulus parameter.
   * @returns {vector<SmallModulus>}
   */
  get coeffModulus() {
    return this._instance.coeffModulus()
  }

  /**
   * Returns the currently set plaintext modulus parameter.
   * @returns {SmallModulus}
   */
  get plainModulus() {
    return this._instance.plainModulus()
  }

  /**
   * Save the encryption parameters as a base64 string
   * @returns {string}
   */
  save() {
    this._saveToString(this.instance)
  }

  /**
   * Load the encryption parameters from a base64 string
   * @param encoded
   */
  load({encoded}) {
    this.inject({instance: this._createFromString(encoded)})
  }
}
