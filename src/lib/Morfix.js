import {SEAL} from './Seal'

/**
 * Morfix class declaration
 */
export class MORFIX extends SEAL {
  constructor({options}) {
    super({options})

    // Instances
    this.publicKey = null
    this.secretKey = null
    this.relinKeys = null
    this.galoisKeys = null

    // Internal helpers
    this._scale = null
    this._polyModulusDegree = null
    this._plainModulus = null
    this._coeffModulus = null
    this._schemeType = null

    this.__BatchEncoder = null
    this.__CKKSEncoder = null
    this.__Context = null
    this.__Decryptor = null
    this.__EncryptionParameters = null
    this.__Encryptor = null
    this.__Evaluator = null
    this.__IntegerEncoder = null
    this.__KeyGenerator = null
  }

  set publicKey(key) {
    this._publicKey = key
  }
  get publicKey() {
    return this._publicKey
  }

  set secretKey(key) {
    this._secretKey = key
  }
  get secretKey() {
    return this._secretKey
  }

  set relinKeys(key) {
    this._relinKeys = key
  }
  get relinKeys() {
    return this._relinKeys
  }

  set galoisKeys(key) {
    this._galoisKeys = key
  }
  get galoisKeys() {
    return this._galoisKeys
  }

  /**
   * Print a c++ vector to the console
   * @param vector
   * @param type
   * @param printSize
   * @param precision
   */
  printVector({vector, printSize = 4, precision = 5, type = 'int32'}) {
    this.Vector.printVector({vector, printSize, precision, type})
  }

  /**
   * Print a c++ vector as a BFV matrix
   * @param vector
   * @param rowSize
   * @param type
   */
  printMatrix({vector, rowSize = this._BatchEncoder.slotCount() / 2, type = 'int32'}) {
    this.Vector.printMatrix({vector, rowSize, type})
  }

  /**
   * Return a security type based on the specified bit level of security
   *
   * @param security
   * @returns {SecurityLevel}
   * @private
   */
  _getSecurityLevel({security}) {
    switch (security) {
      case 128: return this.SecurityLevel.tc128
      case 192: return this.SecurityLevel.tc192
      case 256: return this.SecurityLevel.tc256
      default: throw new Error('Invalid `security` setting!')
    }
  }

  /**
   * Return a predefined polyModulusDegree value for a given computationLevel
   *
   * Allows manual override by specifying an integer value of a power of 2. Anything else will crash.
   *
   * @param computationLevel
   * @returns {number}
   * @private
   */
  _getPolyModulusDegree({computationLevel}) {
    switch (computationLevel.toLowerCase()) {
      case 'low': return 4096
      case 'medium': return 8192
      case 'high': return 16384
      default: throw new Error('Invalid `computationLevel`')
    }
  }

  /**
   * Return a SmallModulus prime to enable batching mode
   *
   * @param polyModulusDegree
   * @param bitSize
   * @returns {*}
   * @private
   */
  _getPlainModulus({polyModulusDegree, bitSize}){
    const sm = this.PlainModulus.Batching({polyModulusDegree, bitSize})
    // console.log('SM Value:', sm.value())
    return sm
  }

  /**
   * Create a good set of default parameters for the encryption library.
   *
   * The `scale` parameter is only used for the CKKS scheme.
   *
   * @param computationLevel
   * @param security
   * @param plainModulusBitSize
   *
   * @returns {{securityLevel: number, plainModulus: null|SmallModulus, scale: number, polyModulusDegree: number}}
   */
  createParams({computationLevel = 'low', security = 128, plainModulusBitSize = 20} = {}) {
    return {
      polyModulusDegree: this._getPolyModulusDegree({computationLevel}),
      plainModulus: this._getPlainModulus({polyModulusDegree: this._getPolyModulusDegree({computationLevel}), bitSize: plainModulusBitSize}),
      scale: this._getScale({polyModulusDegree: this._getPolyModulusDegree({computationLevel}), securityLevel: this._getSecurityLevel({security})}),
      securityLevel: this._getSecurityLevel({security})
    }
  }

