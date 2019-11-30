export class ComprModeType {
  constructor({library}) {
    // Static methods
    this._none = library.ComprModeType.none
    this._deflate = library.ComprModeType.deflate
  }

  /**
   * Return the `none` Compression Mode Type
   *
   * @returns {number}
   */
  get none() {
    return this._none
  }

  /**
   * Return the `deflate` Compression Mode Type
   *
   * @returns {number}
   */
  get deflate() {
    return this._deflate
  }
}
