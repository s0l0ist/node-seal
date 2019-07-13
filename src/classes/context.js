export class Context {
  constructor({library, encryptionParams, expandModChain, securityLevel}) {
    this._SEALContext = library.SEALContext
    this._instance = new this._SEALContext(encryptionParams.instance, expandModChain, securityLevel)

    // Library static method helper
    this._printContext = library.printContext
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  print() {
    this._printContext(this._instance)
  }

  /**
   * Returns the ContextData corresponding to encryption parameters with a given
   * parmsId. If parameters with the given parmsId are not found then the
   * function returns nullptr.
   *
   * @param parmsId
   * @returns ContextData
   */
  getContextData({parmsId}) {
    return this._instance.getContextData(parmsId)
  }

  /**
   * Returns the ContextData corresponding to encryption parameters that are
   * used for keys.
   *
   * @returns ContextData
   */
  keyContextData() {
    return this._instance.keyContextData()
  }

  /**
   * Returns the ContextData corresponding to the first encryption parameters
   * that are used for data.
   *
   * @returns ContextData
   */
  firstContextData() {
    return this._instance.firstContextData()
  }

  /**
   * Returns the ContextData corresponding to the last encryption parameters
   * that are used for data.
   *
   * @returns ContextData
   */
  lastContextData() {
    return this._instance.lastContextData()
  }

  /**
   * Returns whether the encryption parameters are valid.
   *
   * @returns {boolean}
   */
  parametersSet() {
    return this._instance.parametersSet()
  }

  /**
   * Returns a parmsIdType corresponding to the set of encryption parameters
   * that are used for keys.
   *
   * @returns parmsIdType
   */
  keyParmsId() {
    return this._instance.keyParmsId()
  }

  /**
   * Returns a parmsIdType corresponding to the first encryption parameters
   * that are used for data.
   *
   * @returns parmsIdType
   */
  firstParmsId() {
    return this._instance.firstParmsId()
  }

  /**
   * Returns a parmsIdType corresponding to the last encryption parameters
   * that are used for data.
   *
   * @returns parmsIdType
   */
  lastParmsId() {
    return this._instance.lastParmsId()
  }

  /**
   * Returns whether the coefficient modulus supports keyswitching. In practice,
   * support for keyswitching is required by Evaluator.relinearize,
   * Evaluator.applyGalois, and all rotation and conjugation operations. For
   * keyswitching to be available, the coefficient modulus parameter must consist
   * of at least two prime number factors.
   *
   * @returns {boolean}
   */
  usingKeyswitching() {
    return this._instance.usingKeyswitching()
  }
}
