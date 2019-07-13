export class PlainText {
  constructor({library}) {
    this._instance = new library.Plaintext()
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  /**
   Returns whether the current plaintext polynomial has all zero coefficients.
   */
  isZero() {
    return this._instance.isZero()
  }

  /**
   Returns the capacity of the current allocation.
   */
  capacity() {
    return this._instance.capacity()
  }

  /**
   Returns the coefficient count of the current plaintext polynomial.
   */
  coeffCount() {
    return this._instance.coeffCount()
  }

  /**
   Returns the significant coefficient count of the current plaintext polynomial.
   */
  significantCoeffCount() {
    return this._instance.significantCoeffCount()
  }

  /**
   Returns the non-zero coefficient count of the current plaintext polynomial.
   */
  nonzeroCoeffCount() {
    return this._instance.nonzeroCoeffCount()
  }
  /**
   Returns a human-readable string description of the plaintext polynomial.

   The returned string is of the form "7FFx^3 + 1x^1 + 3" with a format
   summarized by the following:
   1. Terms are listed in order of strictly decreasing exponent
   2. Coefficient values are non-negative and in hexadecimal format (hexadecimal
   letters are in upper-case)
   3. Exponents are positive and in decimal format
   4. Zero coefficient terms (including the constant term) are omitted unless
   the polynomial is exactly 0 (see rule 9)
   5. Term with the exponent value of one is written as x^1
   6. Term with the exponent value of zero (the constant term) is written as
   just a hexadecimal number without x or exponent
   7. Terms are separated exactly by <space>+<space>
   8. Other than the +, no other terms have whitespace
   9. If the polynomial is exactly 0, the string "0" is returned

   @throws std::invalid_argument if the plaintext is in NTT transformed form
   */
  toPolynomial() {
    return this._instance.toPolynomial()
  }

  /**
   Returns whether the plaintext is in NTT form.
   */
  isNttForm() {
    return this._instance.isNttForm()
  }

  /**
   Returns a reference to parms_id. The parms_id must remain zero unless the
   plaintext polynomial is in NTT form.

   @see EncryptionParameters for more information about parms_id.
   */
  // TODO: Binding type is not defined
  parmsId() {
    return this._instance.parmsId()
  }

  /**
   Returns a reference to the scale. This is only needed when using the CKKS
   encryption scheme. The user should have little or no reason to ever change
   the scale by hand.
   */
  scale() {
    return this._instance.scale()
  }

  /**
   Returns the currently used MemoryPoolHandle.
   */
  pool() {
    return this._instance.pool()
  }

  /**
   * Save the PlainText to a base64 string
   * @returns {string}
   */
  save() {
    return this._instance.saveToString()
  }

  /**
   * Load a PlainText from a base64 string
   * @param context
   * @param encoded
   */
  load({context, encoded}) {
    this._instance.loadFromString(context.instance, encoded)
  }
}
