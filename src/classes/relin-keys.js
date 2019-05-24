export class RelinKeys {
  constructor({library}) {
    this._instance = new library.RelinKeys()
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

  save() {
    return this._instance.saveToString()
  }

  load({context, encoded}) {
    this._instance.loadFromString(context, encoded)
  }
}
