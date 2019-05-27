export class CipherText {
  constructor({library}) {
    this._instance = new library.Ciphertext()
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

  scale() {
    return this._instance.scale()
  }

  // TODO: Binding type is not defined
  parmsId() {
    return this._instance.parmsId()
  }

  pool() {
    return this._instance.pool()
  }

  save() {
    return this._instance.saveToString()
  }

  load({context, encoded}) {
    this._instance.loadFromString(context, encoded)
  }

  setVectorSize({size}) {
    this._vectorSize = size
  }
  getVectorSize() {
    return this._vectorSize
  }

  setVectorType({type}) {
    this._type = type
  }
  getVectorType() {
    return this._type
  }

  setSchemeType({scheme}) {
    this._scheme = scheme
  }
  getSchemeType() {
    return this._scheme
  }
}
