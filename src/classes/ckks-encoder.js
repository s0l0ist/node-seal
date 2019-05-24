export class CKKSEncoder {
  constructor({library}) {
    this._library = library
    this._CKKSEncoder = library.CKKSEncoder

    // Static Methods
    this._MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
    this._MemoryPoolHandleThreadLocal = library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({context}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._CKKSEncoder(context)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  _encodeVectorDouble({vector, scale, plainText}) {
    return this._instance.encodeVectorDouble(vector, scale, plainText, this._MemoryPoolHandleGlobal())
  }
  _encodeVectorComplexDouble({vector, scale, plainText}) {
    return this._instance.encodeVectorComplexDouble(vector, scale, plainText, this._MemoryPoolHandleGlobal())
  }

  _decodeVectorDouble({plainText, vector}) {
    return this._instance.decodeVectorDouble(plainText, vector, this._MemoryPoolHandleGlobal())
  }
  _decodeVectorComplexDouble({plainText, vector}) {
    return this._instance.decodeVectorComplexDouble(plainText, vector)
  }


  encode({vector, scale, plainText, type}) {
    switch(type) {
      case 'double': return this._encodeVectorDouble({vector, scale, plainText})
      case 'complexDouble': return this._encodeVectorComplexDouble({plainText, scale, vector})
      default: return this._encodeVectorDouble({vector, scale, plainText})
    }
  }

  decode({plainText, vector, type}) {
    switch(type) {
      case 'double': return this._decodeVectorDouble({plainText, vector})
      case 'complexDouble': return this._decodeVectorComplexDouble({plainText, vector})
      default: return this._decodeVectorDouble({plainText, vector})
    }
  }
}
