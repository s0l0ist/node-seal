import { LoaderOptions, Library, Instance } from './emscripten'
import { ParmsIdType, ParmsIdTypeConstructorOptions } from './parms-id-type'
import { ContextData, ContextDataConstructorOptions } from './context-data'
import { EncryptionParameters } from './encryption-parameters'
import { SecurityLevel } from './security-level'

export type ContextDependencyOptions = {
  readonly ParmsIdType: ParmsIdTypeConstructorOptions
  readonly ContextData: ContextDataConstructorOptions
  readonly SecurityLevel: SecurityLevel
}

export type ContextDependencies = {
  ({
    ParmsIdType,
    ContextData,
    SecurityLevel
  }: ContextDependencyOptions): ContextConstructorOptions
}

export type ContextConstructorOptions = {
  (
    encryptionParams: EncryptionParameters,
    expandModChain?: boolean,
    securityLevel?: SecurityLevel
  ): Context
}

export type Context = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly toHuman: () => string
  readonly getContextData: (parmsId: ParmsIdType) => ContextData
  readonly keyContextData: ContextData
  readonly firstContextData: ContextData
  readonly lastContextData: ContextData
  readonly parametersSet: () => boolean
  readonly keyParmsId: ParmsIdType
  readonly firstParmsId: ParmsIdType
  readonly lastParmsId: ParmsIdType
  readonly usingKeyswitching: boolean
}

const ContextConstructor = (library: Library): ContextDependencies => ({
  ParmsIdType,
  ContextData,
  SecurityLevel
}: ContextDependencyOptions): ContextConstructorOptions => (
  encryptionParams,
  expandModChain = true,
  securityLevel = SecurityLevel.tc128
): Context => {
  // Static methods
  const Constructor = library.SEALContext

  let _instance = new Constructor(
    encryptionParams.instance,
    expandModChain,
    securityLevel
  ) as Instance

  /**
   * @implements Context
   */

  /**
   * @interface Context
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Context#instance
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
     * @name Context#unsafeInject
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
     * @name Context#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Returns the context parameters in a human readable string format.
     *
     * @private
     * @function
     * @name Context#toString
     * @returns {string} Context details as a string
     */
    toHuman(): string {
      return _instance.toHuman()
    },

    /**
     * Returns the ContextData corresponding to encryption parameters with a given
     * parmsId. If parameters with the given parmsId are not found then the
     * function returns nullptr.
     *
     * @function
     * @name Context#getContextData
     * @param {ParmsIdType} parmsId Specific id to return ContextData for
     * @returns {ContextData} ContextData corresponding to encryption parameters
     */
    getContextData(parmsId: ParmsIdType): ContextData {
      const instance = _instance.getContextData(parmsId.instance)
      const contextData = ContextData()
      contextData.unsafeInject(instance)
      return contextData
    },

    /**
     * The ContextData corresponding to encryption parameters that are used for keys.
     *
     * @readonly
     * @name Context#keyContextData
     * @type {ContextData}
     */
    get keyContextData() {
      const instance = _instance.keyContextData()
      const contextData = ContextData()
      contextData.unsafeInject(instance)
      return contextData
    },

    /**
     * The ContextData corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#firstContextData
     * @type {ContextData}
     */
    get firstContextData() {
      const instance = _instance.firstContextData()
      const contextData = ContextData()
      contextData.unsafeInject(instance)
      return contextData
    },

    /**
     * Returns the ContextData corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#lastContextData
     * @type {ContextData}
     */
    get lastContextData() {
      const instance = _instance.lastContextData()
      const contextData = ContextData()
      contextData.unsafeInject(instance)
      return contextData
    },

    /**
     * Whether the encryption parameters are set in a way that is considered valid by
     * Microsoft SEAL, the variable parameters_set is set to true.
     *
     * @function
     * @name Context#parametersSet
     * @type {boolean}
     */
    parametersSet() {
      return _instance.parametersSet()
    },

    /**
     * Returns a ParmsIdType corresponding to the set of encryption parameters that are used for keys.
     *
     * @readonly
     * @name Context#keyParmsId
     * @type {ParmsIdType}
     */
    get keyParmsId() {
      const instance = _instance.keyParmsId()
      const parmsId = ParmsIdType()
      parmsId.inject(instance)
      return parmsId
    },

    /**
     * Returns a ParmsIdType corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#firstParmsId
     * @type {ParmsIdType}
     */
    get firstParmsId() {
      const instance = _instance.firstParmsId()
      const parmsId = ParmsIdType()
      parmsId.inject(instance)
      return parmsId
    },

    /**
     * The ParmsIdType corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#lastParmsId
     * @type {ParmsIdType}
     */
    get lastParmsId() {
      const instance = _instance.lastParmsId()
      const parmsId = ParmsIdType()
      parmsId.inject(instance)
      return parmsId
    },

    /**
     * Whether the coefficient modulus supports keyswitching. In practice,
     * support for keyswitching is required by Evaluator.relinearize,
     * Evaluator.applyGalois, and all rotation and conjugation operations. For
     * keyswitching to be available, the coefficient modulus parameter must consist
     * of at least two prime number factors.
     *
     * @readonly
     * @name Context#usingKeyswitching
     * @type {boolean}
     */
    get usingKeyswitching() {
      return _instance.usingKeyswitching()
    }
  }
}

export const ContextInit = ({ loader }: LoaderOptions): ContextDependencies => {
  const library: Library = loader.library
  return ContextConstructor(library)
}
