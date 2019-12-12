export const CKKSEncoder = ({library, context}) => {

  const _getException = library.getException
  const _MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  let _instance = new library.CKKSEncoder(context.instance)

  return {
    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Encodes a vector of type double to a given plainText
     *
     * @param vector
     * @param scale
     * @param plainText
     * @param {optional} pool
     */
    encodeVectorDouble({vector, scale, plainText, pool = _MemoryPoolHandleGlobal()}) {
      try {
        _instance.encodeVectorDouble(vector.instance, scale, plainText.instance, pool)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Decodes a double vector to a given plainText
     *
     * @param plainText
     * @param vector
     * @param {optional} pool
     */
    decodeVectorDouble({plainText, vector, pool = _MemoryPoolHandleGlobal()}) {
      try {
        _instance.decodeVectorDouble(plainText.instance, vector.instance, pool)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Returns the total number of CKKS slots available to hold data
     * @returns {number}
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
