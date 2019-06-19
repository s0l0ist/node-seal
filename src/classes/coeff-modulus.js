export class CoeffModulus {
  constructor({library}) {
    this._library = library

    // Static methods
    this._MaxBitCount = library.CoeffModulus.MaxBitCount
    this._BFVDefault = library.CoeffModulus.BFVDefault
    this._Create = library.CoeffModulus.Create

  }

  MaxBitCount({polyModulusDegree, securityLevel}) {
    return this._MaxBitCount(polyModulusDegree, securityLevel)
  }
  BFVDefault({polyModulusDegree, securityLevel}) {
    return this._BFVDefault(polyModulusDegree, securityLevel)
  }
  Create({polyModulusDegree, bitSizes}) {
    return this._Create(polyModulusDegree, bitSizes)
  }
}
