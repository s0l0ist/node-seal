export const PlainModulus = library => Exception => {
  // Static methods
  const _Batching = library.PlainModulus.Batching
  const _BatchingVector = library.PlainModulus.BatchingVector

  /**
   * @implements PlainModulus
   */

  /**
   * @interface PlainModulus
   */
  return {
    /**
     * Creates a prime number SmallModulus for use as plainModulus encryption
     * parameter that supports batching with a given polyModulusDegree.
     *
     * @function
     * @name PlainModulus.Batching
     * @param {Number} polyModulusDegree The degree of the polynomial modulus
     * @param {Number} bitSize The bit-size of the desired prime number
     * @returns {SmallModulus} A SmallModulus containing the prime number
     */
    Batching(polyModulusDegree, bitSize) {
      try {
        return _Batching(polyModulusDegree, bitSize)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Creates several prime number SmallModulus elements that can be used as
     * plainModulus encryption parameters, each supporting batching with a given
     * polyModulusDegree.
     *
     * @function
     * @name PlainModulus.BatchingVector
     * @param {Number} polyModulusDegree The degree of the polynomial modulus
     * @param {Vector} bitSizes Vector containing int32 values representing bit-sizes of primes
     * @returns {Vector<SmallModulus>} Vector of SmallModulus containing prime numbers
     */
    BatchingVector(polyModulusDegree, bitSizes) {
      try {
        return _BatchingVector(polyModulusDegree, bitSizes.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
