import { LoaderOptions, Library, Instance } from './emscripten'
import { Exception } from './exception'
import { VectorConstructorOptions } from './vector'
import { MemoryPoolHandle } from './memory-pool-handle'
import { PlainText, PlainTextConstructorOptions } from './plain-text'
import { Context } from './context'

export type BatchEncoderDependencyOptions = {
  readonly Exception: Exception
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly PlainText: PlainTextConstructorOptions
  readonly Vector: VectorConstructorOptions
}

export type BatchEncoderDependencies = {
  ({
    Exception,
    MemoryPoolHandle,
    PlainText,
    Vector
  }: BatchEncoderDependencyOptions): BatchEncoderConstructorOptions
}

export type BatchEncoderConstructorOptions = {
  (context: Context): BatchEncoder
}

export type BatchEncoderTypes =
  | Int32Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array

export type BatchEncoder = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly encode: (
    array: BatchEncoderTypes,
    plainText?: PlainText
  ) => PlainText | void
  readonly decode: (
    plainText: PlainText,
    signed?: boolean,
    pool?: MemoryPoolHandle
  ) => Int32Array | Uint32Array
  readonly decodeBigInt: (
    plainText: PlainText,
    signed?: boolean,
    pool?: MemoryPoolHandle
  ) => BigInt64Array | BigUint64Array
  readonly slotCount: number
}

const BatchEncoderConstructor = (
  library: Library
): BatchEncoderDependencies => ({
  Exception,
  MemoryPoolHandle,
  PlainText,
  Vector
}: BatchEncoderDependencyOptions): BatchEncoderConstructorOptions => (
  context
): BatchEncoder => {
  const Constructor = library.BatchEncoder
  let _instance: Instance
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
     * @type {Instance}
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
     * @param {Instance} instance WASM instance
     */
    unsafeInject(instance: Instance) {
      if (_instance) {
        _instance.delete()
        _instance = undefined
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
        _instance = undefined
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
     * @returns {PlainText|void} A new PlainText holding the encoded data or void if one was provided
     * @example
     * import SEAL from 'node-seal'
     * const seal = await SEAL()
     * ...
     * const batchEncoder = seal.BatchEncoder(context)
     *
     * const plainText = batchEncoder.encode(Int32Array.from([1, -2, 3]))
     */
    encode(
      array: Int32Array | Uint32Array | BigInt64Array | BigUint64Array,
      plainText?: PlainText
    ): PlainText | void {
      try {
        if (array.constructor === Int32Array) {
          if (plainText) {
            _instance.encode(array, plainText.instance, 'INT32')
            return
          }
          const plain = PlainText()
          _instance.encode(array, plain.instance, 'INT32')
          return plain
        }

        if (array.constructor === Uint32Array) {
          if (plainText) {
            _instance.encode(array, plainText.instance, 'UINT32')
            return
          }
          const plain = PlainText()
          _instance.encode(array, plain.instance, 'UINT32')
          return plain
        }

        if (array.constructor === BigInt64Array) {
          // When embind supports BigInt64Arrays we can remove this hack
          const stringArray = array.toString().split(',')
          if (plainText) {
            _instance.encode(stringArray, plainText.instance, 'INT64')
            return
          }
          const plain = PlainText()
          _instance.encode(stringArray, plain.instance, 'INT64')
          return plain
        }

        if (array.constructor === BigUint64Array) {
          // When embind supports BigInt64Arrays we can remove this hack
          const stringArray = array.toString().split(',')
          if (plainText) {
            _instance.encode(stringArray, plainText.instance, 'UINT64')
            return
          }
          const plain = PlainText()
          _instance.encode(stringArray, plain.instance, 'UINT64')
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
     * @param {boolean} [signed=true] By default, decode as an Int32Array. If false, decode as an Uint32Array
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}]
     * @returns {Int32Array|Uint32Array} TypedArray containing the decoded data
     * @example
     * import SEAL from 'node-seal'
     * const seal = await SEAL()
     * ...
     * const batchEncoder = seal.BatchEncoder(context)
     *
     * const plainText = batchEncoder.encode(Int32Array.from([1, -2, 3]))
     * const plainTextU = batchEncoder.encode(Uint32Array.from([1, 2, 3]))
     *
     * const result = batchEncoder.decode(plainText)
     * const resultU = batchEncoder.decode(plainTextU, false) // To decode as an Uint32Array
     */
    decode(
      plainText: PlainText,
      signed = true,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): Int32Array | Uint32Array {
      try {
        if (signed) {
          const tempVect = Vector()
          const instance = _instance.decodeInt32(plainText.instance, pool)
          tempVect.unsafeInject(instance)
          tempVect.setType('Int32Array')
          const tempArr = tempVect.toArray() as Int32Array
          tempVect.delete()
          return tempArr
        }
        const tempVect = Vector()
        const instance = _instance.decodeUint32(plainText.instance, pool)
        tempVect.unsafeInject(instance)
        tempVect.setType('Uint32Array')
        const tempArr = tempVect.toArray() as Uint32Array
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
     * @param {boolean} [signed=true] By default, decode as an BigInt64Array. If false, decode as an BigUint64Array
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}]
     * @returns {BigInt64Array|BigUint64Array} TypedArray containing the decoded data
     * @example
     * import SEAL from 'node-seal'
     * const seal = await SEAL()
     * ...
     * const batchEncoder = seal.BatchEncoder(context)
     *
     * const plainText = batchEncoder.encode(BigInt64Array.from([1n, -2n, 3n]))
     * const plainTextU = batchEncoder.encode(BigUint64Array.from([1n, 2n, 3n]))
     *
     * const result = batchEncoder.decodeBigInt(plainText)
     * const resultU = batchEncoder.decodeBigInt(plainTextU, false) // To decode as an BigUint64Array
     */
    decodeBigInt(
      plainText: PlainText,
      signed = true,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): BigInt64Array | BigUint64Array {
      try {
        if (signed) {
          const instance = _instance.decodeBigInt(
            plainText.instance,
            true,
            pool
          )
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
     * @type {number}
     */
    get slotCount() {
      return _instance.slotCount()
    }
  }
}

export const BatchEncoderInit = ({
  loader
}: LoaderOptions): BatchEncoderDependencies => {
  const library: Library = loader.library
  return BatchEncoderConstructor(library)
}
