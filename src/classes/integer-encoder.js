export class IntegerEncoder {
  constructor({library, context}) {
    this._IntegerEncoder = library.IntegerEncoder
    this._instance = new this._IntegerEncoder(context.instance)
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
   * Encode an Int32 value
   *
   * @param value
   */
  encodeInt32({value}) {
    this._instance.encodeInt32(value)
  }

  /**
   * Encode an Int64 value
   *
   * @param value
   */
  encodeInt64({value}) {
    this._instance.encodeInt64(value)
  }

  /**
   * Encode an UInt32 value
   *
   * @param value
   */
  encodeUInt32({value}) {
    this._instance.encodeUInt32(value)
  }

  /**
   * Encode an UInt64 value
   *
   * @param value
   */
  encodeUInt64({value}) {
    this._instance.encodeUInt64(value)
  }

  /**
   * Encode an BigInt value
   *
   * @param value
   */
  encodeBigInt({value}) {
    this._instance.encodeBigInt(value)
  }

  /**
   * Decode an Int32 value
   *
   * @param value
   */
  decodeInt32({plainText}) {
    this._instance.decodeInt32(plainText.instance)
  }

  /**
   * Decode an Int64 value
   *
   * @param value
   */
  decodeInt64({plainText}) {
    this._instance.decodeInt64(plainText.instance)
  }

  /**
   * Decode an UInt32 value
   *
   * @param value
   */
  decodeUInt32({plainText}) {
    this._instance.decodeUInt32(plainText.instance)
  }

  /**
   * Decode an UInt64 value
   *
   * @param value
   */
  decodeUInt64({plainText}) {
    this._instance.decodeUInt64(plainText.instance)
  }

  /**
   * Decode an BigInt value
   *
   * @param value
   */
  decodeBigInt({plainText}) {
    this._instance.decodeBigInt(plainText.instance)
  }
}
