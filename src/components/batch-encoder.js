import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

export const BatchEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  let _instance = null
  try {
    _instance = new library.BatchEncoder(context.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} BatchEncoder
   * @implements IBatchEncoder
   */

  /**
   * @interface IBatchEncoder
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IBatchEncoder#instance
     * @type {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name IBatchEncoder#inject
     * @param {Object} options Options
     * @param {instance} options.instance WASM instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object
     * @function
     * @name IBatchEncoder#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Creates a PlainText from a given matrix. This function "batches" a given matrix
     * of Int32 integers modulo the PlainText modulus into a PlainText element, and stores
     * the result in the destination parameter. The input vector must have size at most equal
     * to the degree of the polynomial modulus. The first half of the elements represent the
     * first row of the matrix, and the second half represent the second row. The numbers
     * in the matrix can be at most equal to the PlainText modulus for it to represent
     * a valid PlainText.
     *
     * If the destination PlainText overlaps the input values in memory, the behavior of
     * this function is undefined.
     *
     * @function
     * @name IBatchEncoder#encodeVectorInt32
     * @param {Object} options Options
     * @param {Vector} options.vector Data to encode
     * @param {PlainText} options.plainText Destination to store the encoded result
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const batchEncoder = Morfix.BatchEncoder({ context })
     * const vectorInt32 = Morfix.Vector({ array: Int32Array.from([1, 2, 3]) })
     * const plain = Morfix.PlainText()
     * batchEncoder.encodeVectorInt32({ vector: vectorInt32, plainText: plain })
     */
    encodeVectorInt32({ vector, plainText }) {
      try {
        _instance.encodeVectorInt32(vector.instance, plainText.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Creates a PlainText from a given matrix. This function "batches" a given matrix
     * of UInt32 integers modulo the PlainText modulus into a PlainText element, and stores
     * the result in the destination parameter. The input vector must have size at most equal
     * to the degree of the polynomial modulus. The first half of the elements represent the
     * first row of the matrix, and the second half represent the second row. The numbers
     * in the matrix can be at most equal to the PlainText modulus for it to represent
     * a valid PlainText.
     *
     * If the destination PlainText overlaps the input values in memory, the behavior of
     * this function is undefined.
     *
     * @function
     * @name IBatchEncoder#encodeVectorUInt32
     * @param {Object} options Options
     * @param {Vector} options.vector Data to encode
     * @param {PlainText} options.plainText Destination to store the encoded result
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const batchEncoder = Morfix.BatchEncoder({ context })
     * const vectorUint32 = Morfix.Vector({ array: Uint32Array.from([1, 2, 3]) })
     * const plain = Morfix.PlainText()
     * batchEncoder.encodeVectorInt32({ vector: vectorUint32, plainText: plain })
     */
    encodeVectorUInt32({ vector, plainText }) {
      try {
        _instance.encodeVectorUInt32(vector.instance, plainText.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Inverse of encode Int32. This function "unbatches" a given PlainText into a matrix
     * of integers modulo the PlainText modulus, and stores the result in the destination
     * parameter. The input PlainText must have degress less than the polynomial modulus,
     * and coefficients less than the PlainText modulus, i.e. it must be a valid PlainText
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name IBatchEncoder#decodeVectorInt32
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global]
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const batchEncoder = Morfix.BatchEncoder({ context })
     *
     * const vectorInt32 = Morfix.Vector({ array: Int32Array.from([1, 2, 3]) })
     * const plain = Morfix.PlainText()
     * batchEncoder.encodeVectorInt32({ vector: vectorInt32, plainText: plain })
     *
     * const decodedVector = Morfix.Vector({ array: new Int32Array() })
     * batchEncoder.decodeVectorInt32({
     *   plainText: plain,
     *   vector: decodedVector
     * })
     */
    decodeVectorInt32({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.decodeVectorInt32(plainText.instance, vector.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Inverse of encode UInt32. This function "unbatches" a given PlainText into a matrix
     * of integers modulo the PlainText modulus, and stores the result in the destination
     * parameter. The input PlainText must have degress less than the polynomial modulus,
     * and coefficients less than the PlainText modulus, i.e. it must be a valid PlainText
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name IBatchEncoder#decodeVectorUInt32
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global]
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const batchEncoder = Morfix.BatchEncoder({ context })
     *
     * const vectorUint32 = Morfix.Vector({ array: Uint32Array.from([1, 2, 3]) })
     * const plain = Morfix.PlainText()
     * batchEncoder.encodeVectorInt32({ vector: vectorUint32, plainText: plain })
     *
     * const decodedVector = Morfix.Vector({ array: new Uint32Array() })
     * batchEncoder.decodeVectorUInt32({
     *   plainText: plain,
     *   vector: decodedVector
     * })
     */
    decodeVectorUInt32({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.decodeVectorUInt32(plainText.instance, vector.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The total number of batching slots available to hold data
     *
     * @readonly
     * @name IBatchEncoder#slotCount
     * @type {Number}
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
