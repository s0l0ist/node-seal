export const CoeffModulus = library => ({ Exception, SecurityLevel }) => {
  // Static methods
  const _MaxBitCount = library.CoeffModulus.MaxBitCount
  const _BFVDefault = library.CoeffModulus.BFVDefault
  const _CreateFromArray = library.CoeffModulus.CreateFromArray

  /**
   * @implements CoeffModulus
   */

  /**
   * @interface CoeffModulus
   */
  return {
    /**
     * Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel
     *
     * @function
     * @name CoeffModulus.MaxBitCount
     * @param {Number} polyModulusDegree Degree of the polynomial modulus
     * @param {SecurityLevel} [securityLevel={@link SecurityLevel.tc128}] Security Level
     * @returns {Number} Maximum bit count
     */
    MaxBitCount(polyModulusDegree, securityLevel = SecurityLevel.tc128) {
      return _MaxBitCount(polyModulusDegree, securityLevel)
    },

    /**
     * Returns a default vector of primes for the BFV CoeffModulus parameter
     *
     * @function
     * @name CoeffModulus.BFVDefault
     * @param {Number} polyModulusDegree Degree of the polynomial modulus
     * @param {SecurityLevel} [securityLevel={@link SecurityLevel.tc128}] Security Level
     * @returns {Vector<SmallModulus>} Vector containing SmallModulus primes
     */
    BFVDefault(polyModulusDegree, securityLevel = SecurityLevel.tc128) {
      try {
        return _BFVDefault(polyModulusDegree, securityLevel)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Creates a vector of primes for a given polyModulusDegree and bitSizes
     *
     * @function
     * @name CoeffModulus.Create
     * @param {Number} polyModulusDegree Degree of the polynomial modulus
     * @param {Int32Array} bitSizes Int32Array containing values representing
     * bit-sizes of primes
     * @returns {Vector<SmallModulus>} Vector containing SmallModulus primes
     */
    Create(polyModulusDegree, bitSizes) {
      try {
        if (bitSizes.constructor === Int32Array) {
          return _CreateFromArray(polyModulusDegree, bitSizes)
        }
        throw new Error(
          'Unsupported argument type! `bitSizes` must be an Int32Array'
        )
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
