export const BatchEncoder = library => ({
  Exception,
  MemoryPoolHandle,
  PlainText,
  Vector
}) => context => {
  const Constructor = library.BatchEncoder
  let _instance = null
  try {
    _instance = new Constructor(context.instance)
  } catch (e) {
    throw Exception.safe(e)
  }

  /**
   * @implements BatchEncoder
   */

  /**
   * @interface BatchEncoder
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name BatchEncoder#instance
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
     * @name BatchEncoder#unsafeInject
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
     * @name BatchEncoder#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Creates a PlainText from a given matrix. This function "batches" a given matrix
     * of either signed or unsigned integers modulo the PlainText modulus into a PlainText element, and stores
     * the result in the destination parameter. The input array must have size at most equal
     * to the degree of the polynomial modulus. The first half of the elements represent the
     * first row of the matrix, and the second half represent the second row. The numbers
     * in the matrix can be at most equal to the PlainText modulus for it to represent
     * a valid PlainText.
     *
     * If the destination PlainText overlaps the input values in memory, the behavior of
     * this function is undefined.
     *
     * @function
     * @name BatchEncoder#encode
     * @param {Int32Array|Uint32Array|BigInt64Array|BigUint64Array} array Data to encode
     * @param {PlainText} [plainText=null] Destination to store the encoded result
     * @returns {PlainText|undefined} A new PlainText holding the encoded data or undefined if one was provided
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal()
     * ...
     * const batchEncoder = Morfix.BatchEncoder(context)
     *
     * const plainText = batchEncoder.encode(Int32Array.from([1, -2, 3]))
     */
    encode(array, plainText = null) {
      try {
        if (array.constructor === Int32Array) {
          if (plainText) {
            _instance.encode(array, plainText.instance, "INT32")
            return
          }
          const plain = PlainText()
          _instance.encode(array, plain.instance, "INT32")
          return plain
        }

        if (array.constructor === Uint32Array) {
          if (plainText) {
            _instance.encode(array, plainText.instance, "UINT32")
            return
          }
          const plain = PlainText()
          _instance.encode(array, plain.instance, "UINT32")
          return plain
        }

        if (array.constructor === BigInt64Array) {
          // When embind supports BigInt64Arrays we can remove this hack
          const stringArray = array.toString().split(',')
          if (plainText) {
            _instance.encode(stringArray, plainText.instance, "INT64")
            return
          }
          const plain = PlainText()
          _instance.encode(stringArray, plain.instance, "INT64")
          return plain
        }

        if (array.constructor === BigUint64Array) {
          // When embind supports BigInt64Arrays we can remove this hack
          const stringArray = array.toString().split(',')
          if (plainText) {
            _instance.encode(stringArray, plainText.instance, "UINT64")
            return
          }
          const plain = PlainText()
          _instance.encode(stringArray, plain.instance, "UINT64")
          return plain
        }

        throw new Error(
          'Unsupported array type! `array` must be of type Int32Array, Uint32Array, BigInt64Array, or BigUint64Array.'
        )
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Inverse of encode. This function "unbatches" a given PlainText into a matrix
     * of signed or unsigned integers modulo the PlainText modulus, and stores the result in the destination
     * parameter. The input PlainText must have degrees less than the polynomial modulus,
     * and coefficients less than the PlainText modulus, i.e. it must be a valid PlainText
     * for the encryption parameters. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name BatchEncoder#decode
     * @param {PlainText} plainText Data to decode
     * @param {Boolean} [signed=true] By default, decode as an Int32Array. If false, decode as an Uint32Array
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}]
     * @returns {Int32Array|Uint32Array} TypedArray containing the decoded data
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal()
     * ...
     * const batchEncoder = Morfix.BatchEncoder(context)
     *
     * const plainText = batchEncoder.encode(Int32Array.from([1, -2, 3]))
     * const plainTextU = batchEncoder.encode(Uint32Array.from([1, 2, 3]))
     *
     * const result = batchEncoder.decode(plainText)
     * const resultU = batchEncoder.decode(plainTextU, false) // To decode as an Uint32Array
     */
    decode(plainText, signed = true, pool = MemoryPoolHandle.global) {
      try {
        if (signed) {
          const tempVect = Vector(new Int32Array(0))
          const instance = _instance.decodeInt32(plainText.instance, pool)
          tempVect.unsafeInject(instance)
          const tempArr = tempVect.toArray()
          tempVect.delete()
          return tempArr
        }
        const tempVect = Vector(new Uint32Array(0))
        const instance = _instance.decodeUInt32(plainText.instance, pool)
        tempVect.unsafeInject(instance)
        const tempArr = tempVect.toArray()
        tempVect.delete()
        return tempArr
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Performs the same function as the 32-bit decode, but supports true 
     * 64-bit values encapsulated by a BigInt.
     * 
     * There's no official support for sending a BigInt64Array/BigUint64Array 
     * from C++ to JS, therefore this function uses string conversion to 
     * marshal data which is noticably slower. Use this function if you 
     * absolutely need to marshal values larger than 32 bits.
     *
     * @see {@link BatchEncoder#decode} for more information about decode.
     * @function
     * @name BatchEncoder#decodeBigInt
     * @param {PlainText} plainText Data to decode
     * @param {Boolean} [signed=true] By default, decode as an BigInt64Array. If false, decode as an BigUint64Array
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}]
     * @returns {BigInt64Array|BigUint64Array} TypedArray containing the decoded data
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal()
     * ...
     * const batchEncoder = Morfix.BatchEncoder(context)
     *
     * const plainText = batchEncoder.encode(BigInt64Array.from([1n, -2n, 3n]))
     * const plainTextU = batchEncoder.encode(BigUint64Array.from([1n, 2n, 3n]))
     *
     * const result = batchEncoder.decodeBigInt(plainText)
     * const resultU = batchEncoder.decodeBigInt(plainTextU, false) // To decode as an BigUint64Array
     */
    decodeBigInt(plainText, signed = true, pool = MemoryPoolHandle.global) {
      try {
        if (signed) {
          const instance = _instance.decodeBigInt(plainText.instance, true, pool)
          return BigInt64Array.from(instance)
        }
        const instance = _instance.decodeBigInt(plainText.instance, false, pool)
        return BigUint64Array.from(instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * The total number of batching slots available to hold data
     *
     * @readonly
     * @name BatchEncoder#slotCount
     * @type {Number}
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}
