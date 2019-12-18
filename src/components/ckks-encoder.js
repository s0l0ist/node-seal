import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

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
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {instance} instance - wasm instance
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
     *
     * @param {Vector} vector - Data to encode
     * @param {number} scale - Scaling parameter defining encoding precision
     * @param {PlainText} plainText - Destination to store the encoded result
     * @param {MemoryPoolHandle} [pool=MemoryPoolHandle.global]
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
     *
     * @param {PlainText} plainText - Data to decode
     * @param {Vector} vector - Destination to store the decoded result
     * @param {MemoryPoolHandle} [pool=MemoryPoolHandle.global]
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
     * @returns {number} - Number of CKKS slots available
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
