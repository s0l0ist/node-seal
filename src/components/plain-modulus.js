export const PlainModulus = library => ({ Exception, Modulus, Vector }) => {
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
     * Creates a prime number Modulus for use as plainModulus encryption
     * parameter that supports batching with a given polyModulusDegree.
     *
     * @function
     * @name PlainModulus.Batching
     * @param {Number} polyModulusDegree The degree of the polynomial modulus
     * @param {Number} bitSize The bit-size of the desired prime number
     * @returns {Modulus} A Modulus containing the prime number
     */
    Batching(polyModulusDegree, bitSize) {
      try {
        const smallMod = Modulus()
        smallMod.inject(_Batching(polyModulusDegree, bitSize))
        return smallMod
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Creates several prime number Modulus elements that can be used as
     * plainModulus encryption parameters, each supporting batching with a given
     * polyModulusDegree.
     *
     * @function
     * @name PlainModulus.BatchingVector
     * @param {Number} polyModulusDegree The degree of the polynomial modulus
     * @param {Int32Array} bitSizes Int32Array containing values representing bit-sizes of primes
     * @returns {Vector<Modulus>} Vector of Modulus containing prime numbers
     */
    BatchingVector(polyModulusDegree, bitSizes) {
      try {
        const vectBitSizes = Vector(bitSizes)
        const vect = _BatchingVector(polyModulusDegree, vectBitSizes.instance)
        vectBitSizes.delete()
        return vect
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
