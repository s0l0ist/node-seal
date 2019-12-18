import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

/**
 * BatchEncoder
 * @typedef {Object} BatchEncoder
 * @constructor
 */
export const BatchEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  let _instance = null
  try {
    _instance = new library.BatchEncoder(context.instance)
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(
      typeof e === 'number'
        ? _Exception.getHuman(e)
        : e instanceof Error
        ? e.message
        : e
    )
  }

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     * @private
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {Object} options Options
     * @param {instance} options.instance wasm instance
     * @private
     */
    inject({ instance }) {
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
     * @param {Object} options Options
     * @param {Vector} options.vector Data to encode
     * @param {PlainText} options.plainText Destination to store the encoded result
     */
    encodeVectorInt32({ vector, plainText }) {
      try {
        _instance.encodeVectorInt32(vector.instance, plainText.instance)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
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
     * @param {Object} options Options
     * @param {Vector} options.vector Data to encode
     * @param {PlainText} options.plainText Destination to store the encoded result
     */
    encodeVectorUInt32({ vector, plainText }) {
      try {
        _instance.encodeVectorUInt32(vector.instance, plainText.instance)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Inverse of encode Int32. This function "unbatches" a given plaintext into a matrix
     * of integers modulo the plaintext modulus, and stores the result in the destination
     * parameter. The input plaintext must have degress less than the polynomial modulus,
     * and coefficients less than the plaintext modulus, i.e. it must be a valid plaintext
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global]
     */
    decodeVectorInt32({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.decodeVectorInt32(plainText.instance, vector.instance, pool)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Inverse of encode UInt32. This function "unbatches" a given plaintext into a matrix
     * of integers modulo the plaintext modulus, and stores the result in the destination
     * parameter. The input plaintext must have degress less than the polynomial modulus,
     * and coefficients less than the plaintext modulus, i.e. it must be a valid plaintext
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global]
     */
    decodeVectorUInt32({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.decodeVectorUInt32(plainText.instance, vector.instance, pool)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Returns the total number of batching slots available to hold data
     * @returns {number} Number of batching slots available to hold data
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
