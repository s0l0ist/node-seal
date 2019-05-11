const PlainText = require('./plain-text')
class IntegerEncoder {
  constructor({module}) {
    this._module = module
    this._IntegerEncoder = module.IntegerEncoder
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
    const instance = this._instance.encodeInt32(value)
    PlainText.inject({instance})
    return PlainText
  }
  encodeInt64({value}) {
    const instance = this._instance.encodeInt64(value)
    PlainText.inject({instance})
    return PlainText
  }
  encodeUInt32({value}) {
    const instance = this._instance.encodeUInt32(value)
    PlainText.inject({instance})
    return PlainText
  }
  encodeUInt64({value}) {
    const instance = this._instance.encodeUInt64(value)
    PlainText.inject({instance})
    return PlainText
  }
  encodeBigInt({value}) {
    const instance = this._instance.encodeBigInt(value)
    PlainText.inject({instance})
    return PlainText
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

module.exports = IntegerEncoder
