export class Context {
  constructor({library}) {
    this._library = library
    this._SEALContext = library.SEALContext
    this._printContext = library.printContext
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

  contextData() {
    return this._instance.contextData()
  }

  firstParmsId() {
    return this._instance.firstParmsId()
  }
  lastParmsId() {
    return this._instance.lastParmsId()
  }
  parametersSet() {
    return this._instance.parametersSet()
  }
}
