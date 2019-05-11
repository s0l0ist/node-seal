class PlainText {
  constructor({module}) {
    this._module = module
    this._Plaintext = module.Plaintext
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize() {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._Plaintext()
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  toPolyString() {
    return this._instance.toString()
  }
}

module.exports = PlainText
