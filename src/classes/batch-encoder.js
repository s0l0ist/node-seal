export class BatchEncoder {
  constructor({library}) {

    this._library = library
    this._BatchEncoder = library.BatchEncoder

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

    this._instance = new this._BatchEncoder(context)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  _encodeVectorInt32({vector, plainText}) {
    return this._instance.encodeVectorInt32(vector, plainText)
  }
  _encodeVectorUInt32({vector, plainText}) {
    return this._instance.encodeVectorUInt32(vector, plainText)
  }

  _decodeVectorInt32({plainText, vector}) {
    return this._instance.decodeVectorInt32(plainText, vector, this._MemoryPoolHandleGlobal())
  }
  _decodeVectorUInt32({plainText, vector}) {
    return this._instance.decodeVectorUInt32(plainText, vector, this._MemoryPoolHandleGlobal())
  }

  encode({vector, plainText, type}) {
    switch (type) {
      case 'int32': return this._encodeVectorInt32({vector, plainText})
      case 'uint32': return this._encodeVectorUInt32({vector, plainText})
      default: return this._encodeVectorInt32({vector, plainText})
    }
  }
  decode({plainText, vector, type}) {
    switch (type) {
      case 'int32': return this._decodeVectorInt32({plainText, vector})
      case 'uint32': return this._decodeVectorUInt32({plainText, vector})
      default: return this._decodeVectorInt32({plainText, vector})
    }
  }

  slotCount() {
    return this._instance.slotCount()
  }
}
