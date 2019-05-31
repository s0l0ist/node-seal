export class HE {
  constructor({options}) {

    // Constructors
    this._CipherText = options.CipherText
    this._PlainText = options.PlainText
    this._PublicKey = options.PublicKey
    this._SecretKey = options.SecretKey
    this._RelinKeys = options.RelinKeys
    this._GaloisKeys = options.GaloisKeys

    // Singletons
    this._BatchEncoder = options.BatchEncoder
    this._CKKSEncoder = options.CKKSEncoder
    this._Context = options.Context
    this._Decryptor = options.Decryptor
    this._DefaultParams = options.DefaultParams
    this._EncryptionParameters = options.EncryptionParameters
    this._Encryptor = options.Encryptor
    this._Evaluator = options.Evaluator
    this._IntegerEncoder = options.IntegerEncoder
    this._KeyGenerator = options.KeyGenerator
    this._Library = options.Library
    this._SchemeType = options.SchemeType
    this._SmallModulus = options.SmallModulus
    this._Vector = options.Vector

    // Instances
    this.publicKey = null
    this.secretKey = null
    this.relinKeys = null
    this.galoisKeys = null

    // Internal helpers
    this._scale = null
    this._polyDegree = null
    this._plainModulus = null
    this._coeffModulus = null
    this._schemeType = null
  }

  set library(m) {
    this._library = m
  }
  get library() {
    return this._library
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
   * @returns {*}
   */
  printVector({vector, printSize = 4, precision = 5, type = 'int32'}) {
    return this._Vector.printVector({vector, printSize, precision, type})
  }

  /**
   * Print a c++ vector as a BFV matrix
   * @param vector
   * @param rowSize
   * @param type
   * @returns {*}
   */
  printMatrix({vector, rowSize = this._BatchEncoder.slotCount() / 2, type = 'int32'}) {
    return this._Vector.printMatrix({vector, rowSize, type})
  }

  /**
   * Convert an array to a c++ vector
   * @param array
   * @param type
   * @returns {*}
   */
  vecFromArray({array, type = 'int32'}) {
    return this._Vector.vecFromArray({array, type})
  }

  /**
   * Set's the CKKS scale global to the maximum value by default
   *
   * The values change depending on the
   * computationLevel and security context
   *
   * @param computationLevel
   * @param security
   * @returns {number}
   * @private
   */
  _setScale({computationLevel, security}) {
    switch (computationLevel) {
      case 'low':
        switch (security) {
          case 128: return Math.pow(2, 55) // max 109 - 54
          case 192: return Math.pow(2, 21) // max 75 - 54
          case 256: return Math.pow(2, 4) // max 58 - 54
          default: break;
        }
        break;
      case 'medium':
        switch (security) {
          case 128: return Math.pow(2, 164) // max 218 - 54
          case 192: return Math.pow(2, 98) // max 152 - 54
          case 256: return Math.pow(2, 64) // max 118 - 54
          default: break;
        }
        break;
      case 'high':
        switch (security) {
          case 128: return Math.pow(2, 384) // max 438 - 54
          case 192: return Math.pow(2, 246) // max 300 - 54
          case 256: return Math.pow(2, 183) // max 237 - 54
          default: break;
        }
        break;
      default: break;
    }
  }
  /**
   * Create a good set of default parameters for the encryption library.
   *
   * The `scale` parameter is only used for the CKKS scheme.
   *
   * @param computationLevel
   * @param security
   * @returns {{plainModulus: number, scale: number, coeffModulus: number, polyDegree: number}}
   */
  createParams({computationLevel = 'low', security = 128} = {}) {
    switch (computationLevel.toLowerCase()) {
      case 'low':
        return {
          polyDegree: 4096,
          coeffModulus: 4096,
          plainModulus: 786433,
          scale: this._setScale({computationLevel, security}),
          security
        }
      case 'medium':
        return {
          polyDegree: 8192,
          coeffModulus: 8192,
          plainModulus: 786433,
          scale: this._setScale({computationLevel, security}),
          security
        }
      case 'high':
        return {
          polyDegree: 16384,
          coeffModulus: 16384,
          plainModulus: 786433,
          scale: this._setScale({computationLevel, security}),
          security
        }
      default:
        return {
          polyDegree: 4096,
          coeffModulus: 4096,
          plainModulus: 786433,
          scale: this._setScale({computationLevel, security}),
          security
        }
    }
  }

  /**
   * Initialize the given Context and Evaluator
   * @private
   */
  _initContext() {
    this._Context.initialize({
      encryptionParams: this._EncryptionParameters.instance,
      expandModChain: true
    })

    this._Evaluator.initialize({
      context: this._Context.instance
    })
  }

  /**
   * Initializes the BFV parameters for the library
   * @param polyDegree
   * @param coeffModulus
   * @param plainModulus
   * @param security
   * @private
   */
  _initBFV({polyDegree, coeffModulus, plainModulus, security}) {
    this._SmallModulus.initialize()
    this._SmallModulus.setValue({value: plainModulus})

    switch (security) {
      case 128:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.BFV,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus128({value: coeffModulus}),
          plainModulus: this._SmallModulus.instance
        }); break;
      case 192:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.BFV,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus192({value: coeffModulus}),
          plainModulus: this._SmallModulus.instance
        }); break;
      case 256:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.BFV,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus256({value: coeffModulus}),
          plainModulus: this._SmallModulus.instance
        }); break;
      default:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.BFV,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus128({value: coeffModulus}),
          plainModulus: this._SmallModulus.instance
        }); break;
    }

    this._initContext()

    this._IntegerEncoder.initialize({
      context: this._Context.instance
    })

    this._BatchEncoder.initialize({
      context: this._Context.instance
    })
  }

  /**
   * Initialize the CKKS parameters for the library
   * @param polyDegree
   * @param coeffModulus
   * @param security
   * @private
   */
  _initCKKS({polyDegree, coeffModulus, security}) {
    switch (security) {
      case 128:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.CKKS,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus128({value: coeffModulus}),
        }); break;
      case 192:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.CKKS,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus192({value: coeffModulus}),
        }); break;
      case 256:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.CKKS,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus256({value: coeffModulus}),
        }); break;
      default:
        this._EncryptionParameters.initialize({
          schemeType: this._SchemeType.CKKS,
          polyDegree: polyDegree,
          coeffModulus: this._DefaultParams.coeffModulus128({value: coeffModulus}),
        }); break;
    }

    this._initContext()

    this._CKKSEncoder.initialize({
      context: this._Context.instance
    })
  }


  /**
   * Initialize the encryption library
   *
   * @param schemeType
   * @param polyDegree
   * @param coeffModulus
   * @param plainModulus
   * @param security
   * @param scale
   */
  initialize({schemeType, polyDegree, coeffModulus, plainModulus, scale, security}) {
    switch (schemeType) {
      case 'BFV': this._initBFV({polyDegree, coeffModulus, plainModulus, security}); break;
      case 'CKKS': this._initCKKS({polyDegree, coeffModulus, security}); break;
      default: this._initBFV({polyDegree, coeffModulus, plainModulus, security});
    }
    this._scale = scale
    this._polyDegree = polyDegree
    this._plainModulus = plainModulus
    this._coeffModulus = coeffModulus
    this._schemeType = schemeType
    this._security = security
  }

  /**
   * Generate the Public and Secret keys to be used for decryption and encryption
   */
  genKeys() {
    this._KeyGenerator.initialize({
      context: this._Context.instance
    })

    if (this.publicKey) {
      delete this.publicKey
    }
    this.publicKey = new this._PublicKey({library: this._Library.instance})
    this.publicKey.inject({instance: this._KeyGenerator.getPublicKey()})

    if (this.secretKey) {
      delete this.secretKey
    }
    this.secretKey = new this._SecretKey({library: this._Library.instance})
    this.secretKey.inject({instance: this._KeyGenerator.getSecretKey()})

    this._Encryptor.initialize({
      context: this._Context.instance,
      publicKey: this.publicKey.instance
    })

    this._Decryptor.initialize({
      context: this._Context.instance,
      secretKey: this.secretKey.instance
    })
  }

  /**
   * Generate the Relinearization Keys to help lower noise after homomorphic operations
   *
   * @param decompositionBitCount
   * @param size - number of relin keys to generate
   */
  genRelinKeys({decompositionBitCount = this._DefaultParams.dbcMax(), size = 1} = {}) {
    this._KeyGenerator.initialize({
      context: this._Context.instance,
      secretKey: this.secretKey ? this.secretKey.instance : null,
      publicKey: this.publicKey ? this.publicKey.instance : null
    })

    if (this.relinKeys) {
      delete this.relinKeys
    }
    this.relinKeys = new this._RelinKeys({library: this._Library.instance})
    this.relinKeys.inject({
      instance: this._KeyGenerator.genRelinKeys({decompositionBitCount, size})
    })
  }

  /**
   * Generate the Galois Keys to perform matrix rotations for vectorized data
   * @param decompositionBitCount
   */
  genGaloisKeys({decompositionBitCount = this._DefaultParams.dbcMax()} = {}) {
    this._KeyGenerator.initialize({
      context: this._Context.instance,
      secretKey: this.secretKey ? this.secretKey.instance : null,
      publicKey: this.publicKey ? this.publicKey.instance : null
    })

    if (this.galoisKeys) {
      delete this.galoisKeys
    }
    this.galoisKeys = new this._GaloisKeys({library: this._Library.instance})
    this.galoisKeys.inject({
      instance: this._KeyGenerator.genGaloisKeys({decompositionBitCount})
    })
  }

  /**
   * Encrypt a value using the BFV scheme
   * @param value
   * @param type
   * @returns {*|CipherText}
   * @private
   */
  _encryptBFV({value, type}) {

    if (value.length > this._polyDegree) {
      throw new Error(`Input array is too large for the 'polyDegree' specified ${this._polyDegree}`)
    }

    const vector = this.vecFromArray({array: [], type})

    /**
     * Each element in the array should not be larger than half of the plainModulus
     *
     * For int32, the limit is -1/2 * `plainModulus` <-> +1/2 * `plainModulus`
     * for uint32, the limit is 0 <-> `plainModulus`
     */
    const isNotValid = value.some(el => {
      if (type === 'int32') {
        return (Math.abs(el) > Math.floor(this._plainModulus / 2))
      }
      if (type === 'uint32') {
        return (el < 0 || el > this._plainModulus)
      }
      return false
    })

    if (isNotValid) {
      if (type === 'int32') {
        throw new Error(`Array element out of range: -1/2 * 'plainModulus' (${this._plainModulus}) <-> +1/2 * 'plainModulus' (${this._plainModulus})`)
      }
      if (type === 'uint32') {
        throw new Error(`Array element out of range: 0 <-> 'plainModulus' (${this._plainModulus})`)
      }
    }

    // TODO: fix this hack for `vecFromArray`
    value.forEach(el => vector.push_back(el))

    const plainText = new this._PlainText({library: this._Library.instance})

    this._BatchEncoder.encode({vector, plainText: plainText.instance, type})

    const cipherText = new this._CipherText({library: this._Library.instance})
    this._Encryptor.encrypt({plainText: plainText.instance, cipherText: cipherText.instance})

    // this.printMatrix({vector, rowSize: vector.size() / 2, type: cipherText.getVectorType()})

    // Store the vector size so that we may filter the array upon decryption
    cipherText.setVectorSize({size: vector.size()})
    cipherText.setVectorType({type})
    cipherText.setSchemeType({scheme: 'BFV'})
    return cipherText
  }

  /**
   * Encrypt a value using the CKKS scheme
   * @param value
   * @param type
   * @returns {*|CipherText}
   * @private
   */
  _encryptCKKS({value, type}) {

    if (value.length > this._polyDegree) {
      throw new Error(`Input array is too large for the 'polyDegree' specified ${this._polyDegree}`)
    }

    const vector = this.vecFromArray({array: [], type})

    /**
     * Each element in the array should not be larger than 2^53 to ensure
     * more reliable decryption. This is due to JS Number limitations.
     *
     * For double, the limit is -2^53 <-> +2^53
     */
    const isNotValid = value.some(el => {
      return (Math.abs(el) > Math.pow(2, 53))
    })

    if (isNotValid) {
      throw new Error('Array element out of range: -2^53 <-> +2^53')
    }

    // TODO: fix this hack for `vecFromArray`
    value.forEach(el => vector.push_back(el))

    const plainText = new this._PlainText({library: this._Library.instance})

    // The CKKSEncoder will implicitly pad the vector
    // with zeros to full size (poly_modulus_degree / 2) when encoding.
    // So we should remember the size.
    this._CKKSEncoder.encode({
      vector,
      scale: this._scale, // Global scale set when creating the context. Can be overridden.
      plainText: plainText.instance,
      type
    })

    const cipherText = new this._CipherText({library: this._Library.instance})
    this._Encryptor.encrypt({plainText: plainText.instance, cipherText: cipherText.instance})

    // Set a few attributes on the
    cipherText.setVectorSize({size: vector.size()})
    cipherText.setVectorType({type})
    cipherText.setSchemeType({scheme: 'CKKS'})
    return cipherText
  }

  /**
   * Encrypt a given value
   * @param value
   * @param type?
   * @returns {*|CipherText}
   */
  encrypt({value, type = null}) {

    // determine the array type automatically
    let array;

    // Set the type flag
    let detectedType;

    // ensure we have a Typed or JS Array
    switch (value.constructor) {
      case Int32Array: array = value; detectedType = 'int32'; break
      case Uint32Array: array = value; detectedType = 'uint32'; break
      case Float64Array: array = value; detectedType = 'double'; break
      case Array: array = value; detectedType = type; break
      default: array = [value]; detectedType = type; break
    }

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
      throw new Error(`Cannot encrypt elements with values greater than 'Number.MAX_SAFE_INTEGER' (${Number.MAX_SAFE_INTEGER})`)
    }
    if (array.some(x => x < Number.MIN_SAFE_INTEGER)) {
      throw new Error(`Cannot encrypt elements with values less than 'Number.MIN_SAFE_INTEGER' (${Number.MIN_SAFE_INTEGER})`)
    }


    /**
     * Now, determine type for generic JS Array
     *
     * If the user specified a type, this will not execute and the user is
     * responsible for understanding the type of data that will be encrypted
     */
    if (!detectedType) {
      detectedType = 'double' // by default

      if (array.every(x => Number.isInteger(x) && x >= -(Math.pow(2, 31)) && x <= (Math.pow(2, 31) - 1))) {
        // Convert to TypedArray
        array = Int32Array.from(array)
        detectedType = 'int32'
      }

      if (array.every(x => Number.isInteger(x) && x >= 0 && x <= (Math.pow(2, 31) - 1))) {
        // Convert to TypedArray
        array = Uint32Array.from(array)
        detectedType = 'uint32'
      }
    }

    /**
     * If we had an integer passed in with a hint, construct typed array
     */
    if (typeof(value) === 'number' && detectedType && detectedType === 'int32' ) {
      array = Int32Array.from(array)
    }
    if (typeof(value) === 'number' && detectedType && detectedType === 'uint32' ) {
      array = Uint32Array.from(array)
    }

    /**
     * Detect validity of schemeType with element types
     */
    if ((this._schemeType === 'BFV') && !((detectedType === 'int32') || (detectedType === 'uint32'))) {
      throw new Error(`Invalid mix of schemeType '${this._schemeType}' and element type '${detectedType}'.`)
    }

    if ((this._schemeType === 'CKKS') && (detectedType !== 'double')) {
      throw new Error(`Invalid mix of schemeType '${this._schemeType}' and element type '${detectedType}'.`)
    }

    switch (this._schemeType) {
      case 'BFV': return this._encryptBFV({value: array, type: detectedType})
      case 'CKKS': return this._encryptCKKS({value: array, type: detectedType})
      default: return this._encryptBFV({value: array, type: detectedType})
    }
  }

  /**
   * Decrypt a ciphertext using the BFV scheme
   * @param cipherText
   * @returns {Int32Array|Uint32Array|Float64Array|Array}
   * @private
   */
  _decryptBFV({cipherText}) {
    // const plainText = new this._PlainText({library: this._Library.instance})
    // this._Decryptor.decrypt({cipherText: cipherText.instance, plainText: plainText.instance})
    // return this._IntegerEncoder.decodeInt32({plainText: plainText.instance})
    const vector = this.vecFromArray({array: [], type: cipherText.getVectorType()})
    const plainText = new this._PlainText({library: this._Library.instance})

    this._Decryptor.decrypt({cipherText: cipherText.instance, plainText: plainText.instance})
    this._BatchEncoder.decode({plainText: plainText.instance, vector, type: cipherText.getVectorType()})

    // We trim back the vector to the original size that was recorded before encryption was performed
    vector.resize(cipherText.getVectorSize(), 0)

    // this.printVector({vector})
    // this.printMatrix({vector, rowSize: vector.size() / 2, type: cipherText.getVectorType()})

    const array = this._vecToArray({vector, type: cipherText.getVectorType()})

    switch (cipherText.getVectorType()) {
      case 'int32': return Int32Array.from(array)
      case 'uint32': return Uint32Array.from(array)
      case 'double': return Float64Array.from(array)
      default: return array
    }
  }

  /**
   * Decrypt a ciphertext using the CKKS scheme
   * @param cipherText
   * @returns {Int32Array|Uint32Array|Float64Array|Array}
   * @private
   */
  _decryptCKKS({cipherText}) {

    const vector = this.vecFromArray({array: [], type: cipherText.getVectorType()})
    const plainText = new this._PlainText({library: this._Library.instance})

    this._Decryptor.decrypt({cipherText: cipherText.instance, plainText: plainText.instance})
    this._CKKSEncoder.decode({plainText: plainText.instance, vector, type: cipherText.getVectorType()})

    // We trim back the vector to the original size that was recorded before encryption was performed
    vector.resize(cipherText.getVectorSize(), 0)

    // this.printVector({vector, type: cipherText.getVectorType()})

    const array = this._vecToArray({vector, type: cipherText.getVectorType()})

    switch (cipherText.getVectorType()) {
      case 'int32': return Int32Array.from(array)
      case 'uint32': return Uint32Array.from(array)
      case 'double': return Float64Array.from(array)
      default: return array
    }
  }

  /**
   * Copy a vector's data into a Typed or regular JS array
   * @param vector
   * @param type
   * @returns {Int32Array|Uint32Array|Float64Array|Array}
   * @private
   */
  _vecToArray({vector, type}) {
    switch (type) {
      case 'int32':
        const int32Array = new Int32Array(vector.size())
        // retrieve value from the vector
        for (let i = 0; i < vector.size(); i++) {
          int32Array[i] = vector.get(i)
        }
        return int32Array
      case 'uint32':
        const uint32Array = new Uint32Array(vector.size())
        // retrieve value from the vector
        for (let i = 0; i < vector.size(); i++) {
          uint32Array[i] = vector.get(i)
        }
        return uint32Array
      case 'double':
        const float64Array = new Float64Array(vector.size())
        // retrieve value from the vector
        for (let i = 0; i < vector.size(); i++) {
          float64Array[i] = vector.get(i)
        }
        return float64Array
      default:
        const array = []
        for (let i = 0; i < vector.size(); i++) {
          array[i] = vector.get(i)
        }
        return array
    }
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
    const destination = new this._CipherText({library: this._Library.instance})
    this._Evaluator.add({encrypted: cipherText.instance, destination: destination.instance})

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

    const destination = new this._CipherText({library: this._Library.instance})
    this._Evaluator.add({a: a.instance, b: b.instance, destination: destination.instance})

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

    const destination = new this._CipherText({library: this._Library.instance})
    this._Evaluator.sub({a: a.instance, b: b.instance, destination: destination.instance})

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

    const destination = new this._CipherText({library: this._Library.instance})
    this._Evaluator.multiply({a: a.instance, b: b.instance, destination: destination.instance})

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

    const destination = new this._CipherText({library: this._Library.instance})
    this._Evaluator.square({encrypted: cipherText.instance, destination: destination.instance})

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

    const destination = new this._CipherText({library: this._Library.instance})
    this._Evaluator.relinearize({encrypted: cipherText.instance, relinKeys: relinKeys.instance, destination: destination.instance})

    // Set the parameters based off of cipher 'a'
    destination.setVectorSize({size: cipherText.getVectorSize()})
    destination.setVectorType({type: cipherText.getVectorType()})
    destination.setSchemeType({scheme: cipherText.getSchemeType()})
    return destination
  }

  /**
   * Load a public key to be used for encryption
   * @param encoded
   */
  loadPublicKey({encoded}) {
    if (this.publicKey) {
      delete this.publicKey
    }

    this.publicKey = new this._PublicKey({library: this._Library.instance})
    this.publicKey.load({context: this._Context.instance, encoded})

    this._Encryptor.initialize({
      context: this._Context.instance,
      publicKey: this.publicKey.instance
    })
  }

  /**
   * Load a secret key to be used for encryption
   * @param encoded
   */
  loadSecretKey({encoded}) {
    if (this.secretKey) {
      delete this.secretKey
    }

    this.secretKey = new this._SecretKey({library: this._Library.instance})
    this.secretKey.load({context: this._Context.instance, encoded})

    this._Decryptor.initialize({
      context: this._Context.instance,
      secretKey: this.secretKey.instance
    })
  }

  /**
   * Load the relin keys to be used to reduce noise after HE operations
   * @param encoded
   */
  loadRelinKeys({encoded}) {
    if (this.relinKeys) {
      delete this.relinKeys
    }

    this.relinKeys = new this._RelinKeys({library: this._Library.instance})
    this.relinKeys.load({context: this._Context.instance, encoded})
  }

  /**
   * Load the galois keys to perform matrix rotations
   * @param encoded
   */
  loadGaloisKeys({encoded}) {
    if (this.galoisKeys) {
      delete this.galoisKeys
    }

    this.galoisKeys = new this._GaloisKeys({library: this._Library.instance})
    this.galoisKeys.load({context: this._Context.instance, encoded})
  }

  /**
   * Save a public key as a base64 string
   * @returns {string}
   */
  savePublicKey() {
    return this.publicKey.save()
  }

  /**
   * Save a secret key as a base64 string
   * @returns {string}
   */
  saveSecretKey() {
    return this.secretKey.save()
  }

  /**
   * Save the relin keys as a base64 string
   * @returns {string}
   */
  saveRelinKeys() {
    return this.relinKeys.save()
  }

  /**
   * Save the galois keys as a base64 string
   * @returns {string}
   */
  saveGaloisKeys() {
    return this.galoisKeys.save()
  }

  /**
   * Helper to revitalize a cipherText from a base64 encoded cipherText
   * @param encoded
   * @returns {*|CipherText}
   */
  reviveCipher({encoded}) {
    const cipherText = new this._CipherText({library: this._Library.instance})
    cipherText.load({context: this._Context.instance, encoded})
    return cipherText
  }
}