  /**
   * Initialize the given Context and Evaluator
   * @private
   */
  _initContext({securityLevel}) {

    this.__Context = this.Context({
      encryptionParams: this.__EncryptionParameters,
      expandModChain: true,
      securityLevel
    })

    // this.__Context.print()

    this.__Evaluator = this.Evaluator({
      context: this.__Context
    })
  }

  /**
   * Initializes the BFV parameters for the library
   * @param polyModulusDegree
   * @param plainModulus
   * @param securityLevel
   * @private
   */
  _initBFV({polyModulusDegree, plainModulus, securityLevel}) {
    // const sm = new this.SmallModulus({library: this.Library})
    // sm.setValue({value: plainModulus})

    this.__EncryptionParameters = this.EncryptionParameters({
      schemeType: this.SchemeType.BFV
    })
    this.__EncryptionParameters.setPolyModulusDegree({polyModulusDegree})
    this.__EncryptionParameters.setCoeffModulus({coeffModulus: this.CoeffModulus.BFVDefault({polyModulusDegree, securityLevel})})
    this.__EncryptionParameters.setPlainModulus({plainModulus})

    this._initContext({securityLevel})

    this.__IntegerEncoder = this.IntegerEncoder({
      context: this.__Context
    })

    this.__BatchEncoder = this.BatchEncoder({
      context: this.__Context
    })
  }

  /**
   * Calculates and returns the appropriate scale for a given security context.
   *
   * The scale directly affects the maximum integer values that can be encrypted.
   * These are arbitrarily defined and by no means have any strong reasoning behind
   * their selection.
   *
   * How to calculate the scale for a desired range of integers:
   *   2^(M)         =     2^(N - S - 1)
   *      `-- Max Int Bits     `.   `-- Scale bits
   *                             `-- Sum of (N - 1) primes' bits (we don't include the last prime)
   *
   *  Ex for 4096, tc128 we have:
   *    2^M = 2^((46 + 16) - S - 1)
   *
   * To achieve M = 10, we need to set the scale to be at most 2^51
   *    2^10 = 2^((46 + 16) - 51 - 1)
   *
   * You can also play with the number of primes and their bit sizes as long as they don't
   * exceed the MaxBitCount as indicated in the comments.
   *
   *    2^10 = 2^((42 + 20) - 51 - 1)
   *
   * Keep in mind, if there is more than one prime that you need to have a good difference between
   * the highest and lowest prime so decryption results in good precision. So it's best to select
   * primes that are of the following (large prime, small primes..., last prime [special prime]).
   *
   * Here you can see the difficulties in specifying a default set of CoeffModulus primes and
   * the scale because they can drastically affect the precision and maximum integer values.
   *
   * @param polyModulusDegree
   * @param security
   * @returns {number}
   * @private
   */
  _getScale({polyModulusDegree, securityLevel}) {
    switch (polyModulusDegree) {
      case 4096:
        switch (securityLevel) {
          case this.SecurityLevel.tc128: return Math.pow(2, 16) // max 109
          case this.SecurityLevel.tc192: return Math.pow(2, 16) // max 75
          case this.SecurityLevel.tc256: return Math.pow(2, 25) // max 58
          default: throw new Error('Invalid `securityLevel`!')
        }
      case 8192:
        switch (securityLevel) {
          case this.SecurityLevel.tc128: return Math.pow(2, 20) // max 218
          case this.SecurityLevel.tc192: return Math.pow(2, 20) // max 152
          case this.SecurityLevel.tc256: return Math.pow(2, 20) // max 118
          default: throw new Error('Invalid `securityLevel`!')
        }
      case 16384:
        switch (securityLevel) {
          case this.SecurityLevel.tc128: return Math.pow(2, 39) // max 438
          case this.SecurityLevel.tc192: return Math.pow(2, 39) // max 300
          case this.SecurityLevel.tc256: return Math.pow(2, 39) // max 237
          default: throw new Error('Invalid `securityLevel`!')
        }
      default: throw new Error('Invalid `polyModulusDegree`!')
    }
  }

