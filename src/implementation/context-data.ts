import { LoaderOptions, Library, Instance } from './emscripten'
import { Exception } from './exception'
import {
  EncryptionParameters,
  EncryptionParametersConstructorOptions
} from './encryption-parameters'
import { ParmsIdType, ParmsIdTypeConstructorOptions } from './parms-id-type'
import {
  EncryptionParameterQualifiers,
  EncryptionParameterQualifiersConstructorOptions
} from './encryption-parameter-qualifiers'

export type ContextDataDependencyOptions = {
  readonly Exception: Exception
  readonly EncryptionParameters: EncryptionParametersConstructorOptions
  readonly ParmsIdType: ParmsIdTypeConstructorOptions
  readonly EncryptionParameterQualifiers: EncryptionParameterQualifiersConstructorOptions
}

export type ContextDataDependencies = {
  ({
    Exception,
    EncryptionParameters,
    ParmsIdType,
    EncryptionParameterQualifiers
  }: ContextDataDependencyOptions): ContextDataConstructorOptions
}

export type ContextDataConstructorOptions = {
  (): ContextData
}

export type ContextData = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly parms: EncryptionParameters
  readonly parmsId: ParmsIdType
  readonly qualifiers: EncryptionParameterQualifiers
  readonly totalCoeffModulusBitCount: number
  readonly prevContextData: ContextData
  readonly nextContextData: ContextData
  readonly chainIndex: number
}

const ContextDataConstructor = (library: Library): ContextDataDependencies => ({
  Exception,
  EncryptionParameters,
  ParmsIdType,
  EncryptionParameterQualifiers
}: ContextDataDependencyOptions): ContextDataConstructorOptions => (): ContextData => {
  let _instance: Instance
  /**
   * @implements ContextData
   */

  /**
   * @interface ContextData
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name ContextData#instance
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
     * @name ContextData#unsafeInject
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
     * @name ContextData#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Returns a const reference to the underlying encryption parameters.
     *
     * @readonly
     * @name ContextData#parms
     * @type {EncryptionParameters}
     */
    get parms() {
      const instance = _instance.parms()
      const encryptionParameters = EncryptionParameters()
      encryptionParameters.unsafeInject(instance)
      return encryptionParameters
    },

    /**
     * Returns the parmsId of the current parameters.
     *
     * @readonly
     * @name ContextData#parmsId
     * @type {ParmsIdType}
     */
    get parmsId() {
      const parms = ParmsIdType()
      parms.inject(_instance.parmsId())
      return parms
    },

    /**
     * Returns a copy of EncryptionParameterQualifiers corresponding to the
     * current encryption parameters. Note that to change the qualifiers it is
     * necessary to create a new instance of SEALContext once appropriate changes
     * to the encryption parameters have been made.
     *
     * @readonly
     * @name ContextData#qualifiers
     * @type {EncryptionParameterQualifiers}
     */
    get qualifiers() {
      const encParmQualifiers = EncryptionParameterQualifiers()
      encParmQualifiers.unsafeInject(_instance.qualifiers())
      return encParmQualifiers
    },

    /**
     * Returns the significant bit count of the total coefficient modulus.
     *
     * @readonly
     * @name ContextData#totalCoeffModulusBitCount
     * @type {number}
     */
    get totalCoeffModulusBitCount() {
      return _instance.totalCoeffModulusBitCount()
    },

    /**
     * Returns a shared_ptr to the context data corresponding to the previous parameters
     * in the modulus switching chain. If the current data is the first one in the
     * chain, then the result is nullptr.
     *
     * @readonly
     * @name ContextData#prevContextData
     * @type {ContextData}
     */
    get prevContextData() {
      const cxtData = ContextDataConstructor(library)({
        Exception,
        EncryptionParameters,
        ParmsIdType,
        EncryptionParameterQualifiers
      })()
      cxtData.unsafeInject(_instance.prevContextData())
      return cxtData
    },

    /**
     * Returns a shared_ptr to the context data corresponding to the next parameters
     * in the modulus switching chain. If the current data is the last one in the
     * chain, then the result is nullptr.
     *
     * @readonly
     * @name ContextData#nextContextData
     * @type {ContextData}
     */
    get nextContextData() {
      const cxtData = ContextDataConstructor(library)({
        Exception,
        EncryptionParameters,
        ParmsIdType,
        EncryptionParameterQualifiers
      })()
      cxtData.unsafeInject(_instance.nextContextData())
      return cxtData
    },

    /**
     * Returns the index of the parameter set in a chain. The initial parameters
     * have index 0 and the index increases sequentially in the parameter chain.
     *
     * @readonly
     * @name EncryptionParameterQualifiers#chainIndex
     * @type {number}
     */
    get chainIndex() {
      return _instance.chainIndex()
    }
  }
}

export const ContextDataInit = ({
  loader
}: LoaderOptions): ContextDataDependencies => {
  const library: Library = loader.library
  return ContextDataConstructor(library)
}
