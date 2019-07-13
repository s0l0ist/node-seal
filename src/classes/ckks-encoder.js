export class CKKSEncoder {
  constructor({library, context}) {
    this._CKKSEncoder = library.CKKSEncoder
    this._MemoryPoolHandle = library.MemoryPoolHandle

    // Static methods
    this._MemoryPoolHandleGlobal = this._MemoryPoolHandle.MemoryPoolHandleGlobal

    this._instance = new this._CKKSEncoder(context.instance)
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
   * Encodes a vector of type double to a given plainText
   *
   * @param vector
   * @param scale
   * @param plainText
   * @param {optional} pool
   */
  encodeVectorDouble({vector, scale, plainText, pool = this._MemoryPoolHandleGlobal()}) {
    this._instance.encodeVectorDouble(vector.instance, scale, plainText.instance, pool)
  }

  /**
   * Encodes a vector of type complex double to a given plainText
   *
   * @param vector
   * @param scale
   * @param plainText
   * @param {optional} pool
   */
  encodeVectorComplexDouble({vector, scale, plainText, pool = this._MemoryPoolHandleGlobal()}) {
    this._instance.encodeVectorComplexDouble(vector.instance, scale, plainText.instance, pool)
  }

  /**
   * Decodes a double vector to a given plainText
   *
   * @param plainText
   * @param vector
   * @param {optional} pool
   */
  decodeVectorDouble({plainText, vector, pool = this._MemoryPoolHandleGlobal()}) {
    this._instance.decodeVectorDouble(plainText.instance, vector.instance, pool)
  }

  /**
   * Decodes a complex double vector to a given plainText
   *
   * @param plainText
   * @param vector
   * @param {optional} pool
   */
  decodeVectorComplexDouble({plainText, vector, pool = this._MemoryPoolHandleGlobal()}) {
    this._instance.decodeVectorComplexDouble(plainText.instance, vector.instance, pool)
  }
}
