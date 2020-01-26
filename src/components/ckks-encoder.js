import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

export const CKKSEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  let _instance = null
  try {
    _instance = new library.CKKSEncoder(context.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @implements CKKSEncoder
   */

  /**
   * @interface CKKSEncoder
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name CKKSEncoder#instance
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
     * @name CKKSEncoder#inject
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
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name CKKSEncoder#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Encodes a vector of type double to a given plainText
     *
     * @function
     * @name CKKSEncoder#encodeVectorDouble
     * @param {Object} options Options
     * @param {Vector} options.vector Data to encode
     * @param {Number} options.scale Scaling parameter defining encoding precision
     * @param {PlainText} options.plainText Destination to store the encoded result
     * @param {MemoryPoolHandle} [options.pool={@link MemoryPoolHandle.global}] MemoryPool to use
     */
    encodeVectorDouble({
      vector,
      scale,
      plainText,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.encodeVectorDouble(
          vector.instance,
          scale,
          plainText.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Decodes a double vector to a given plainText
     *
     * @function
     * @name CKKSEncoder#decodeVectorDouble
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool={@link MemoryPoolHandle.global}] MemoryPool to use
     */
    decodeVectorDouble({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.decodeVectorDouble(plainText.instance, vector.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The total number of CKKS slots available to hold data
     *
     * @readonly
     * @name CKKSEncoder#slotCount
     * @type {Number}
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
