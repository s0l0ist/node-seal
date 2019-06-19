export class SecurityLevel {
  constructor({library}) {
    this._library = library

    // Static methods
    this._none = library.SecLevelType.none
    this._tc128 = library.SecLevelType.tc128
    this._tc192 = library.SecLevelType.tc192
    this._tc256 = library.SecLevelType.tc256
  }

  get none() {
    return this._none
  }
  get tc128() {
    return this._tc128
  }
  get tc192() {
    return this._tc192
  }
  get tc256() {
    return this._tc256
  }
}
