export class KeyGenerator {
  constructor({library}) {
    this._library = library
    this._KeyGenerator = library.KeyGenerator
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({context, secretKey = null, publicKey = null}) {
    if (this._instance) {
      delete this._instance
    }
    if (!secretKey && !publicKey) {
      this._instance = new this._KeyGenerator(context)
      return
    }
    if (secretKey && !publicKey) {
      this._instance = new this._KeyGenerator(context, secretKey)
      return
    }
    if (secretKey && publicKey) {
      this._instance = new this._KeyGenerator(context, secretKey, publicKey)
      return
    }
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  getPublicKey() {
    return this._instance.getPublicKey()

  }
  getSecretKey() {
    return this._instance.getSecretKey()
  }

  genRelinKeys({decompositionBitCount, size}) {
    return this._instance.createRelinKeys(decompositionBitCount, size)
  }

  genGaloisKeys({decompositionBitCount}) {
    return this._instance.createGaloisKeys(decompositionBitCount)
  }
}
