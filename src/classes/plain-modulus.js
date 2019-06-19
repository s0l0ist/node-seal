export class PlainModulus {
  constructor({library}) {
    this._library = library

    // Static methods
    this._Batching = library.PlainModulus.Batching
    this._BatchingVector = library.PlainModulus.BatchingVector

  }

  Batching({polyModulusDegree, bitSize}) {
    return this._Batching(polyModulusDegree, bitSize)
  }
  BatchingVector({polyModulusDegree, bitSizes}) {
    return this._BatchingVector(polyModulusDegree, bitSizes)
  }
}
