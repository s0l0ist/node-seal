import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

export const PlainText = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.Plaintext()
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(
      typeof e === 'number'
        ? _Exception.getHuman(e)
        : e instanceof Error
        ? e.message
        : e
    )
  }

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {instance} instance - wasm instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Allocates enough memory to accommodate the backing array of the current
     * plaintext and copies it over to the new location. This function is meant
     * to reduce the memory use of the plaintext to smallest possible and can be
     * particularly important after modulus switching.
     */
    shrinkToFit() {
      try {
        return _instance.shrinkToFit()
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Sets the plaintext polynomial to zero.
     */
    setZero() {
      try {
        return _instance.setZero()
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Returns whether the current plaintext polynomial has all zero coefficients.
     * @returns {boolean} - plaintext polynomial has all zero coefficients
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     * Returns the capacity of the current allocation.
     * @returns {number} - capacity of the current allocation
     */
    get capacity() {
      return _instance.capacity()
    },

    /**
     * Returns the coefficient count of the current plaintext polynomial.
     * @returns {number} - coefficient count of the current plaintext polynomial
     */
    get coeffCount() {
      return _instance.coeffCount()
    },

    /**
     * Returns the significant coefficient count of the current plaintext polynomial.
     * @returns {number} - significant coefficient count of the current plaintext polynomial
     */
    get significantCoeffCount() {
      return _instance.significantCoeffCount()
    },

    /**
     * Returns the non-zero coefficient count of the current plaintext polynomial.
     * @returns {number} - non-zero coefficient count of the current plaintext polynomial
     */
    get nonzeroCoeffCount() {
      return _instance.nonzeroCoeffCount()
    },

    /**
     * Returns a human-readable string description of the plaintext polynomial.
     *
     * The returned string is of the form "7FFx^3 + 1x^1 + 3" with a format
     * summarized by the following:
     * 1. Terms are listed in order of strictly decreasing exponent
     * 2. Coefficient values are non-negative and in hexadecimal format (hexadecimal
     * letters are in upper-case)
     * 3. Exponents are positive and in decimal format
     * 4. Zero coefficient terms (including the constant term) are omitted unless
     * the polynomial is exactly 0 (see rule 9)
     * 5. Term with the exponent value of one is written as x^1
     * 6. Term with the exponent value of zero (the constant term) is written as
     * just a hexadecimal number without x or exponent
     * 7. Terms are separated exactly by <space>+<space>
     * 8. Other than the +, no other terms have whitespace
     * 9. If the polynomial is exactly 0, the string "0" is returned
     *
     * @throws std::invalid_argument if the plaintext is in NTT transformed form
     * @returns {string} - Polynomial string
     */
    toPolynomial() {
      try {
        return _instance.toPolynomial()
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Returns whether the plaintext is in NTT form.
     * @returns {boolean} - plaintext is in NTT form
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * Returns a reference to parms_id. The parms_id must remain zero unless the
     * plaintext polynomial is in NTT form.
     *
     * @see EncryptionParameters for more information about parms_id.
     * @returns {*} - parmsId pointer
     */
    get parmsId() {
      return _instance.parmsId()
    },

    /**
     * Returns a reference to the scale. This is only needed when using the CKKS
     * encryption scheme. The user should have little or no reason to ever change
     * the scale by hand.
     * @returns {*} - reference to the scale
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * Returns the currently used MemoryPoolHandle.
     * @returns {MemoryPoolHandle} - Pointer to the current memory pool handle
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save the PlainText to a base64 string
     * @param {ComprModeType} [compression=ComprModeType.deflate] - activate compression
     * @returns {string} - base64 encoded string
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Load a PlainText from a base64 string
     * @param {Context} context - Encryption context to enforce
     * @param {string} encoded - base64 encoded string
     */
    load({ context, encoded }) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    }
  }
}
