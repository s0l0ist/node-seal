/**
 * This class is used strictly to test how encryption should work at the bit level.
 *
 * We emulate the restrictions of SEAL and translate them into a dynamic adder which
 * performs simple arithmetic on a size restriction (max, min values)
 */

class Simulator {
  /**
   * Create an instance with a maxValue and signed vs unsigned
   *
   * @param maxValue
   * @param signed
   */
  constructor({maxValue, signed = true}) {
    this._maxValue = maxValue
    this._signed = signed
  }

  /**
   * Pad a string to a given size
   *
   * @param s
   * @param size
   * @param direction
   * @param value - '0' or '1' to pad with
   * @private
   * @returns {*}
   */
  _pad(s, size, direction ='left', value = '0') {
    while (s.length < (size || 2)) {s = direction === 'left' ? value + s : s + value}
    return s
  }

  /**
   * Invert bits of a number
   *
   * @param value
   * @private
   * @returns {number}
   */
  _onesComp(value) {
    return ~value & (Math.pow(2, Math.floor(Math.log2(value))) - 1)
  }

  /**
   * Get the bit representation of Maximum supported value
   *
   * @private
   * @returns {number}
   */
  _getBits() {
    if (this._signed) {
      return Math.floor(Math.log2(this._maxValue))
    }
    return Math.floor(Math.log2(this._maxValue)) - 1
  }

  /**
   * Get a bit mask for the number of bits supported
   *
   * @returns {number}
   */
  getMask(){
    return this._onesComp(1 << this._getBits())
  }

  /**
   * Convert a JS number to a binary representation as a string
   *
   * @param value
   * @returns {*}
   */
  convertNumberToBinaryString(value) {
    return this._pad(((value >>> 0) & this.getMask()).toString(2), this._getBits())
  }

  /**
   * Convert a binary string to a JS number
   * @param string
   */
  // TODO: finish this
  // convertBinaryStringToNumber(string) {
  //   const strArray = string.split('')
  //
  //   if (strArray[0] === '1') {
  //     return parseInt(this._pad(string, this._getBits() + 1, 'left', '1'), 2)
  //   }
  //   return parseInt(this._pad(string, this._getBits() + 1, 'left', '0'), 2)
  // }

  /**
   * Performs a signed addition of two numbers
   * @param a
   * @param b
   * @returns {string}
   * @private
   */
  _addSigned(a, b) {
    const tempResult = a + b
    const convertedNumber = (tempResult >>> 0) & this.getMask()

    // If there's an overflow, determine how to calculate the result
    if (tempResult > this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber - 1)
    }
    if (tempResult < -this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber + 1)
    }
    // Otherwise, return the normal addition
    return this.convertNumberToBinaryString(convertedNumber)
  }

  /**
   * Performs an unsigned addition of two numbers
   * @param a
   * @param b
   * @returns {string}
   * @private
   */
  _addUnsigned(a, b) {
    const tempResult = a + b
    const convertedNumber = (tempResult >>> 0) & this.getMask()

    // If there's an overflow, determine how to calculate the result
    if (tempResult > this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber - 1)
    }
    if (tempResult < 0) {
      return this.convertNumberToBinaryString(convertedNumber + 1)
    }
    // Otherwise, return the normal addition
    return this.convertNumberToBinaryString(convertedNumber)
  }
  /**
   * Perform the addition of two JS Numbers and returns the binary string result
   * @param a
   * @param b
   * @returns {string}
   */
  add(a, b) {
    switch(this._signed) {
      case true: return this._addSigned(a, b)
      case false: return this._addUnsigned(a, b)
    }
  }


  /**
   * Performs a signed subtraction of two numbers
   * @param a
   * @param b
   * @returns {string}
   * @private
   */
  _subSigned(a, b) {
    const tempResult = a - b
    const convertedNumber = (tempResult >>> 0) & this.getMask()

    // If there's an overflow, determine how to calculate the result
    if (tempResult > this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber - 1)
    }
    if (tempResult < -this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber + 1)
    }
    // Otherwise, return the normal addition
    return this.convertNumberToBinaryString(convertedNumber)
  }

  /**
   * Performs an unsigned subtraction of two numbers
   * @param a
   * @param b
   * @returns {string}
   * @private
   */
  _subUnsigned(a, b) {
    const tempResult = a - b
    const convertedNumber = (tempResult >>> 0) & this.getMask()

    // If there's an overflow, determine how to calculate the result
    if (tempResult > this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber - 1)
    }
    if (tempResult < 0) {
      return this.convertNumberToBinaryString(convertedNumber + 1)
    }
    // Otherwise, return the normal addition
    return this.convertNumberToBinaryString(convertedNumber)
  }
  /**
   * Perform the addition of two JS Numbers and returns the binary string result
   * @param a
   * @param b
   * @returns {string}
   */
  sub(a, b) {
    switch(this._signed) {
      case true: return this._subSigned(a, b)
      case false: return this._subUnsigned(a, b)
    }
  }

  /**
   * Performs a signed multiplication of two numbers
   * @param a
   * @param b
   * @returns {string}
   * @private
   */
  _multiplySigned(a, b) {
    const tempResult = a * b
    const convertedNumber = (tempResult >>> 0) & this.getMask()

    const overlap = Math.floor(this._maxValue / tempResult) || 1

    // If there's an overflow, determine how to calculate the result
    if (tempResult > this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber - (overlap || 1))
    }
    if (tempResult < -this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber + (overlap || 1))
    }
    // Otherwise, return the normal addition
    return this.convertNumberToBinaryString(convertedNumber)
  }

  /**
   * Performs an unsigned multiplication of two numbers
   * @param a
   * @param b
   * @returns {string}
   * @private
   */
  _multiplyUnsigned(a, b) {
    const tempResult = a * b
    const convertedNumber = (tempResult >>> 0) & this.getMask()

    // If there's an overflow, determine how to calculate the result
    if (tempResult > this._maxValue) {
      return this.convertNumberToBinaryString(convertedNumber - 1)
    }
    if (tempResult < 0) {
      return this.convertNumberToBinaryString(convertedNumber + 1)
    }
    // Otherwise, return the normal addition
    return this.convertNumberToBinaryString(convertedNumber)
  }
  /**
   * Perform the addition of two JS Numbers and returns the binary string result
   * @param a
   * @param b
   * @returns {string}
   */
  multiply(a, b) {
    switch(this._signed) {
      case true: return this._multiplySigned(a, b)
      case false: return this._multiplyUnsigned(a, b)
    }
  }
}

module.exports = Simulator
