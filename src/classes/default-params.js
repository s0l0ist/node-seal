class DefaultParams {
  constructor({module}) {
    this._module = module

    // Static methods
    this._coeffModulus128 = module.DefaultParams.coeffModulus128
    this._coeffModulus192 = module.DefaultParams.coeffModulus192
    this._coeffModulus256 = module.DefaultParams.coeffModulus256
  }

  coeffModulus128({value}) {
    return this._coeffModulus128(value)
  }
  coeffModulus192({value}) {
    return this._coeffModulus192(value)
  }
  coeffModulus256({value}) {
    return this._coeffModulus256(value)
  }
}

module.exports = DefaultParams
