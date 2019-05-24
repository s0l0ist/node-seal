export class Decryptor {
  constructor({library}) {
    this._library = library
    this._Decryptor = library.Decryptor
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({context, secretKey}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._Decryptor(context, secretKey)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  decrypt({cipherText, plainText}) {
    this._instance.decrypt(cipherText, plainText)
  }
  invariantNoiseBudget({cipherText}) {
    return this._instance.invariantNoiseBudget(cipherText)
  }
}
