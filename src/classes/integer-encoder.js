export class IntegerEncoder {
  constructor({library}) {
    this._library = library
    this._IntegerEncoder = library.IntegerEncoder
    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({context}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._IntegerEncoder(context)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  encodeInt32({value}) {
    return this._instance.encodeInt32(value)
  }
  encodeInt64({value}) {
    return this._instance.encodeInt64(value)
  }
  encodeUInt32({value}) {
    return this._instance.encodeUInt32(value)
  }
  encodeUInt64({value}) {
    return this._instance.encodeUInt64(value)
  }
  encodeBigInt({value}) {
    return this._instance.encodeBigInt(value)
  }

  decodeInt32({plainText}) {
    return this._instance.decodeInt32(plainText)
  }
  decodeInt64({plainText}) {
    return this._instance.decodeInt64(plainText)
  }
  decodeUInt32({plainText}) {
    return this._instance.decodeUInt32(plainText)
  }
  decodeUInt64({plainText}) {
    return this._instance.decodeUInt64(plainText)
  }
  decodeBigInt({plainText}) {
    return this._instance.decodeBigInt(plainText)
  }
}