  /**
   * Create a vector of SmallModulus for the coefficients
   *
   * The sum of the vectors should not exceed CoeffModulus::MaxBitCount
   *
   * @param polyModulusDegree
   * @param securityLevel
   * @private
   */
  _createCoeffVector({polyModulusDegree, securityLevel}) {
    let vector = null
    switch (polyModulusDegree) {
      case 4096:
        switch (securityLevel) {
          case this.SecurityLevel.tc128: // max 109, leftover = 1 bits
            vector = this.Vector({array: new Int32Array([46, 16, 46])})
            break
          case this.SecurityLevel.tc192: // max 75, leftover = 1 bits
            vector = this.Vector({array: new Int32Array([29, 16, 29])})
            break
          case this.SecurityLevel.tc256: // max 58, leftover = 0 bits
            // This case is unique because if we decide on having a focus on
            // circuit depth, we completely sacrifice precision and maximum
            // integer values. This is why we keep it at the max of one coeff
            // modulus.
            vector = this.Vector({array: new Int32Array([58])})
            // vector.push_back(21)
            // vector.push_back(16)
            // vector.push_back(21)
            break
          default:
            throw new Error('Invalid `securityLevel`!')
        } break
      case 8192:
        switch (securityLevel) {
          case this.SecurityLevel.tc128: // max 218, leftover = 18 bits
            vector = this.Vector({array: new Int32Array([60, 20, 20, 20, 20, 60])})
            break;
          case this.SecurityLevel.tc192: // max 152, leftover = 0 bits
            vector = this.Vector({array: new Int32Array([56, 20, 20, 56])})
            break;
          case this.SecurityLevel.tc256: // max 118, leftover = 0 bits
            vector = this.Vector({array: new Int32Array([39, 20, 20, 39])})
            break;
          default:
            throw new Error('Invalid `securityLevel`!')
        } break
      case 16384:
        switch (securityLevel) {
          case this.SecurityLevel.tc128: // max 438, leftover = 6 bits
            vector = this.Vector({array: new Int32Array([60, 39, 39, 39, 39, 39, 39, 39, 39, 60])})
            break
          case this.SecurityLevel.tc192: // max 305, leftover = 29 bits
            vector = this.Vector({array: new Int32Array([60, 39, 39, 39, 39, 60])})
            break
          case this.SecurityLevel.tc256: // max 237, leftover = 0 bits
            vector = this.Vector({array: new Int32Array([60, 39, 39, 39, 60])})
            break
          default:
            throw new Error('Invalid `securityLevel`!')
        } break
      default: throw new Error('Invalid `polyModulusDegree`!')
    }

    // this.printVector({vector})
    return vector
  }
  /**
   * Initialize the CKKS parameters for the library
   * @param polyModulusDegree
   * @param securityLevel
   * @private
   */
  _initCKKS({polyModulusDegree, securityLevel}) {

    this.__EncryptionParameters = this.EncryptionParameters({
      schemeType: this.SchemeType.CKKS,
    })
    this.__EncryptionParameters.setPolyModulusDegree({polyModulusDegree})
    this.__EncryptionParameters.setCoeffModulus({coeffModulus: this.CoeffModulus.Create({polyModulusDegree, bitSizes: this._createCoeffVector({polyModulusDegree, securityLevel})})})

    this._initContext({securityLevel})

    this.__CKKSEncoder = this.CKKSEncoder({
      context: this.__Context
    })
  }


