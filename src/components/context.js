export const Context = library => ({
  ParmsIdType,
  ContextData,
  SecurityLevel
}) => (
  encryptionParams,
  expandModChain = true,
  securityLevel = SecurityLevel.tc128
) => {
  const Constructor = library.SEALContext

  // Static methods
  const _printContext = library.printContext

  let _instance = new Constructor(
    encryptionParams.instance,
    expandModChain,
    securityLevel
  )

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
     * @name Context#unsafeInject
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
     * @name Context#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Prints the context parameters to STDOUT (console.log)
     *
     * @function
     * @name Context#print
     */
    print() {
      return _printContext(_instance)
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
    getContextData(parmsId) {
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
     * @readonly
     * @name Context#parametersSet
     * @type {Boolean}
     */
    get parametersSet() {
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
      return ParmsIdType(_instance.keyParmsId())
    },

    /**
     * Returns a ParmsIdType corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#firstParmsId
     * @type {ParmsIdType}
     */
    get firstParmsId() {
      return ParmsIdType(_instance.firstParmsId())
    },

    /**
     * The ParmsIdType corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#lastParmsId
     * @type {ParmsIdType}
     */
    get lastParmsId() {
      return ParmsIdType(_instance.lastParmsId())
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
     * @type {Boolean}
     */
    get usingKeyswitching() {
      return _instance.usingKeyswitching()
    }
  }
}
