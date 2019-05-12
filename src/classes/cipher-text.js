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

  save() {
    return this._instance.saveToString()
  }

  load({context, encoded}) {
    this._instance.loadFromString(context, encoded)
  }
}

module.exports = CipherText
