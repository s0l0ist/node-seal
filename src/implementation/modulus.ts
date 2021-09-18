import { LoaderOptions, Library, Instance } from './seal'
import { Exception, SealError } from './exception'
import { VectorConstructorOptions } from './vector'
import { ComprModeType } from './compr-mode-type'

export type ModulusDependencyOptions = {
  readonly Exception: Exception
  readonly ComprModeType: ComprModeType
  readonly Vector: VectorConstructorOptions
}

export type ModulusDependencies = {
  ({
    Exception,
    ComprModeType,
    Vector
  }: ModulusDependencyOptions): ModulusConstructorOptions
}

export type ModulusConstructorOptions = {
  (value: BigInt): Modulus
}

export type Modulus = {
  readonly instance: Instance
  readonly inject: (instance: Instance) => void
  readonly delete: () => void
  readonly setValue: (value: BigInt) => void
  readonly value: BigInt
  readonly bitCount: number
  readonly isZero: boolean
  readonly isPrime: boolean
  readonly save: (compression?: ComprModeType) => string
  readonly saveArray: (compression?: ComprModeType) => Uint8Array
  readonly load: (encoded: string) => void
  readonly loadArray: (array: Uint8Array) => void
}

const ModulusConstructor =
  (library: Library): ModulusDependencies =>
  ({
    Exception,
    ComprModeType,
    Vector
  }: ModulusDependencyOptions): ModulusConstructorOptions =>
  (value: BigInt): Modulus => {
    // Static methods
    const Constructor = library.Modulus

    let _instance = createModulus(value)

    function createModulus(value: BigInt) {
      try {
        const inst = new Constructor()
        inst.setValue(value.toString())
        return inst
      } catch (e) {
        throw Exception.safe(e as SealError)
      }
    }

    /**
     * @implements Modulus
     */

    /**
     * @interface Modulus
     */
    return {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name Modulus#instance
       * @type {Instance}
       */
      get instance() {
        return _instance
      },

      /**
       * Inject this object with a raw WASM instance
       *
       * @private
       * @function
       * @name Modulus#inject
       * @param {Instance} instance WASM instance
       */
      inject(instance: Instance) {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
        _instance = new Constructor(instance)
        instance.delete()
      },

      /**
       * Delete the underlying WASM instance.
       *
       * Should be called before dereferencing this object to prevent the
       * WASM heap from growing indefinitely.
       * @function
       * @name Modulus#delete
       */
      delete() {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
      },

      /**
       * Loads a Modulus from a string representing an uint64 value.
       *
       * @function
       * @name Modulus#setValue
       * @param {BigInt} value BigInt value to set
       */
      setValue(value: BigInt) {
        try {
          _instance.setValue(value.toString())
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * The value of the current Modulus as a BigInt.
       *
       * @readonly
       * @name Modulus#value
       * @type {BigInt}
       */
      get value() {
        // eslint-disable-next-line no-undef
        return BigInt(_instance.value())
      },

      /**
       * The significant bit count of the value of the current Modulus.
       *
       * @readonly
       * @name Modulus#bitCount
       * @type {number}
       */
      get bitCount() {
        return _instance.bitCount()
      },

      /**
       * Whether the value of the current Modulus is zero.
       *
       * @readonly
       * @name Modulus#isZero
       * @type {boolean}
       */
      get isZero() {
        return _instance.isZero()
      },

      /**
       * Whether the value of the current Modulus is a prime number.
       *
       * @readonly
       * @name Modulus#isPrime
       * @type {boolean}
       */
      get isPrime() {
        return _instance.isPrime()
      },

      /**
       * Save the Modulus as a base64 string
       *
       * @function
       * @name Modulus#save
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {string} Base64 encoded string
       */
      save(compression: ComprModeType = ComprModeType.zstd): string {
        return _instance.saveToString(compression)
      },

      /**
       * Save the Modulus as a binary Uint8Array
       *
       * @function
       * @name Modulus#saveArray
       * @param {ComprModeType} [compression={@link ComprModeType.zstd}] The compression mode to use
       * @returns {Uint8Array} A byte array containing the Modulus in binary form
       */
      saveArray(compression: ComprModeType = ComprModeType.zstd): Uint8Array {
        const tempVect = Vector()
        const instance = _instance.saveToArray(compression)
        tempVect.unsafeInject(instance)
        tempVect.setType('Uint8Array')
        const tempArr = tempVect.toArray() as Uint8Array
        tempVect.delete()
        return tempArr
      },

      /**
       * Load a Modulus from a base64 string
       *
       * @function
       * @name Modulus#load
       * @param {string} encoded Base64 encoded string
       */
      load(encoded: string) {
        try {
          _instance.loadFromString(encoded)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Load a Modulus from an Uint8Array holding binary data
       *
       * @function
       * @name Modulus#loadArray
       * @param {Uint8Array} array TypedArray containing binary data
       */
      loadArray(array: Uint8Array) {
        try {
          _instance.loadFromArray(array)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      }
    }
  }

export const ModulusInit = ({ loader }: LoaderOptions): ModulusDependencies => {
  const library: Library = loader.library
  return ModulusConstructor(library)
}
