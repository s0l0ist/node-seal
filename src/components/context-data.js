import { Exception } from './exception'
import { EncryptionParameters } from './encryption-parameters'
import { ParmsIdType } from './parms-id-type'
import { EncryptionParameterQualifiers } from './encryption-parameter-qualifiers'

export const ContextData = ({ library }) => {
  const _Exception = Exception({ library })
  const _library = library
  let _instance = null

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
     * @type {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name ContextData#inject
     * @param {Object} options Options
     * @param {instance} options.instance WASM instance
     */
    inject({ instance }) {
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
      try {
        const instance = _instance.parms()
        const encryptionParameters = EncryptionParameters({
          library: _library,
          suppressWarning: true
        })
        encryptionParameters.inject({ instance })
        return encryptionParameters
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns the parmsId of the current parameters.
     *
     * @readonly
     * @name ContextData#parmsId
     * @type {ParmsIdType}
     */
    get parmsId() {
      try {
        const instance = _instance.parmsId()
        const parmsId = ParmsIdType({ library: _library })
        parmsId.inject({ instance })
        return parmsId
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
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
      try {
        const instance = _instance.qualifiers()
        const encryptionParameterQualifiers = EncryptionParameterQualifiers({
          library: _library
        })
        encryptionParameterQualifiers.inject({ instance })
        return encryptionParameterQualifiers
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns the significant bit count of the total coefficient modulus.
     *
     * @readonly
     * @name ContextData#totalCoeffModulusBitCount
     * @type {Number}
     */
    get totalCoeffModulusBitCount() {
      try {
        return _instance.totalCoeffModulusBitCount()
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
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
      try {
        const instance = _instance.prevContextData()
        const contextData = ContextData({ library: _library })
        contextData.inject({ instance })
        return contextData
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
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
      try {
        const instance = _instance.nextContextData()
        const contextData = ContextData({ library: _library })
        contextData.inject({ instance })
        return contextData
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns the index of the parameter set in a chain. The initial parameters
     * have index 0 and the index increases sequentially in the parameter chain.
     *
     * @readonly
     * @name EncryptionParameterQualifiers#chainIndex
     * @type {Number}
     */
    get chainIndex() {
      try {
        return _instance.chainIndex()
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
