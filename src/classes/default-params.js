export class DefaultParams {
  constructor({library}) {
    this._library = library

    // Static methods
    this._coeffModulus128 = library.DefaultParams.coeffModulus128
    this._coeffModulus192 = library.DefaultParams.coeffModulus192
    this._coeffModulus256 = library.DefaultParams.coeffModulus256
    this._smallMods60bit = library.DefaultParams.smallMods60bit
    this._smallMods50bit = library.DefaultParams.smallMods50bit
    this._smallMods40bit = library.DefaultParams.smallMods40bit
    this._smallMods30bit = library.DefaultParams.smallMods30bit
    this._dbcMax = library.DefaultParams.dbcMax
    this._dbcMin = library.DefaultParams.dbcMin
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

  smallMods60bit({index}) {
    return this._smallMods60bit(index)
  }
  smallMods50bit({index}) {
    return this._smallMods50bit(index)
  }
  smallMods40bit({index}) {
    return this._smallMods40bit(index)
  }
  smallMods30bit({index}) {
    return this._smallMods30bit(index)
  }

  dbcMax() {
    return this._dbcMax()
  }
  dbcMin() {
    return this._dbcMin()
  }
}
