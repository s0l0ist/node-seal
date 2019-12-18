export const CipherText = ({library}) => {

  const _getException = library.getException
  const _ComprModeType = library.ComprModeType
  let _instance = null
  try {
    _instance = new library.Ciphertext()
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
  }

  return {

    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     Returns the number of primes in the coefficient modulus of the
     associated encryption parameters. This directly affects the
     allocation size of the ciphertext.
     */
    get coeffModCount() {
      return _instance.coeffModCount()
    },

    /**
     Returns the degree of the polynomial modulus of the associated
     encryption parameters. This directly affects the allocation size
     of the ciphertext.
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     Returns the size of the ciphertext.
     */
    get size() {
      return _instance.size()
    },

    /**
     Returns the capacity of the allocation. This means the largest size
     of the ciphertext that can be stored in the current allocation with
     the current encryption parameters.
     */
    get sizeCapacity() {
      return _instance.sizeCapacity()
    },

    /**
     * Check whether the current ciphertext is transparent, i.e. does not require
     * a secret key to decrypt. In typical security models such transparent
     * ciphertexts would not be considered to be valid. Starting from the second
     * polynomial in the current ciphertext, this function returns true if all
     * following coefficients are identically zero. Otherwise, returns false.
     * @returns {boolean}
     */
    get isTransparent() {
      return _instance.isTransparent()
    },

    /**
     * Returns whether the ciphertext is in NTT form.
     * @returns {boolean}
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * Returns a reference to parmsId.
     *
     * @see EncryptionParameters for more information about parmsId.
     * @returns {number}
     *
     */
    get parmsId() {
      // TODO: Binding type is not defined
      return _instance.parmsId()
    },

    /**
     * Returns a reference to the scale. This is only needed when using the
     * CKKS encryption scheme. The user should have little or no reason to ever
     * change the scale by hand.
     * @returns {number}
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * Returns the currently used MemoryPoolHandle.
     * @returns {pool}
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save a cipherText to a base64 string
     * @returns {string}
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Load a cipherText from a base64 string
     * @param context
     * @param encoded
     */
    load({context, encoded}) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    }
  }
}
