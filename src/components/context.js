import { Exception } from './exception'

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
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} Context
   * @implements IContext
   */

  /**
   * @interface IContext
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IContext#instance
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
     * @name IContext#inject
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
     * Prints the context parameters to STDOUT (console.log)
     *
     * @function
     * @name IContext#print
     */
    print() {
      try {
        _printContext(_instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns the ContextData corresponding to encryption parameters with a given
     * parmsId. If parameters with the given parmsId are not found then the
     * function returns nullptr.
     *
     * @function
     * @name IContext#getContextData
     * @param {Object} options Options
     * @param {ParmsIdType} options.parmsId Specific id to return ContextData for
     * @returns {ContextData} ContextData corresponding to encryption parameters
     */
    getContextData({ parmsId }) {
      try {
        return _instance.getContextData(parmsId)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The ContextData corresponding to encryption parameters that are used for keys.
     *
     * @readonly
     * @name IContext#keyContextData
     * @type {ContextData}
     */
    get keyContextData() {
      return _instance.keyContextData()
    },

    /**
     * The ContextData corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name IContext#firstContextData
     * @type {ContextData}
     */
    get firstContextData() {
      return _instance.firstContextData()
    },

    /**
     * Returns the ContextData corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name IContext#lastContextData
     * @type {ContextData}
     */
    get lastContextData() {
      return _instance.lastContextData()
    },

    /**
     * Whether the encryption parameters are set in a way that is considered valid by
     * Microsoft SEAL, the variable parameters_set is set to true.
     *
     * @readonly
     * @name IContext#parametersSet
     * @type {Boolean}
     */
    get parametersSet() {
      return _instance.parametersSet()
    },

    /**
     * Returns a parmsIdType corresponding to the set of encryption parameters that are used for keys.
     *
     * @readonly
     * @name IContext#keyParmsId
     * @type {ParmsIdType}
     */
    get keyParmsId() {
      return _instance.keyParmsId()
    },

    /**
     * Returns a parmsIdType corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name IContext#firstParmsId
     * @type {ParmsIdType}
     */
    get firstParmsId() {
      return _instance.firstParmsId()
    },

    /**
     * The parmsIdType corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name IContext#lastParmsId
     * @type {ParmsIdType}
     */
    get lastParmsId() {
      return _instance.lastParmsId()
    },

    /**
     * Whether the coefficient modulus supports keyswitching. In practice,
     * support for keyswitching is required by Evaluator.relinearize,
     * Evaluator.applyGalois, and all rotation and conjugation operations. For
     * keyswitching to be available, the coefficient modulus parameter must consist
     * of at least two prime number factors.
     *
     * @readonly
     * @name IContext#usingKeyswitching
     * @type {Boolean}
     */
    get usingKeyswitching() {
      return _instance.usingKeyswitching()
    }
  }
}
