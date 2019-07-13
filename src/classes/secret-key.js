export class SecretKey {
  constructor({library}) {
    this._instance = new library.SecretKey()
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  /**
   * Save the SecretKey to a base64 string
   *
   * @returns {string}
   */
  save() {
    return this._instance.saveToString()
  }

  /**
   * Load a SecretKey from a base64 string
   *
   * @param context
   * @param encoded
   */
  load({context, encoded}) {
    this._instance.loadFromString(context.instance, encoded)
  }
}
