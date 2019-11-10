export class Encryptor {
  constructor({library, context, publicKey}) {
    this._Encryptor = library.Encryptor
    this._BatchEncoder = library.BatchEncoder
    this._MemoryPoolHandle = library.MemoryPoolHandle

    // Static methods
    this._MemoryPoolHandleGlobal = this._MemoryPoolHandle.MemoryPoolHandleGlobal

    this._instance = new this._Encryptor(context.instance, publicKey.instance)
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
   * Encrypts a plaintext and stores the result in the destination parameter.
   * Dynamic memory allocations in the process are allocated from the memory
   * pool pointed to by the given MemoryPoolHandle.
   *
   * @param plainText
   * @param cipherText
   * @param pool
   */
  encrypt({plainText, cipherText, pool = this._MemoryPoolHandleGlobal()}) {
    this._instance.encrypt(plainText.instance, cipherText.instance, pool)
  }
}
