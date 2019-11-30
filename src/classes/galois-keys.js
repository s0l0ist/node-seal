export class GaloisKeys {
  constructor({library}) {
    this._instance = new library.GaloisKeys()
    this._ComprModeType = library.ComprModeType
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      this._instance.delete()
      this._instance = null
    }
    this._instance = instance
  }

  /**
   * Save the galoisKeys to a base64 string
   *
   * @returns {string}
   */
  save({ compression = this._ComprModeType.deflate } = {}) {
    return this._instance.saveToString(compression)
  }

  /**
   * Load a set of galoisKeys from a base64 string
   *
   * @param context
   * @param encoded
   */
  load({context, encoded}) {
    this._instance.loadFromString(context.instance, encoded)
  }
}
