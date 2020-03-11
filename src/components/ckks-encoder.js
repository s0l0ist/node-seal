export const CKKSEncoder = library => (
  Exception,
  MemoryPoolHandle,
  PlainText,
  Vector
) => context => {
  const Constructor = library.CKKSEncoder
  let _instance = null
  try {
    _instance = new Constructor(context.instance)
  } catch (e) {
    throw Exception.safe(e)
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
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name CKKSEncoder#unsafeInject
     * @param {instance} instance WASM instance
     */
    unsafeInject(instance) {
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
     * @param {Vector} vector Data to encode
     * @param {Number} scale Scaling parameter defining encoding precision
     * @param {PlainText} plainText Destination to store the encoded result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     */
    encodeVectorDouble() {
      throw new Error('encodeVectorDouble has been deprecated since 3.2.0')
    },

    /**
     * Decodes a plaintext polynomial into double-precision floating-point
     * real numbers. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @deprecated since version 3.2.0
     * @function
     * @name CKKSEncoder#decodeVectorDouble
     * @param {PlainText} plainText Data to decode
     * @param {Vector} vector Destination to store the decoded result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     */
    decodeVectorDouble() {
      throw new Error('decodeVectorDouble has been deprecated since 3.2.0')
    },

    /**
     * Encodes a vector of double-precision floating-point real numbers
     * into a plaintext polynomial. Append zeros if vector size is less than N/2.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name CKKSEncoder#encode
     * @param {Float64Array} array Data to encode
     * @param {Number} scale Scaling parameter defining encoding precision
     * @param {PlainText} [plainText=null] Destination to store the encoded result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {PlainText|undefined} A new PlainText holding the encoded data or undefined if one was provided
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const ckksEncoder = Morfix.CKKSEncoder(context)
     *
     * const plainText = ckksEncoder.encode(Float64Array.from([1.11, -2.222, 3.333]), Math.pow(2, 20))
     */
    encode(array, scale, plainText = null, pool = MemoryPoolHandle.global) {
      try {
        if (array.constructor === Float64Array) {
          if (plainText) {
            _instance.encode(array, scale, plainText.instance, pool)
            return
          }
          const plain = PlainText()
          _instance.encode(array, scale, plain.instance, pool)
          return plain
        } else {
          throw new Error(
            'Unsupported array type! `array` must be of type Float64Array.'
          )
        }
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Decodes a plaintext polynomial into double-precision floating-point
     * real numbers. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name CKKSEncoder#decode
     * @param {PlainText} plainText Data to decode
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {Float64Array} TypedArray containing the decoded data
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const ckksEncoder = Morfix.CKKSEncoder(context)
     *
     * const plainText = ckksEncoder.encode(Float64Array.from([1, 2, 3]))
     *
     * const result = batchEncoder.decode(plainText)
     */
    decode(plainText, pool = MemoryPoolHandle.global) {
      const tempVect = Vector(new Float64Array(0))
      const instance = _instance.decodeDouble(plainText.instance, pool)
      tempVect.unsafeInject(instance)
      const tempArr = tempVect.toArray()
      tempVect.delete()
      return tempArr
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
