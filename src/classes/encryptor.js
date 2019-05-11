class Encryptor {
  constructor({module}) {
    this._module = module
    this._Encryptor = module.Encryptor

    // Static Methods
    this._MemoryPoolHandleGlobal = module.MemoryPoolHandle.MemoryPoolHandleGlobal
    this._MemoryPoolHandleThreadLocal = module.MemoryPoolHandle.MemoryPoolHandleThreadLocal

    this._instance = null

  }

  get instance() {
    return this._instance
  }

  initialize({context, publicKey}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._Encryptor(context, publicKey)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  encrypt({plainText, cipherText}) {
    this._instance.encrypt(plainText, cipherText, this._MemoryPoolHandleGlobal())
  }
}

module.exports = Encryptor
