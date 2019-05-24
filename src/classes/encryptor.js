export class Encryptor {
  constructor({library}) {
    this._library = library
    this._Encryptor = library.Encryptor

    // Static Methods
    this._MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
    this._MemoryPoolHandleThreadLocal = library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

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
