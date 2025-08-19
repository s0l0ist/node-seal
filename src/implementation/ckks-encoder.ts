import { UNSUPPORTED_CKKS_ENCODE_ARRAY_TYPE } from './constants'
import { Context } from './context'
import { Exception, SealError } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'
import { PlainText, PlainTextConstructorOptions } from './plain-text'
import { Instance, Library, LoaderOptions } from './seal'
import { VectorConstructorOptions } from './vector'

export interface CKKSEncoderDependencyOptions {
  readonly Exception: Exception
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly PlainText: PlainTextConstructorOptions
  readonly Vector: VectorConstructorOptions
}

export interface CKKSEncoderDependencies {
  ({
    Exception,
    MemoryPoolHandle,
    PlainText,
    Vector
  }: CKKSEncoderDependencyOptions): CKKSEncoderConstructorOptions
}

export interface CKKSEncoderConstructorOptions {
  (context: Context): CKKSEncoder
}

export type CKKSEncoderTypes = Float64Array

export interface CKKSEncoder {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly encode: (
    array: CKKSEncoderTypes,
    scale: number,
    plainText?: PlainText,
    pool?: MemoryPoolHandle
  ) => PlainText | void
  readonly decode: (
    plainText: PlainText,
    pool?: MemoryPoolHandle
  ) => CKKSEncoderTypes
  readonly slotCount: number
}

const CKKSEncoderConstructor =
  (library: Library): CKKSEncoderDependencies =>
  ({
    Exception,
    MemoryPoolHandle,
    PlainText,
    Vector
  }: CKKSEncoderDependencyOptions): CKKSEncoderConstructorOptions =>
  (context): CKKSEncoder => {
    const Constructor = library.CKKSEncoder
    let _instance: Instance
    try {
      _instance = new Constructor(context.instance)
    } catch (e) {
      throw Exception.safe(e as SealError)
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
       * @name CKKSEncoder#unsafeInject
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
       * @name CKKSEncoder#delete
       */
      delete() {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
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
       * @param {number} scale Scaling parameter defining encoding precision
       * @param {PlainText} [plainText] Destination to store the encoded result
       * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
       * @returns {PlainText|void} A new PlainText holding the encoded data or void if one was provided
       * @example
       * import SEAL from 'node-seal'
       * const seal = await SEAL()
       * ...
       * const ckksEncoder = seal.CKKSEncoder(context)
       *
       * const plainText = ckksEncoder.encode(Float64Array.from([1.11, -2.222, 3.333]), Math.pow(2, 20))
       */
      encode(
        array: Float64Array,
        scale: number,
        plainText?: PlainText,
        pool: MemoryPoolHandle = MemoryPoolHandle.global
      ): PlainText | void {
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
            throw new Error(UNSUPPORTED_CKKS_ENCODE_ARRAY_TYPE)
          }
        } catch (e) {
          throw Exception.safe(e as SealError)
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
       * import SEAL from 'node-seal'
       * const seal = await SEAL()
       * ...
       * const ckksEncoder = seal.CKKSEncoder(context)
       *
       * const plainText = ckksEncoder.encode(Float64Array.from([1, 2, 3]))
       *
       * const result = ckksEncoder.decode(plainText)
       */
      decode(
        plainText: PlainText,
        pool: MemoryPoolHandle = MemoryPoolHandle.global
      ): Float64Array {
        try {
          const tempVect = Vector()
          const instance = _instance.decodeDouble(plainText.instance, pool)
          tempVect.unsafeInject(instance)
          tempVect.setType('Float64Array')
          const tempArr = tempVect.toArray() as Float64Array
          tempVect.delete()
          return tempArr
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * The total number of CKKS slots available to hold data
       *
       * @readonly
       * @name CKKSEncoder#slotCount
       * @type {number}
       */
      get slotCount() {
        return _instance.slotCount()
      }
    }
  }

export const CKKSEncoderInit = ({
  loader
}: LoaderOptions): CKKSEncoderDependencies => {
  const library: Library = loader.library
  return CKKSEncoderConstructor(library)
}
