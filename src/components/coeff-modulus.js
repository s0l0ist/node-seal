export const CoeffModulus = ({library}) => {

  const _getException = library.getException
  const _MaxBitCount = library.CoeffModulus.MaxBitCount
  const _BFVDefault = library.CoeffModulus.BFVDefault
  const _Create = library.CoeffModulus.Create

  return {
    /**
     * Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel
     *
     * @param polyModulusDegree
     * @param securityLevel
     * @returns {number}
     */
    MaxBitCount({polyModulusDegree, securityLevel}) {
      try {
        return _MaxBitCount(polyModulusDegree, securityLevel)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Returns a default vector of primes for the BFV CoeffModulus parameter
     *
     * @param polyModulusDegree
     * @param securityLevel
     * @returns {vector<SmallModulus>}
     */
    BFVDefault({polyModulusDegree, securityLevel}) {
      try {
        return _BFVDefault(polyModulusDegree, securityLevel)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Create a vector of primes for a given polyModulusDegree and bitSizes
     *
     * @param polyModulusDegree
     * @param {vector<Int32>} bitSizes
     * @returns {vector<SmallModulus>}
     */
    Create({polyModulusDegree, bitSizes}) {
      try {
        return _Create(polyModulusDegree, bitSizes.instance)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    }
  }
}
