import { LoaderOptions, Instance, Library } from './emscripten'
import { Exception } from './exception'
import { INSTANCE_DELETED, UNSUPPORTED_VECTOR_TYPE } from './constants'

export type VectorDependencyOptions = {
  readonly Exception: Exception
}

export type VectorDependencies = {
  ({ Exception }: VectorDependencyOptions): VectorConstructorOptions
}

export type VectorConstructorOptions = {
  (): Vector
}

export type Vector = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly from: (array: VectorTypes) => Instance
  readonly type: string
  readonly setType: (type: StringTypes) => void
  readonly size: number
  readonly getValue: (index: number) => number
  readonly resize: (size: number, fill: number) => void
  readonly toArray: () => VectorTypes
  readonly create: () => Vector
}

export type VectorTypes =
  | Uint8Array
  | Int32Array
  | Uint32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

export type StringTypes = 
  | 'Uint8Array' 
  | 'Int32Array' 
  | 'Uint32Array' 
  | 'Float64Array' 
  | 'BigInt64Array'
  | 'BigUint64Array'
  | 'Modulus'

const VectorConstructor = (library: Library): VectorDependencies => ({
  Exception
}: VectorDependencyOptions): VectorConstructorOptions => (): Vector => {
  // Static methods
  const _vecFromArrayUint8 = library.vecFromArrayUint8
  const _vecFromArrayUint32 = library.vecFromArrayUint32
  const _vecFromArrayInt32 = library.vecFromArrayInt32
  const _vecFromArrayFloat64 = library.vecFromArrayFloat64
  const _vecFromArrayBigInt64 = library.vecFromArrayBigInt64
  const _vecFromArrayBigUint64 = library.vecFromArrayBigUint64
  const _vecFromArrayModulus = library.vecFromArrayModulus
  const _jsArrayUint8FromVec = library.jsArrayUint8FromVec
  const _jsArrayUint32FromVec = library.jsArrayUint32FromVec
  const _jsArrayInt32FromVec = library.jsArrayInt32FromVec
  const _jsArrayFloat64FromVec = library.jsArrayFloat64FromVec
  const _jsArrayStringFromVecInt64 = library.jsArrayStringFromVecInt64
  const _jsArrayStringFromVecUint64 = library.jsArrayStringFromVecUint64
  const _jsArrayStringFromVecModulus = library.jsArrayStringFromVecModulus

  let _instance: Instance
  let _type: StringTypes
  /**
   * @implements Vector
   */

  /**
   * @interface Vector
   */
  return {
    /**
     * Create an empty instance
     * @function
     * @name Vector#create
     * @returns {Vector}
     */
    create(): Vector {
      return VectorConstructor(library)({ Exception })()
    },
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Vector#instance
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
     * @name Vector#unsafeInject
     * @param {Instance} instance WASM instance
     */
    unsafeInject(instance: Instance) {
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
     * @name Vector#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    from(array: VectorTypes) {
      try {
        _type = array.constructor.name as StringTypes
        switch (_type) {
          case 'Uint8Array':
            _instance = _vecFromArrayUint8(array)
            break
          case 'Int32Array':
            _instance = _vecFromArrayInt32(array)
            break
          case 'Uint32Array':
            _instance = _vecFromArrayUint32(array)
            break
          case 'Float64Array':
            _instance = _vecFromArrayFloat64(array)
            break
          case 'BigInt64Array':
            _instance = _vecFromArrayBigInt64(array.toString().split(','))
            break
          case 'BigUint64Array':
            _instance = _vecFromArrayBigUint64(array.toString().split(','))
            break
          case 'Modulus':
            _instance = _vecFromArrayModulus(array.toString().split(','))
            break
          default:
            throw new Error(UNSUPPORTED_VECTOR_TYPE)
        }
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * The Vector type
     *
     * @readonly
     * @name Vector#type
     */
    get type(): StringTypes {
      return _type
    },

    /**
     * Set the Vector type
     *
     * @function
     * @name Vector#setType
     * @param {StringTypes} type the type of the vector
     */
    setType(type: StringTypes) {
      _type = type
    },

    /**
     * The vector size
     *
     * @readonly
     * @name Vector#size
     * @type {number}
     */
    get size(): number {
      return _instance.size()
    },

    /**
     * Get a value pointed to by the specified index
     *
     * @function
     * @name Vector#getValue
     * @param {number} index Index of the Vector
     * @returns {number} Value of the element in the Vector pointed to by the index
     */
    getValue(index: number): number {
      try {
        return _instance.get(index)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Resizes a vector to the given size
     *
     * @function
     * @name Vector#resize
     * @param {number} size number of elements to resize
     * @param {number} fill Data to fill the vector with
     */
    resize(size: number, fill: number) {
      try {
        _instance.resize(size, fill)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Copy a vector's data into a Typed Array
     *
     * Note: we cannot simply return a view on the underlying ArrayBuffer
     * because WASM memory can grow and cause all the views to become
     * neutered. We have to perform a hard copy to get data from WASM heap to JS.
     *
     * @function
     * @name Vector#toArray
     * @returns {VectorTypes} TypedArray containing values from the Vector
     */
    toArray(): VectorTypes {
      if (!_instance) {
        throw new Error(INSTANCE_DELETED)
      }
      switch (_type) {
        case 'Uint8Array':
          return Uint8Array.from(_jsArrayUint8FromVec(_instance))
        case 'Int32Array':
          return Int32Array.from(_jsArrayInt32FromVec(_instance))
        case 'Uint32Array':
          return Uint32Array.from(_jsArrayUint32FromVec(_instance))
        case 'Float64Array':
          return Float64Array.from(_jsArrayFloat64FromVec(_instance))
        case 'BigInt64Array':
          return BigInt64Array.from(_jsArrayStringFromVecInt64(_instance))
        case 'BigUint64Array':
          return BigUint64Array.from(_jsArrayStringFromVecUint64(_instance))
        case 'Modulus':
          return BigUint64Array.from(_jsArrayStringFromVecModulus(_instance))
        default:
          throw new Error(UNSUPPORTED_VECTOR_TYPE)
      }
    }
  }
}

export const VectorInit = ({ loader }: LoaderOptions): VectorDependencies => {
  const library: Library = loader.library
  return VectorConstructor(library)
}
