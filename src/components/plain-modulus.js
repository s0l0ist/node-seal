export const PlainModulus = ({library}) => {

  const _getException = library.getException
  const _Batching = library.PlainModulus.Batching
  const _BatchingVector = library.PlainModulus.BatchingVector

  return {

    /**
     * Creates a prime number SmallModulus for use as plainModulus encryption
     * parameter that supports batching with a given polyModulusDegree.
     *
     * @param {number} polyModulusDegree
     * @param {number} bitSize
     * @returns {SmallModulus}
     */
    Batching({polyModulusDegree, bitSize}) {
      try {
        return _Batching(polyModulusDegree, bitSize)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException({ pointer: e }) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Creates several prime number SmallModulus elements that can be used as
     * plainModulus encryption parameters, each supporting batching with a given
     * polyModulusDegree.
     *
     * @param {number} polyModulusDegree
     * @param {vector<Int32>} bitSizes
     * @returns {vector<SmallModulus>}
     */
    BatchingVector({polyModulusDegree, bitSizes}) {
      try {
        return _BatchingVector(polyModulusDegree, bitSizes.instance)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException({ pointer: e }) : e instanceof Error ? e.message : e)
      }
    }
  }
}
