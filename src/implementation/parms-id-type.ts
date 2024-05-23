import { Exception, SealError } from './exception'
import { Instance, Library, LoaderOptions } from './seal'

export type ParmsIdTypeDependencyOptions = {
  readonly Exception: Exception
}

export type ParmsIdTypeDependencies = {
  ({ Exception }: ParmsIdTypeDependencyOptions): ParmsIdTypeConstructorOptions
}

export type ParmsIdTypeConstructorOptions = {
  (): ParmsIdType
}

export type ParmsIdType = {
  readonly instance: Instance
  readonly inject: (instance: Instance) => void
  readonly delete: () => void
  readonly values: BigUint64Array
}

const ParmsIdTypeConstructor =
  (library: Library): ParmsIdTypeDependencies =>
  ({
    Exception
  }: ParmsIdTypeDependencyOptions): ParmsIdTypeConstructorOptions =>
  (): ParmsIdType => {
    const Constructor = library.ParmsIdType

    let _instance: Instance

    /**
     * @implements ParmsIdType
     */

    /**
     * @interface ParmsIdType
     */
    return {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name ParmsIdType#instance
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
       * @name ParmsIdType#inject
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
       * @name ParmsIdType#delete
       */
      delete() {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
      },

      /**
       * The values of the current ParmsIdType as an Array of BigInts.
       *
       * @readonly
       * @name ParmsIdType#values
       * @type {BigUint64Array}
       */
      get values() {
        try {
          const instance = _instance.values()
          return BigUint64Array.from(instance)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      }
    }
  }

export const ParmsIdTypeInit = ({
  loader
}: LoaderOptions): ParmsIdTypeDependencies => {
  const library: Library = loader.library
  return ParmsIdTypeConstructor(library)
}
