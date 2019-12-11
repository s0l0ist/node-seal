export const CoeffModulus = ({library}) => {

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
      return _MaxBitCount(polyModulusDegree, securityLevel)
    },

    /**
     * Returns a default vector of primes for the BFV CoeffModulus parameter
     *
     * @param polyModulusDegree
     * @param securityLevel
     * @returns {vector<SmallModulus>}
     */
    BFVDefault({polyModulusDegree, securityLevel}) {
      return _BFVDefault(polyModulusDegree, securityLevel)
    },

    /**
     * Create a vector of primes for a given polyModulusDegree and bitSizes
     *
     * @param polyModulusDegree
     * @param {vector<Int32>} bitSizes
     * @returns {vector<SmallModulus>}
     */
    Create({polyModulusDegree, bitSizes}) {
      return _Create(polyModulusDegree, bitSizes.instance)
    }
  }
}
