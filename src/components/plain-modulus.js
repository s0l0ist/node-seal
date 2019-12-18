import { Exception } from './exception'

/**
 * PlainModulus
 * @typedef {Object} PlainModulus
 * @constructor
 */
export const PlainModulus = ({ library }) => {
  const _Exception = Exception({ library })
  const _Batching = library.PlainModulus.Batching
  const _BatchingVector = library.PlainModulus.BatchingVector

  return {
    /**
     * Creates a prime number SmallModulus for use as plainModulus encryption
     * parameter that supports batching with a given polyModulusDegree.
     * @param {Object} options Options
     * @param {number} options.polyModulusDegree - degree of the polynomial modulus
     * @param {number} options.bitSize - Bit size of the prime
     * @returns {SmallModulus} - prime number
     */
    Batching({ polyModulusDegree, bitSize }) {
      try {
        return _Batching(polyModulusDegree, bitSize)
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
     * Creates several prime number SmallModulus elements that can be used as
     * plainModulus encryption parameters, each supporting batching with a given
     * polyModulusDegree.
     * @param {Object} options Options
     * @param {number} options.polyModulusDegree - degree of the polynomial modulus
     * @param {Vector} options.bitSizes - Vector containing int32 values representing bit-sizes of primes
     * @returns {Vector} - Vector of SmallModulus
     */
    BatchingVector({ polyModulusDegree, bitSizes }) {
      try {
        return _BatchingVector(polyModulusDegree, bitSizes.instance)
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
