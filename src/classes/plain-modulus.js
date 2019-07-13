export class PlainModulus {
  constructor({library}) {
    // Static methods
    this._Batching = library.PlainModulus.Batching
    this._BatchingVector = library.PlainModulus.BatchingVector
  }

  /**
   * Creates a prime number SmallModulus for use as plainModulus encryption
   * parameter that supports batching with a given polyModulusDegree.
   *
   * @param polyModulusDegree
   * @param bitSize
   * @returns {SmallModulus}
   */
  Batching({polyModulusDegree, bitSize}) {
    return this._Batching(polyModulusDegree, bitSize)
  }

  /**
   * Creates several prime number SmallModulus elements that can be used as
   * plainModulus encryption parameters, each supporting batching with a given
   * polyModulusDegree.
   *
   * @param polyModulusDegree
   * @param {vector<Int32>} bitSizes
   * @returns {vector<SmallModulus>}
   */
  BatchingVector({polyModulusDegree, bitSizes}) {
    return this._BatchingVector(polyModulusDegree, bitSizes.instance)
  }
}
