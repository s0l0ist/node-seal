class CipherText {
  constructor({module}) {
    this._module = module
    this._Ciphertext = module.Ciphertext
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize() {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._Ciphertext()
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }
}

module.exports = CipherText
