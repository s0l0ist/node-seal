import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'
import { PlainText } from './plain-text'

export const CKKSEncoder = ({ library, context }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  const _library = library
  let _instance = null
  try {
    _instance = new library.CKKSEncoder(context.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  const encode = ({
    array,
    scale,
    vector,
    plainText,
    pool = _MemoryPoolHandle.global
  }) => {
    try {
      if (vector) {
        _instance.encodeVectorDouble(
          vector.instance,
          scale,
          plainText.instance,
          pool
        )
        return
      }
      if (array.constructor === Float64Array) {
        if (plainText) {
          _instance.encode(array, scale, plainText.instance, pool)
          return
        }
        const plain = PlainText({ library: _library })
        _instance.encode(array, scale, plain.instance, pool)
        return plain
      } else {
        throw new Error(
          'Unsupported array type! `array` must be of type Float64Array.'
        )
      }
    } catch (e) {
      throw _Exception.safe({ error: e })
    }
  }

  const decode = ({ plainText, vector, pool = _MemoryPoolHandle.global }) => {
    if (vector) {
      _instance.decodeVectorDouble(plainText.instance, vector.instance, pool)
      return
    }
    return _instance.decode(plainText.instance, pool)
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
     * Encodes a vector of double-precision floating-point real numbers
     * into a plaintext polynomial. Append zeros if vector size is less than N/2.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @deprecated since version 3.2.0
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
      console.warn('encodeVectorDouble has been deprecated since 3.2.0')
      encode({ vector, scale, plainText, pool })
    },

    /**
     * Decodes a plaintext polynomial into double-precision floating-point
     * real numbers. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @deprecated since version 3.2.0
     * @function
     * @name CKKSEncoder#decodeVectorDouble
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {Vector} options.vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [options.pool={@link MemoryPoolHandle.global}] MemoryPool to use
     */
    decodeVectorDouble({ plainText, vector, pool = _MemoryPoolHandle.global }) {
      console.warn('decodeVectorDouble has been deprecated since 3.2.0')
      decode({ plainText, vector, pool })
    },

    /**
     * Encodes a vector of double-precision floating-point real numbers
     * into a plaintext polynomial. Append zeros if vector size is less than N/2.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name CKKSEncoder#encode
     * @param {Object} options Options
     * @param {Float64Array} options.array Data to encode
     * @param {Number} options.scale Scaling parameter defining encoding precision
     * @param {PlainText} [options.plainText] Destination to store the encoded result
     * @param {MemoryPoolHandle} [options.pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {PlainText} PlainText holding the encoded data
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const ckksEncoder = Morfix.CKKSEncoder({ context })
     *
     * const plainText = ckksEncoder.encode({
     *   array: Float64Array.from([1.11, -2.222, 3.333])
     * })
     */
    encode: options => encode(options),

    /**
     * Decodes a plaintext polynomial into double-precision floating-point
     * real numbers. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name CKKSEncoder#decode
     * @param {Object} options Options
     * @param {PlainText} options.plainText Data to decode
     * @param {MemoryPoolHandle} [options.pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {Float64Array} TypedArray containing the decoded data
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const ckksEncoder = Morfix.CKKSEncoder({ context })
     *
     * const plainText = Morfix.PlainText()
     * ckksEncoder.encode({ array: Float64Array.from([1, 2, 3]), plainText: plain })
     *
     * const result = batchEncoder.decode({
     *   plainText
     * })
     */
    decode: options => decode(options),

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
