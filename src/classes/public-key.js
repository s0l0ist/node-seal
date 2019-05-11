class PublicKey {
  constructor({module}) {
    this._module = module
    this._PublicKey = module.PublicKey
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize() {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._PublicKey()
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

  load({value}) {
    this._instance.loadFromString(value)
  }
}

module.exports = PublicKey
