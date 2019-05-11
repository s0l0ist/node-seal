class EncryptionParameters {
  constructor({module}) {
    this._module = module
    this._EncryptionParameters = module.EncryptionParameters

    // Static methods
    this._createFromString = module.EncryptionParameters.createFromString
    this._saveToString = module.EncryptionParameters.saveToString

    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({schemeType, polyDegree, coeffModulus, plainModulus}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._EncryptionParameters(schemeType)
    this._instance.setPolyModulusDegree(polyDegree)
    this._instance.setCoeffModulus(coeffModulus)
    this._instance.setPlainModulus(plainModulus)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  save() {
    return this._saveToString(this.instance)
  }
  load({encryptionParametersString}) {
    this._instance = this._createFromString(encryptionParametersString)
  }
}

module.exports = EncryptionParameters