  /**
   * Initialize the encryption library
   *
   * @param schemeType
   * @param polyModulusDegree
   * @param plainModulus
   * @param security
   * @param scale
   */
  initialize({schemeType, polyModulusDegree, plainModulus, scale, securityLevel}) {
    this._schemeType = schemeType
    this._polyModulusDegree = polyModulusDegree
    this._plainModulus = plainModulus
    this._scale = scale
    this._securityLevel = securityLevel

    switch (schemeType) {
      case 'BFV': this._initBFV({polyModulusDegree, plainModulus, securityLevel}); break;
      case 'CKKS': this._initCKKS({polyModulusDegree, securityLevel}); break;
      default: throw new Error('Invalid `schemeType`!')
    }
  }

  /**
   * Generate the Public and Secret keys to be used for decryption and encryption
   */
  genKeys() {

    this.__KeyGenerator = this.KeyGenerator({
      context: this.__Context
    })

    if (this.publicKey) {
      delete this.publicKey
    }
    this.publicKey = this.__KeyGenerator.getPublicKey()

    if (this.secretKey) {
      delete this.secretKey
    }
    this.secretKey = this.__KeyGenerator.getSecretKey()

    this.__Encryptor = this.Encryptor({
      context: this.__Context,
      publicKey: this.publicKey
    })

    this.__Decryptor = this.Decryptor({
      context: this.__Context,
      secretKey: this.secretKey
    })
  }

  /**
   * Generate the Relinearization Keys to help lower noise after homomorphic operations
   */
  genRelinKeys() {
    this.__KeyGenerator = this.KeyGenerator({
      context: this.__Context,
      secretKey: this.secretKey ? this.secretKey : null,
      publicKey: this.publicKey ? this.publicKey : null
    })

    if (this.relinKeys) {
      delete this.relinKeys
    }

    this.relinKeys = this.__KeyGenerator.genRelinKeys()
  }

  /**
   * Generate the Galois Keys to perform matrix rotations for vectorized data
   */
  genGaloisKeys() {
    this.__KeyGenerator = this.KeyGenerator({
      context: this.__Context,
      secretKey: this.secretKey ? this.secretKey : null,
      publicKey: this.publicKey ? this.publicKey : null
    })

    if (this.galoisKeys) {
      delete this.galoisKeys
    }

    this.galoisKeys = this.__KeyGenerator.genGaloisKeys()
  }

  /**
   * Encrypt an array using the BFV scheme
   * @param array
   * @returns {CipherText}
   * @private
   */
  _encryptBFV({array}) {

    if (array.length > this._polyModulusDegree) {
      throw new Error(`Input array is too large for the 'polyModulusDegree' specified (${this._polyModulusDegree})`)
    }

    const vector = this.Vector({array})

    const type = vector.type
    /**
     * Each element in the array should not be larger than half of the plainModulus
     *
     * For int32, the limit is -1/2 * `plainModulus` <-> +1/2 * `plainModulus`
     * for uint32, the limit is 0 <-> `plainModulus - 1`
     */
    const isNotValid = array.some(el => {
      if (type === Int32Array) {
        return (Math.abs(el) > Math.floor(this._plainModulus / 2))
      }
      if (type === Uint32Array) {
        return (el < 0 || el > this._plainModulus - 1)
      }
      return false
    })

    if (isNotValid) {
      if (type === Int32Array) {
        throw new Error(`Array element out of range: -1/2 * 'plainModulus' (${this._plainModulus}) <-> +1/2 * 'plainModulus' (${this._plainModulus})`)
      }
      if (type === Uint32Array) {
        throw new Error(`Array element out of range: 0 <-> 'plainModulus' - 1 (${this._plainModulus} - 1)`)
      }
    }

    const plainText = this.PlainText()

    switch (type) {
      case Int32Array: this.__BatchEncoder.encodeVectorInt32({vector: vector, plainText: plainText}); break;
      case Uint32Array: this.__BatchEncoder.encodeVectorUInt32({vector: vector, plainText: plainText}); break;
      default: throw new Error('Invalid vector type!')
    }

    const cipherText = this.CipherText()
    this.__Encryptor.encrypt({plainText: plainText, cipherText: cipherText})

    // Store the vector size so that we may filter the array upon decryption
    cipherText.setVectorSize({size: vector.size})
    cipherText.setVectorType({type: type})
    cipherText.setSchemeType({scheme: 'BFV'})
    return cipherText
  }

