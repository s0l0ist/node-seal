// eslint-disable-next-line no-unused-vars
export const ContextData = library => (
  Exception,
  EncryptionParameters,
  ParmsIdType,
  EncryptionParameterQualifiers
) => (instance = null) => {
  let _instance = instance

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
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name ContextData#unsafeInject
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
        const encryptionParameters = EncryptionParameters(true)
        encryptionParameters.unsafeInject(instance)
        return encryptionParameters
      } catch (e) {
        throw Exception.safe(e)
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
        return ParmsIdType(_instance.parmsId())
      } catch (e) {
        throw Exception.safe(e)
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
        return EncryptionParameterQualifiers(_instance.qualifiers())
      } catch (e) {
        throw Exception.safe(e)
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
        throw Exception.safe(e)
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
        return ContextData(library)(
          Exception,
          EncryptionParameters,
          ParmsIdType,
          EncryptionParameterQualifiers
        )(_instance.prevContextData())
      } catch (e) {
        throw Exception.safe(e)
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
        return ContextData(library)(
          Exception,
          EncryptionParameters,
          ParmsIdType,
          EncryptionParameterQualifiers
        )(_instance.nextContextData())
      } catch (e) {
        throw Exception.safe(e)
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
        throw Exception.safe(e)
      }
    }
  }
}
