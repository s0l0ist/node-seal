class Context {
  constructor({module}) {
    this._module = module
    this._SEALContext = module.SEALContext
    this._printContext = module.printContext
    this._instance = null
  }

  get instance() {
    return this._instance
  }
  //expandModChain Determines whether the modulus switching chain
  //         should be created
  initialize({encryptionParams, expandModChain}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._SEALContext(encryptionParams, expandModChain)
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
}

module.exports = Context
