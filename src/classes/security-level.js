export class SecurityLevel {
  constructor({library}) {
    // Static methods
    this._none = library.SecLevelType.none
    this._tc128 = library.SecLevelType.tc128
    this._tc192 = library.SecLevelType.tc192
    this._tc256 = library.SecLevelType.tc256
  }

  /**
   * Returns the 'none' security type
   *
   * @returns SecurityType
   */
  get none() {
    return this._none
  }

  /**
   * Returns the '128' security type
   *
   * @returns SecurityType
   */
  get tc128() {
    return this._tc128
  }

  /**
   * Returns the '192' security type
   *
   * @returns SecurityType
   */
  get tc192() {
    return this._tc192
  }

  /**
   * Returns the '256' security type
   *
   * @returns SecurityType
   */
  get tc256() {
    return this._tc256
  }
}
