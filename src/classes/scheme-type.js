export class SchemeType {
  constructor({library}) {
    this._library = library

    // Static methods
    this._BFV = library.SchemeType.BFV
    this._CKKS = library.SchemeType.CKKS
  }

  get BFV() {
    return this._BFV
  }
  get CKKS() {
    return this._CKKS
  }
}
