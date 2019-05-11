class KeyGenerator {
  constructor({module}) {
    this._module = module
    this._KeyGenerator = module.KeyGenerator
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({context}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._KeyGenerator(context)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  getPublicKey() {
    return this._instance.getPublicKey()

  }
  getSecretKey() {
    return this._instance.getSecretKey()
  }
}

module.exports = KeyGenerator
