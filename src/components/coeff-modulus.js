import { Exception } from './exception'

/**
 * CoeffModulus
 * @typedef {Object} CoeffModulus
 * @constructor
 */
export const CoeffModulus = ({ library }) => {
  const _Exception = Exception({ library })
  const _MaxBitCount = library.CoeffModulus.MaxBitCount
  const _BFVDefault = library.CoeffModulus.BFVDefault
  const _Create = library.CoeffModulus.Create

  /**
   * CoeffModulus
   */
  return {
    /**
     * Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel
     * @param {Object} options Options
     * @param {number} options.polyModulusDegree degree of the polynomial modulus
     * @param {SecurityLevel} options.securityLevel Security Level
     * @returns {number} Maximum bit count
     */
    MaxBitCount({ polyModulusDegree, securityLevel }) {
      try {
        return _MaxBitCount(polyModulusDegree, securityLevel)
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
     * Returns a default vector of primes for the BFV CoeffModulus parameter
     * @param {Object} options Options
     * @param {number} options.polyModulusDegree degree of the polynomial modulus
     * @param {SecurityLevel} options.securityLevel Security Level
     * @returns {Vector} Vector containing SmallModulus primes
     */
    BFVDefault({ polyModulusDegree, securityLevel }) {
      try {
        return _BFVDefault(polyModulusDegree, securityLevel)
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
     * Creates a vector of primes for a given polyModulusDegree and bitSizes
     * @param {Object} options Options
     * @param {number} options.polyModulusDegree degree of the polynomial modulus
     * @param {Vector} options.bitSizes Vector containing int32 values representing bit-sizes of primes
     * @returns {Vector} Vector containing SmallModulus primes
     */
    Create({ polyModulusDegree, bitSizes }) {
      try {
        return _Create(polyModulusDegree, bitSizes.instance)
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
