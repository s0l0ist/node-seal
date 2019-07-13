export class CoeffModulus {
  constructor({library}) {
    this._CoeffModulus = library.CoeffModulus
    this._MaxBitCount = this._CoeffModulus.MaxBitCount
    this._BFVDefault = this._CoeffModulus.BFVDefault
    this._Create = this._CoeffModulus.Create
  }

  /**
   * Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel
   *
   * @param polyModulusDegree
   * @param securityLevel
   * @returns {number}
   */
  MaxBitCount({polyModulusDegree, securityLevel}) {
    return this._MaxBitCount(polyModulusDegree, securityLevel)
  }

  /**
   * Returns a default vector of primes for the BFV CoeffModulus parameter
   *
   * @param polyModulusDegree
   * @param securityLevel
   * @returns {vector<SmallModulus>}
   */
  BFVDefault({polyModulusDegree, securityLevel}) {
    return this._BFVDefault(polyModulusDegree, securityLevel)
  }

  /**
   * Create a vector of primes for a given polyModulusDegree and bitSizes
   *
   * @param polyModulusDegree
   * @param {vector<Int32>} bitSizes
   * @returns {vector<SmallModulus>}
   */
  Create({polyModulusDegree, bitSizes}) {
    return this._Create(polyModulusDegree, bitSizes.instance)
  }
}