  /**
   * Encrypt an array using the CKKS scheme
   *
   * @param array
   * @returns {CipherText}
   * @private
   */
  _encryptCKKS({array}) {

    if (array.length > this._polyModulusDegree / 2) {
      throw new Error(`Input array is too large for the 1/2 'polyModulusDegree' specified (1/2 * ${this._polyModulusDegree})`)
    }

    const vector = this.Vector({array})
    const type = vector.type
    /**
     * Each element in the array should not be larger than 2^53 to ensure
     * more reliable decryption. This is due to JS Number limitations.
     *
     * For CKKS, the limit is -2^53 <-> +2^53
     */
    const isNotValid = array.some(el => {
      return (Math.abs(el) > Math.pow(2, 53))
    })

    if (isNotValid) {
      throw new Error('Array element out of range: (2^53 - 1) to -(2^53 - 1)). This is a JS Number limitation due to lack of true 64bit numbers.')
    }

    const plainText = this.PlainText()

    this.__CKKSEncoder.encodeVectorDouble({
      vector: vector,
      scale: this._scale, // Global scale set when creating the context. Can be overridden.
      plainText: plainText,
    })

    const cipherText = this.CipherText()
    this.__Encryptor.encrypt({plainText: plainText, cipherText: cipherText})

    // Set a few attributes on the
    cipherText.setVectorSize({size: vector.size})
    cipherText.setVectorType({type: type})
    cipherText.setSchemeType({scheme: 'CKKS'})
    return cipherText
  }

  /**
   * Encrypt a given array
   * @param array
   * @returns {CipherText}
   */
  encrypt({array}) {
    /**
     * Check if we have NaNs
     */
    if (array.some(Number.isNaN)) {
      throw new Error(`All values must be a 'Number'`)
    }

    /**
     * Check if we have values that are out of bounds
     * IEEE-754 double precision number (all integers from (2^53 - 1) to -(2^53 - 1))
     */
    if (array.some(x => x > Number.MAX_SAFE_INTEGER)) {
      throw new Error(`Cannot encrypt elements with values greater than 'Number.MAX_SAFE_INTEGER' (${Number.MAX_SAFE_INTEGER}). This is a JS Number limitation due to lack of true 64bit numbers.`)
    }
    if (array.some(x => x < Number.MIN_SAFE_INTEGER)) {
      throw new Error(`Cannot encrypt elements with values less than 'Number.MIN_SAFE_INTEGER' (${Number.MIN_SAFE_INTEGER}). This is a JS Number limitation due to lack of true 64bit numbers.`)
    }

    /**
     * Detect validity of schemeType with element types
     */
    if ((this._schemeType === 'BFV') && !((array.constructor === Int32Array) || (array.constructor === Uint32Array))) {
      throw new Error(`Invalid mix of schemeType '${this._schemeType}' and element type '${array.constructor}'.`)
    }

    if ((this._schemeType === 'CKKS') && (array.constructor !== Float64Array)) {
      throw new Error(`Invalid mix of schemeType '${this._schemeType}' and element type '${array.constructor}'.`)
    }

    switch (this._schemeType) {
      case 'BFV': return this._encryptBFV({array})
      case 'CKKS': return this._encryptCKKS({array})
      default: throw new Error('Cannot encrypt an unsupported SchemeType!')
    }
  }

  /**
   * Decrypt a ciphertext using the BFV scheme
   * @param cipherText
   * @returns {Int32Array|Uint32Array|Float64Array|Array}
   * @private
   */
  _decryptBFV({cipherText}) {

    const vector = this.Vector({array: new (cipherText.getVectorType())})
    const plainText = this.PlainText()

    this.__Decryptor.decrypt({cipherText: cipherText, plainText: plainText})

    switch (vector.type) {
      case Int32Array: this.__BatchEncoder.decodeVectorInt32({plainText: plainText, vector: vector}); break;
      case Uint32Array: this.__BatchEncoder.decodeVectorUInt32({plainText: plainText, vector: vector}); break;
      default: throw new Error('Invalid vector type!')
    }

    // We trim back the vector to the original size that was recorded before encryption was performed
    vector.resize({size: cipherText.getVectorSize(), fill: 0})

    // vector.printVector()
    // vector.printMatrix()

    return vector.toArray()
  }

