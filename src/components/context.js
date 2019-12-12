export const Context = ({library, encryptionParams, expandModChain, securityLevel}) => {

  const _getException = library.getException
  const _printContext = library.printContext
  let _instance = new library.SEALContext(encryptionParams.instance, expandModChain, securityLevel)

  return {
    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Prints the context parameters to STDOUT (console.log)
     */
    print() {
      try {
        _printContext(_instance)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Returns the ContextData corresponding to encryption parameters with a given
     * parmsId. If parameters with the given parmsId are not found then the
     * function returns nullptr.
     *
     * @param parmsId
     * @returns ContextData
     */
    getContextData({parmsId}) {
      try {
        return _instance.getContextData(parmsId)
      } catch (e) {
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Returns the ContextData corresponding to encryption parameters that are
     * used for keys.
     *
     * @returns ContextData
     */
    get keyContextData() {
      return _instance.keyContextData()
    },

    /**
     * Returns the ContextData corresponding to the first encryption parameters
     * that are used for data.
     *
     * @returns ContextData
     */
    get firstContextData() {
      return _instance.firstContextData()
    },

    /**
     * Returns the ContextData corresponding to the last encryption parameters
     * that are used for data.
     *
     * @returns ContextData
     */
    get lastContextData() {
      return _instance.lastContextData()
    },

    /**
     * If the encryption parameters are set in a way that is considered valid by
     * Microsoft SEAL, the variable parameters_set is set to true.
     */
    get parametersSet() {
      return _instance.parametersSet()
    },

    /**
     * Returns a parmsIdType corresponding to the set of encryption parameters
     * that are used for keys.
     *
     * @returns parmsIdType
     */
    get keyParmsId() {
      return _instance.keyParmsId()
    },

    /**
     * Returns a parmsIdType corresponding to the first encryption parameters
     * that are used for data.
     *
     * @returns parmsIdType
     */
    get firstParmsId() {
      return _instance.firstParmsId()
    },

    /**
     * Returns a parmsIdType corresponding to the last encryption parameters
     * that are used for data.
     *
     * @returns parmsIdType
     */
    get lastParmsId() {
      return _instance.lastParmsId()
    },

    /**
     * Returns whether the coefficient modulus supports keyswitching. In practice,
     * support for keyswitching is required by Evaluator.relinearize,
     * Evaluator.applyGalois, and all rotation and conjugation operations. For
     * keyswitching to be available, the coefficient modulus parameter must consist
     * of at least two prime number factors.
     *
     * @returns {boolean}
     */
    get usingKeyswitching() {
      return _instance.usingKeyswitching()
    }
  }
}
