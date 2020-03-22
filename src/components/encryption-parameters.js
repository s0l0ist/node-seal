export const EncryptionParameters = library => ({
  Exception,
  ComprModeType,
  SmallModulus,
  SchemeType
}) => (schemeType = SchemeType.none) => {
  const Constructor = library.EncryptionParameters
  let _instance = new Constructor(schemeType)

  /**
   * @implements EncryptionParameters
   */

  /**
   * @interface EncryptionParameters
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name EncryptionParameters#instance
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
     * @name EncryptionParameters#unsafeInject
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
     * @name EncryptionParameters#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Sets the degree of the polynomial modulus parameter to the specified value.
     * The polynomial modulus directly affects the number of coefficients in
     * PlainText polynomials, the size of CipherText elements, the computational
     * performance of the scheme (bigger is worse), and the security level (bigger
     * is better). In Microsoft SEAL the degree of the polynomial modulus must be a power
     * of 2 (e.g.  1024, 2048, 4096, 8192, 16384, or 32768).
     *
     * @function
     * @name EncryptionParameters#setPolyModulusDegree
     * @param {Number} polyModulusDegree The degree of the polynomial modulus
     */
    setPolyModulusDegree(polyModulusDegree) {
      try {
        _instance.setPolyModulusDegree(polyModulusDegree)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Sets the coefficient modulus parameter. The coefficient modulus consists
     * of a list of distinct prime numbers, and is represented by a vector of
     * SmallModulus objects. The coefficient modulus directly affects the size
     * of CipherText elements, the amount of computation that the scheme can perform
     * (bigger is better), and the security level (bigger is worse). In Microsoft SEAL each
     * of the prime numbers in the coefficient modulus must be at most 60 bits,
     * and must be congruent to 1 modulo 2*degree(poly_modulus).
     *
     * @function
     * @name EncryptionParameters#setCoeffModulus
     * @param {Vector} coeffModulus Vector of SmallModulus primes
     */
    setCoeffModulus(coeffModulus) {
      try {
        _instance.setCoeffModulus(coeffModulus)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Sets the PlainText modulus parameter. The PlainText modulus is an integer
     * modulus represented by the SmallModulus class. The PlainText modulus
     * determines the largest coefficient that PlainText polynomials can represent.
     * It also affects the amount of computation that the scheme can perform
     * (bigger is worse). In Microsoft SEAL the PlainText modulus can be at most 60 bits
     * long, but can otherwise be any integer. Note, however, that some features
     * (e.g. batching) require the PlainText modulus to be of a particular form.
     *
     * @function
     * @name EncryptionParameters#setPlainModulus
     * @param {SmallModulus} plainModulus PlainText modulus parameter
     */
    setPlainModulus(plainModulus) {
      try {
        _instance.setPlainModulus(plainModulus.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * The encryption scheme type.
     *
     * @readonly
     * @name EncryptionParameters#scheme
     * @type {SchemeType.none|SchemeType.BFV|SchemeType.CKKS}
     */
    get scheme() {
      return _instance.scheme()
    },

    /**
     * The degree of the polynomial modulus parameter.
     *
     * @readonly
     * @name EncryptionParameters#polyModulusDegree
     * @type {Number}
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * Returns the currently set coefficient modulus parameter.
     *
     * @readonly
     * @name EncryptionParameters#coeffModulus
     * @type {Array<BigInt>}
     */
    get coeffModulus() {
      const vectorSmallModulus = _instance.coeffModulus()
      const values = vectorSmallModulus.values()
      // eslint-disable-next-line no-undef
      const array = values.split(',').map(x => BigInt(x))
      vectorSmallModulus.delete()
      return array
    },

    /**
     * Returns the currently set PlainText modulus parameter.
     *
     * @readonly
     * @name EncryptionParameters#plainModulus
     * @type {SmallModulus}
     */
    get plainModulus() {
      const instance = _instance.plainModulus()
      const smallModulus = SmallModulus()
      smallModulus.inject(instance)
      return smallModulus
    },

    /**
     * Save the Encryption Parameters to a base64 string
     *
     * @function
     * @name EncryptionParameters#save
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {String} base64 encoded string
     */
    save(compression = ComprModeType.deflate) {
      return _instance.saveToString(compression)
    },

    /**
     * Load the Encryption Parameters from a base64 string
     *
     * @function
     * @name EncryptionParameters#load
     * @param {String} encoded base64 encoded string
     */
    load(encoded) {
      try {
        _instance.loadFromString(encoded)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
