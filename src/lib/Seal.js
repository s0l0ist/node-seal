export class SEAL {
  constructor({options}) {
    this._BatchEncoder = options.BatchEncoder
    this._CipherText = options.CipherText
    this._CKKSEncoder = options.CKKSEncoder
    // this._CoeffModulus = options.CoeffModulus
    this._Context = options.Context
    this._Decryptor = options.Decryptor
    this._EncryptionParameters = options.EncryptionParameters
    this._Encryptor = options.Encryptor
    this._Evaluator = options.Evaluator
    // this._Exception = options.Exception
    this._GaloisKeys = options.GaloisKeys
    this._IntegerEncoder = options.IntegerEncoder
    this._KeyGenerator = options.KeyGenerator
    this._Library = options.Library
    // this._MemoryPool = options.MemoryPool
    // this._PlainModulus = options.PlainModulus
    this._PlainText = options.PlainText
    this._PublicKey = options.PublicKey
    this._RelinKeys = options.RelinKeys
    // this._SchemeType = options.SchemeType
    this._SecretKey = options.SecretKey
    // this._SecurityLevel = options.SecurityLevel
    this._SmallModulus = options.SmallModulus
    this._Vector = options.Vector

    // Singletons
    this._CoeffModulus = new options.CoeffModulus({library: this._Library.instance})
    this._Exception = new options.Exception({library: this._Library.instance})
    this._MemoryPool = new options.MemoryPool({library: this._Library.instance})
    this._PlainModulus = new options.PlainModulus({library: this._Library.instance})
    this._SecurityLevel = new options.SecurityLevel({library: this._Library.instance})
    this._SchemeType = new options.SchemeType({library: this._Library.instance})
  }

  /**
   * Create an instance of a BatchEncoder
   *
   * @param context
   * @returns {BatchEncoder}
   * @constructor
   */
  BatchEncoder({context}) {
    return new this._BatchEncoder({library: this._Library.instance, context})
  }

  /**
   * Create an instance of a CipherText
   *
   * @returns {CipherText}
   * @constructor
   */
  CipherText() {
    return new this._CipherText({library: this._Library.instance})
  }

  /**
   * Create an instance of a CKKSEncoder
   *
   * @param context
   * @returns {CKKSEncoder}
   * @constructor
   */
  CKKSEncoder({context}) {
    return new this._CKKSEncoder({library: this._Library.instance, context})
  }

  /**
   * Get the CoeffModulus singleton instance
   *
   * @returns {CoeffModulus}
   */
  get CoeffModulus() {
    return this._CoeffModulus
  }

  /**
   * Create an instance of a Context
   *
   * @param encryptionParams
   * @param expandModChain
   * @param securityLevel
   * @returns {Context}
   * @constructor
   */
  Context({encryptionParams, expandModChain, securityLevel}) {
    return new this._Context({library: this._Library.instance, encryptionParams, expandModChain, securityLevel})
  }

  /**
   * Create an instance of a Decryptor
   *
   * @param context
   * @param secretKey
   * @returns {Decryptor}
   * @constructor
   */
  Decryptor({context, secretKey}) {
    return new this._Decryptor({library: this._Library.instance, context, secretKey})
  }

  /**
   * Create an instance of EncryptionParameters
   *
   * @param schemeType
   * @returns {EncryptionParameters}
   * @constructor
   */
  EncryptionParameters({schemeType}) {
    return new this._EncryptionParameters({library: this._Library.instance, schemeType})
  }

  /**
   * Create an instance of an Encryptor
   *
   * @param context
   * @param publicKey
   * @returns {Encryptor}
   * @constructor
   */
  Encryptor({context, publicKey}) {
    return new this._Encryptor({library: this._Library.instance, context, publicKey})
  }

  /**
   * Create an instance of an Evaluator
   *
   * @param context
   * @returns {Evaluator}
   * @constructor
   */
  Evaluator({context}) {
    return new this._Evaluator({library: this._Library.instance, context})
  }

  /**
   * Get the Exception singleton instance
   *
   * @returns {Exception}
   * @constructor
   */
  get Exception() {
    return this._Exception
  }

  /**
   * Create an instance of GaloisKeys
   *
   * Requires a
   *
   * @returns {GaloisKeys}
   * @constructor
   */
  GaloisKeys() {
    return new this._GaloisKeys({library: this._Library.instance})
  }

  /**
   *
   * Create an instance of an IntegerEncoder
   *
   * @param context
   * @returns {IntegerEncoder}
   * @constructor
   */
  IntegerEncoder({context}) {
    return new this._IntegerEncoder({library: this._Library.instance, context})
  }

  /**
   * Create an instance of a KeyGenerator
   *
   * @param context
   * @param secretKey
   * @param publicKey
   * @returns {KeyGenerator}
   * @constructor
   */
  KeyGenerator({context, secretKey = null, publicKey = null}) {
    return new this._KeyGenerator({library: this._Library.instance, context, secretKey, publicKey})
  }

  /**
   * Get the MemoryPool singleton instance
   *
   * @returns {MemoryPool}
   * @constructor
   */
  get MemoryPool() {
    return this._MemoryPool
  }

  /**
   * Get the PlainModulus singleton instance
   *
   * @returns {PlainModulus}
   * @constructor
   */
  get PlainModulus() {
    return this._PlainModulus
  }

  /**
   * Create an instance of a PlainText
   *
   * @returns {PlainText}
   * @constructor
   */
  PlainText() {
    return new this._PlainText({library: this._Library.instance})
  }

  /**
   * Create an instance of a PublicKey
   *
   * @returns {PublicKey}
   * @constructor
   */
  PublicKey() {
    return new this._PublicKey({library: this._Library.instance})
  }

  /**
   * Create an instance of a RelinKeys
   *
   * @returns {RelinKeys}
   * @constructor
   */
  RelinKeys() {
    return new this._RelinKeys({library: this._Library.instance})
  }

  /**
   * Get the SchemeType singleton instance
   *
   * @returns {SchemeType}
   * @constructor
   */
  get SchemeType() {
    return this._SchemeType
  }

  /**
   * Create an instance of a SecretKey
   *
   * @returns {SecretKey}
   * @constructor
   */
  SecretKey() {
    return new this._SecretKey({library: this._Library.instance})
  }

  /**
   * Get the SecurityLevel singleton instance
   *
   * @returns {SecurityLevel}
   * @constructor
   */
  get SecurityLevel() {
    return this._SecurityLevel
  }

  /**
   * Create an instance of a SmallModulus
   *
   * @returns {SmallModulus}
   * @constructor
   */
  SmallModulus() {
    return new this._SmallModulus({library: this._Library.instance})
  }

  /**
   * Create an instance of a C++ Vector
   *
   * @param array
   * @returns {Vector}
   * @constructor
   */
  Vector({array}) {
    return new this._Vector({library: this._Library.instance, array})
  }
}
