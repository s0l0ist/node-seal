export class SmallModulus {
  constructor({library}) {
    this._library = library
    this._SmallModulus = library.SmallModulus

    // Static methods
    this._saveToString = library.SmallModulus.saveToString
    this._createFromString = library.SmallModulus.createFromString

    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize() {
    if (this._instance) {
      delete this._instance
    }

    this._instance = new this._SmallModulus()
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  setValue({value}) {
    this._instance.loadFromString(value + '')
  }

  value() {
    return this._instance.Value()
  }

  bitCount() {
    return this._instance.bitCount()
  }

  save() {
    return this._saveToString(this._instance)
  }
}
