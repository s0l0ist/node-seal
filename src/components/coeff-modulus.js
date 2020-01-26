import { Exception } from './exception'

export const CoeffModulus = ({ library }) => {
  const _Exception = Exception({ library })
  const _MaxBitCount = library.CoeffModulus.MaxBitCount
  const _BFVDefault = library.CoeffModulus.BFVDefault
  const _Create = library.CoeffModulus.Create

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
     * @param {Object} options Options
     * @param {Number} options.polyModulusDegree Degree of the polynomial modulus
     * @param {SecurityLevel} options.securityLevel Security Level
     * @returns {Number} Maximum bit count
     */
    MaxBitCount({ polyModulusDegree, securityLevel }) {
      try {
        return _MaxBitCount(polyModulusDegree, securityLevel)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns a default vector of primes for the BFV CoeffModulus parameter
     *
     * @function
     * @name CoeffModulus.BFVDefault
     * @param {Object} options Options
     * @param {Number} options.polyModulusDegree Degree of the polynomial modulus
     * @param {SecurityLevel} options.securityLevel Security Level
     * @returns {Vector<SmallModulus>} Vector containing SmallModulus primes
     */
    BFVDefault({ polyModulusDegree, securityLevel }) {
      try {
        return _BFVDefault(polyModulusDegree, securityLevel)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Creates a vector of primes for a given polyModulusDegree and bitSizes
     *
     * @function
     * @name CoeffModulus.Create
     * @param {Object} options Options
     * @param {Number} options.polyModulusDegree Degree of the polynomial modulus
     * @param {Vector} options.bitSizes Vector containing int32 values representing bit-sizes of primes
     * @returns {Vector<SmallModulus>} Vector containing SmallModulus primes
     */
    Create({ polyModulusDegree, bitSizes }) {
      try {
        return _Create(polyModulusDegree, bitSizes.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
