export class PlainText {
  constructor({library}) {
    this._instance = new library.Plaintext()
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

  toPolyString() {
    return this._instance.toString()
  }
}
