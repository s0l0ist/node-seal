export class SmallModulus {
  constructor({library}) {
    this._library = library
    this._SmallModulus = library.SmallModulus

    // Static methods
    this._saveToString = library.SmallModulus.saveToString
    this._createFromString = library.SmallModulus.createFromString

    this._instance = new library.SmallModulus()
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
   * Loads a SmallModulus from a string representing an uint64 value.
   *
   * @param value
   */
  setValue({value}) {
    this._instance.loadFromString(value + '')
  }

  /**
   Returns the value of the current SmallModulus as a string.

   It's a string because JS does not support uint64
   data type very well
   */
  value() {
    return this._instance.Value()
  }

  /**
   Returns the significant bit count of the value of the current SmallModulus.
   */
  bitCount() {
    return this._instance.bitCount()
  }

  /**
   Returns whether the value of the current SmallModulus is zero.
   */
  isZero() {
    return this._instance.isZero()
  }
  /**
   Returns whether the value of the current SmallModulus is a prime number.
   */
  isPrime() {
    return this._instance.isPrime()
  }

  /**
   * Save the SmallModulus as a base64 string
   *
   * @returns {*}
   */
  save() {
    return this._saveToString()
  }
}
