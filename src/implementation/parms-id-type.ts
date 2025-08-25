import { Exception, SealError } from './exception'
import { autoFinalize } from './finalizer'
import { Instance, Library, LoaderOptions } from './seal'

export interface ParmsIdTypeDependencyOptions {
  readonly Exception: Exception
}

export interface ParmsIdTypeDependencies {
  ({ Exception }: ParmsIdTypeDependencyOptions): ParmsIdTypeConstructorOptions
}

export interface ParmsIdTypeConstructorOptions {
  (): ParmsIdType
}

export interface ParmsIdType {
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
    const self: ParmsIdType = {
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
        self.delete()
        _instance = new Constructor(instance)
        fin.reregister(_instance)
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
        if (!_instance) {
          return
        }
        fin.unregister()
        _instance.delete()
        _instance = undefined
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

    const fin = autoFinalize(self, _instance)

    return self
  }

export const ParmsIdTypeInit = ({
  loader
}: LoaderOptions): ParmsIdTypeDependencies => {
  const library: Library = loader.library
  return ParmsIdTypeConstructor(library)
}