  /**
   * Decrypt a ciphertext using the CKKS scheme
   * @param cipherText
   * @returns {Int32Array|Uint32Array|Float64Array|Array}
   * @private
   */
  _decryptCKKS({cipherText}) {

    const vector = this.Vector({array: new (cipherText.getVectorType())})
    const plainText = this.PlainText()

    this.__Decryptor.decrypt({cipherText: cipherText, plainText: plainText})

    this.__CKKSEncoder.decodeVectorDouble({plainText: plainText, vector: vector, type: vector.type})

    // We trim back the vector to the original size that was recorded before encryption was performed
    vector.resize({size: cipherText.getVectorSize(), fill: 0})

    // vector.printVector()

    return vector.toArray()
  }

  /**
   * Decrypt a given ciphertext
   * @param cipherText
   * @returns {Int32Array|Uint32Array|Float64Array|Array}
   */
  decrypt({cipherText}) {
    switch (this._schemeType) {
      case 'BFV': return this._decryptBFV({cipherText})
      case 'CKKS': return this._decryptCKKS({cipherText})
      default: return this._decryptBFV({cipherText})
    }
  }


  /**
   * Negate a cipher
   * @param {CipherText} cipherText
   * @returns {CipherText} destination
   */
  negate({cipherText}) {
    const destination = this.CipherText()
    this.__Evaluator.add({encrypted: cipherText, destination: destination})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: cipherText.getVectorSize()})
    destination.setVectorType({type: cipherText.getVectorType()})
    destination.setSchemeType({scheme: cipherText.getSchemeType()})
    return destination
  }

  /**
   * Add's cipher B to cipher A
   * @param {CipherText} a
   * @param {CipherText} b
   * @returns {CipherText} destination
   */
  add({a, b}) {
    if (a.getSchemeType() !== b.getSchemeType()) {
      throw new Error('Ciphers must have the same SchemeType!')
    }

    const destination = this.CipherText()
    this.__Evaluator.add({a: a, b: b, destination: destination})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: a.getVectorSize()})
    destination.setVectorType({type: a.getVectorType()})
    destination.setSchemeType({scheme: a.getSchemeType()})
    return destination
  }

  /**
   * Subtract cipher B from cipher A
   * @param {CipherText} a
   * @param {CipherText} b
   * @returns {CipherText} destination
   */
  sub({a, b}) {
    if (a.getSchemeType() !== b.getSchemeType()) {
      throw new Error('Ciphers must have the same SchemeType!')
    }

    const destination = this.CipherText()
    this.__Evaluator.sub({a: a, b: b, destination: destination})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: a.getVectorSize()})
    destination.setVectorType({type: a.getVectorType()})
    destination.setSchemeType({scheme: a.getSchemeType()})
    return destination
  }

  /**
   * Multiply cipher A by cipher B
   * @param {CipherText} a
   * @param {CipherText} b
   * @returns {CipherText} destination
   */
  multiply({a, b}) {
    if (a.getSchemeType() !== b.getSchemeType()) {
      throw new Error('Ciphers must have the same SchemeType!')
    }

    const destination = this.CipherText()
    this.__Evaluator.multiply({a: a, b: b, destination: destination})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: a.getVectorSize()})
    destination.setVectorType({type: a.getVectorType()})
    destination.setSchemeType({scheme: a.getSchemeType()})
    return destination
  }

  /**
   * Square a cipher
   * @param {CipherText} cipherText
   * @returns {CipherText} destination
   */
  square({cipherText}) {

    const destination = this.CipherText()
    this.__Evaluator.square({encrypted: cipherText, destination: destination})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: cipherText.getVectorSize()})
    destination.setVectorType({type: cipherText.getVectorType()})
    destination.setSchemeType({scheme: cipherText.getSchemeType()})
    return destination
  }

  /**
   * Relinearize a cipher
   * @param {CipherText} cipherText
   * @param {RelinKeys?} relinKeys - Defaults to internal RelinKeys
   * @returns {CipherText} destination
   */
  relinearize({cipherText, relinKeys = this.relinKeys}) {
    if (!relinKeys) {
      throw new Error('No relinKeys were generated! Run `Crypt.genRelinKeys()` before calling this function.')
    }

    const destination = this.CipherText()
    this.__Evaluator.relinearize({encrypted: cipherText, relinKeys: relinKeys, destination: destination})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: cipherText.getVectorSize()})
    destination.setVectorType({type: cipherText.getVectorType()})
    destination.setSchemeType({scheme: cipherText.getSchemeType()})
    return destination
  }

  /**
   * Load and return a PublicKey from a base64 string
   *
   * @param encoded
   * @returns {PublicKey}
   */
  loadPublicKey({encoded}) {
    if (this.publicKey) {
      delete this.publicKey
    }

    this.publicKey = this.PublicKey()
    this.publicKey.load({context: this.__Context, encoded})

    this.__Encryptor = this.Encryptor({
      context: this.__Context,
      publicKey: this.publicKey
    })
    return this.publicKey
  }

  /**
   * Load and return a SecretKey from a base64 string
   *
   * @param encoded
   * @returns {SecretKey}
   */
  loadSecretKey({encoded}) {
    if (this.secretKey) {
      delete this.secretKey
    }

    this.secretKey = this.SecretKey()
    this.secretKey.load({context: this.__Context, encoded})

    this.__Decryptor = this.Decryptor({
      context: this.__Context,
      secretKey: this.secretKey
    })
    return this.secretKey
  }

  /**
   * Load and return a SecretKey from a base64 string
   *
   * @param encoded
   * @returns {RelinKeys}
   */
  loadRelinKeys({encoded}) {
    if (this.relinKeys) {
      delete this.relinKeys
    }

    this.relinKeys = this.RelinKeys()
    this.relinKeys.load({context: this.__Context, encoded})
    return this.relinKeys
  }

  /**
   * Load and return a set of GaloisKeys from a base64 string
   *
   * @param encoded
   * @returns {GaloisKeys}
   */
  loadGaloisKeys({encoded}) {
    if (this.galoisKeys) {
      delete this.galoisKeys
    }

    this.galoisKeys = this.GaloisKeys()
    this.galoisKeys.load({context: this.__Context, encoded})
    return this.galoisKeys
  }

  /**
   * Save a public key as a base64 string
   *
   * @returns {string}
   */
  savePublicKey() {
    return this.publicKey.save()
  }

  /**
   * Save a secret key as a base64 string
   *
   * @returns {string}
   */
  saveSecretKey() {
    return this.secretKey.save()
  }

  /**
   * Save the relin keys as a base64 string
   *
   * @returns {string}
   */
  saveRelinKeys() {
    return this.relinKeys.save()
  }

  /**
   * Save the galois keys as a base64 string
   *
   * @returns {string}
   */
  saveGaloisKeys() {
    return this.galoisKeys.save()
  }

  /**
   * Helper to load a cipherText from a base64 encoded cipherText
   *
   * @param encoded
   * @returns {CipherText}
   */
  loadCipher({encoded}) {
    const cipherText = this.CipherText()
    cipherText.load({context: this.__Context, encoded})
    return cipherText
  }

  /**
   * Return the noise budget from a CipherText
   *
   * @param cipherText
   * @returns {number}
   */
  invariantNoiseBudget({cipherText}) {
    return this.__Decryptor.invariantNoiseBudget({cipherText})
  }
}
