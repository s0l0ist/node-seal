import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

/**
 * CKKSEncoder
 * @typedef {Object} CKKSEncoder
 * @constructor
 */
export const CKKSEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  let _instance = null
  try {
    _instance = new library.CKKSEncoder(context.instance)
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
     * Encodes a vector of type double to a given plainText
     * @param {Object} options Options
     * @param {Vector} options.vector Data to encode
     * @param {number} options.scale Scaling parameter defining encoding precision
     * @param {PlainText} options.plainText Destination to store the encoded result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global]
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
     * Decodes a double vector to a given plainText
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global]
     */
    decodeVectorDouble({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.decodeVectorDouble(plainText.instance, vector.instance, pool)
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
     * Returns the total number of CKKS slots available to hold data
     * @returns {number} Number of CKKS slots available
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
