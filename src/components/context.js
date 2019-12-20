import { Exception } from './exception'

/**
 * Context
 * @typedef {Object} Context
 * @constructor
 */
export const Context = ({
  library,
  encryptionParams,
  expandModChain,
  securityLevel
}) => {
  const _Exception = Exception({ library })
  const _printContext = library.printContext
  let _instance = null
  try {
    _instance = new library.SEALContext(
      encryptionParams.instance,
      expandModChain,
      securityLevel
    )
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(
      typeof e === 'number'
        ? _Exception.getHuman(e)
        : e instanceof Error
        ? e.message
        : e
    )
  }

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     * @private
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {Object} options Options
     * @param {instance} options.instance wasm instance
     * @private
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Delete the underlying wasm instance
     *
     * Should be called before dereferencing this object
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Prints the context parameters to STDOUT (console.log)
     */
    print() {
      try {
        _printContext(_instance)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Returns the ContextData corresponding to encryption parameters with a given
     * parmsId. If parameters with the given parmsId are not found then the
     * function returns nullptr.
     * @param {Object} options Options
     * @param {*} options.parmsId specific id to return contextdata for
     * @returns {*} contextData corresponding to encryption parameters
     */
    getContextData({ parmsId }) {
      try {
        return _instance.getContextData(parmsId)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Returns the ContextData corresponding to encryption parameters that are used for keys.
     * @returns {*} contextData corresponding to encryption parameters that are used for keys.
     */
    get keyContextData() {
      return _instance.keyContextData()
    },

    /**
     * Returns the ContextData corresponding to the first encryption parameters that are used for data.
     * @returns {*} contextData corresponding to the first encryption parameters that are used for data
     */
    get firstContextData() {
      return _instance.firstContextData()
    },

    /**
     * Returns the ContextData corresponding to the last encryption parameters that are used for data.
     * @returns {*} contextData corresponding to the last encryption parameters that are used for data
     */
    get lastContextData() {
      return _instance.lastContextData()
    },

    /**
     * If the encryption parameters are set in a way that is considered valid by
     * Microsoft SEAL, the variable parameters_set is set to true.
     * @returns {boolean} are encryption parameters set in a way that is considered valid
     */
    get parametersSet() {
      return _instance.parametersSet()
    },

    /**
     * Returns a parmsIdType corresponding to the set of encryption parameters that are used for keys.
     * @returns {*} parmsIdType corresponding to the set of encryption parameters that are used for keys
     */
    get keyParmsId() {
      return _instance.keyParmsId()
    },

    /**
     * Returns a parmsIdType corresponding to the first encryption parameters that are used for data.
     * @returns {*} parmsIdType corresponding to the first encryption parameters that are used for data
     */
    get firstParmsId() {
      return _instance.firstParmsId()
    },

    /**
     * Returns a parmsIdType corresponding to the last encryption parameters that are used for data.
     * @returns {*} parmsIdType corresponding to the last encryption parameters that are used for data
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
     * @returns {boolean} coefficient modulus supports keyswitching
     */
    get usingKeyswitching() {
      return _instance.usingKeyswitching()
    }
  }
}
