export class SchemeType {
  constructor({library}) {
    // Static methods
    this._none = library.SchemeType.none
    this._BFV = library.SchemeType.BFV
    this._CKKS = library.SchemeType.CKKS
  }

  /**
   * Return the none scheme type
   *
   * @returns {number}
   */
  get none() {
    return this._none
  }

  /**
   * Return the BFV scheme type
   *
   * @returns {number}
   */
  get BFV() {
    return this._BFV
  }

  /**
   * Return the CKKS scheme type
   *
   * @returns {number}
   */
  get CKKS() {
    return this._CKKS
  }
}
