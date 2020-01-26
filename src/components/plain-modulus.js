import { Exception } from './exception'

export const PlainModulus = ({ library }) => {
  const _Exception = Exception({ library })
  const _Batching = library.PlainModulus.Batching
  const _BatchingVector = library.PlainModulus.BatchingVector

  /**
   * @typedef {Object} PlainModulus
   * @implements IPlainModulus
   */

  /**
   * @interface IPlainModulus
   */
  return {
    /**
     * Creates a prime number SmallModulus for use as plainModulus encryption
     * parameter that supports batching with a given polyModulusDegree.
     *
     * @function
     * @name IPlainModulus.Batching
     * @param {Object} options Options
     * @param {Number} options.polyModulusDegree The degree of the polynomial modulus
     * @param {Number} options.bitSize The bit-size of the desired prime number
     * @returns {SmallModulus} A SmallModulus containing the prime number
     */
    Batching({ polyModulusDegree, bitSize }) {
      try {
        return _Batching(polyModulusDegree, bitSize)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Creates several prime number SmallModulus elements that can be used as
     * plainModulus encryption parameters, each supporting batching with a given
     * polyModulusDegree.
     *
     * @function
     * @name IPlainModulus.BatchingVector
     * @param {Object} options Options
     * @param {Number} options.polyModulusDegree The degree of the polynomial modulus
     * @param {Vector} options.bitSizes Vector containing int32 values representing bit-sizes of primes
     * @returns {Vector<SmallModulus>} Vector of SmallModulus containing prime numbers
     */
    BatchingVector({ polyModulusDegree, bitSizes }) {
      try {
        return _BatchingVector(polyModulusDegree, bitSizes.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
