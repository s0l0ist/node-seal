class SchemeType {
  constructor({module}) {
    this._module = module

    // Static methods
    this._BFV = module.SchemeType.BFV
    this._CKKS = module.SchemeType.CKKS
  }

  get BFV() {
    return this._BFV
  }
  get CKKS() {
    return this._CKKS
  }
}

module.exports = SchemeType
