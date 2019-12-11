export const BatchEncoder = ({library, context}) => {

  const _MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  let _instance = new library.BatchEncoder(context.instance)

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
     * Creates a plaintext from a given matrix. This function "batches" a given matrix
     * of Int32 integers modulo the plaintext modulus into a plaintext element, and stores
     * the result in the destination parameter. The input vector must have size at most equal
     * to the degree of the polynomial modulus. The first half of the elements represent the
     * first row of the matrix, and the second half represent the second row. The numbers
     * in the matrix can be at most equal to the plaintext modulus for it to represent
     * a valid plaintext.
     *
     * If the destination plaintext overlaps the input values in memory, the behavior of
     * this function is undefined.
     *
     * @param vector
     * @param plainText
     */
    encodeVectorInt32({vector, plainText}) {
      _instance.encodeVectorInt32(vector.instance, plainText.instance)
    },

    /**
     * Creates a plaintext from a given matrix. This function "batches" a given matrix
     * of UInt32 integers modulo the plaintext modulus into a plaintext element, and stores
     * the result in the destination parameter. The input vector must have size at most equal
     * to the degree of the polynomial modulus. The first half of the elements represent the
     * first row of the matrix, and the second half represent the second row. The numbers
     * in the matrix can be at most equal to the plaintext modulus for it to represent
     * a valid plaintext.
     *
     * If the destination plaintext overlaps the input values in memory, the behavior of
     * this function is undefined.
     *
     * @param vector
     * @param plainText
     */
    encodeVectorUInt32({vector, plainText}) {
      _instance.encodeVectorUInt32(vector.instance, plainText.instance)
    },

    /**
     * Inverse of encode Int32. This function "unbatches" a given plaintext into a matrix
     * of integers modulo the plaintext modulus, and stores the result in the destination
     * parameter. The input plaintext must have degress less than the polynomial modulus,
     * and coefficients less than the plaintext modulus, i.e. it must be a valid plaintext
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @param plainText
     * @param vector
     * @param {optional} pool
     */
    decodeVectorInt32({plainText, vector, pool = _MemoryPoolHandleGlobal()}) {
      _instance.decodeVectorInt32(plainText.instance, vector.instance, pool)
    },

    /**
     * Inverse of encode UInt32. This function "unbatches" a given plaintext into a matrix
     * of integers modulo the plaintext modulus, and stores the result in the destination
     * parameter. The input plaintext must have degress less than the polynomial modulus,
     * and coefficients less than the plaintext modulus, i.e. it must be a valid plaintext
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @param plainText
     * @param vector
     * @param {optional} pool
     */
    decodeVectorUInt32({plainText, vector, pool = _MemoryPoolHandleGlobal()}) {
      _instance.decodeVectorUInt32(plainText.instance, vector.instance, pool)
    },

    /**
     * Returns the total number of batching slots available to hold data
     * @returns {number}
     */
    slotCount() {
      return _instance.slotCount()
    }
  }
}
