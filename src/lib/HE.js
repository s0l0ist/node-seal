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
  printMatrix({vector, rowSize, type = 'int32'}) {
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
   * Create a good set of default parameters for the encryption library.
   *
   * The `scale` parameter is only used for the CKKS scheme.
   *
   * @param computationLevel
   * @param security
   * @returns {{plainModulus: number, scale: number, coeffModulus: number, polyDegree: number}}
   */
  createParams({computationLevel = 'low', security = 128, } = {}) {
    switch (computationLevel.toLowerCase()) {
      case 'low':
        return {
          polyDegree: 4096,
          coeffModulus: 4096,
          plainModulus: 786433,
          scale: Math.pow(2, 54), // max 109 - 55
          security
        }
      case 'medium':
        return {
          polyDegree: 8192,
          coeffModulus: 8192,
          plainModulus: 786433,
          scale: Math.pow(2, 163), // max 218 - 55
          security
        }
      case 'high':
        return {
          polyDegree: 16384,
          coeffModulus: 16384,
          plainModulus: 786433,
          scale: Math.pow(2, 383), // max 438 - 55
          security
        }
      default:
        return {
          polyDegree: 4096,
          coeffModulus: 4096,
          plainModulus: 786433,
          scale: Math.pow(2, 54), // max 109 - 55
          security
        }
    }
  }

  /**
   * Initialized the given context
   * @private
   */
  _initContext() {
    this._Context.initialize({
      encryptionParams: this._EncryptionParameters.instance,
      expandModChain: true
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
    const vector = this.vecFromArray({array: [], type})

    const array = Array.isArray(value)? value: [value]
    if (array.length > this._polyDegree) {
      throw new Error('Input array is too large for the `polyDegree` specified')
    }

    /**
     * Each element in the array should not be larger than half of the plainModulus
     *
     * For int32, the limit is -1/2 * `plainModulus` <-> +1/2 * `plainModulus`
     * for uint32, the limit is 0 <-> `plainModulus`
     */
    const isNotValid = array.some(el => {
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
        throw new Error('Array element out of range: -1/2 * `plainModulus` <-> +1/2 * `plainModulus`')
      }
      if (type === 'uint32') {
        throw new Error('Array element out of range: 0 <-> `plainModulus`')
      }
    }

    // TODO: fix this hack for `vecFromArray`
    array.forEach(el => vector.push_back(el))

    const plainText = new this._PlainText({library: this._Library.instance})

    // console.log('encoding...')
    this._BatchEncoder.encode({vector, plainText: plainText.instance, type})
    // console.log('encoding...done!')

    const cipherText = new this._CipherText({library: this._Library.instance})
    // console.log('encrypting...')
    this._Encryptor.encrypt({plainText: plainText.instance, cipherText: cipherText.instance})
    // console.log('encrypting...done!')

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
    const vector = this.vecFromArray({array: [], type})

    const array = Array.isArray(value)? value: [value]
    if (array.length > this._polyDegree) {
      throw new Error('Input array is too large for the `polyDegree` specified')
    }

    /**
     * Each element in the array should not be larger than 2^53 to ensure
     * more reliable decryption. This is due to JS Number limitations.
     *
     * For double, the limit is -2^53 <-> +2^53
     */
    const isNotValid = array.some(el => {
      return (Math.abs(el) > Math.pow(2, 53))
    })

    if (isNotValid) {
      throw new Error('Array element out of range: -2^53 <-> +2^53')
    }

    // TODO: fix this hack for `vecFromArray`
    array.forEach(el => vector.push_back(el))

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
    cipherText.setSchemeType({scheme: 'BFV'})
    return cipherText
  }

  /**
   * Encrypt a given value
   * @param value
   * @returns {*|CipherText}
   */
  encrypt({value, type}) {
    switch (this._schemeType) {
      case 'BFV': return this._encryptBFV({value, type})
      case 'CKKS': return this._encryptCKKS({value, type})
      default: return this._encryptBFV({value, type})
    }
  }

  /**
   * Decrypt a ciphertext using the BFV scheme
   * @param cipherText
   * @returns {Int32Array|Uint32Array|BigInt64Array|BigUint64Array|Float64Array|Array}
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

    // this.printVector({vector, type: cipherText.getVectorType()})
    // this.printMatrix({vector, rowSize: this._BatchEncoder.slotCount() / 2, type: cipherText.getVectorType()})

    return this._vecToArray({vector, type: cipherText.getVectorType()})
  }

  /**
   * Decrypt a ciphertext using the CKKS scheme
   * @param cipherText
   * @returns {Int32Array|Uint32Array|BigInt64Array|BigUint64Array|Float64Array|Array}
   * @private
   */
  _decryptCKKS({cipherText}) {

    const vector = this.vecFromArray({array: [], type: cipherText.getVectorType()})
    const plainText = new this._PlainText({library: this._Library.instance})

    this._Decryptor.decrypt({cipherText: cipherText.instance, plainText: plainText.instance})
    this._CKKSEncoder.decode({plainText: plainText.instance, vector, type: cipherText.getVectorType()})

    // We trim back the vector to the original size that was recorded before encryption was performed
    vector.resize(cipherText.getVectorSize(), 0)

    this.printVector({vector, type: cipherText.getVectorType()})

    return this._vecToArray({vector, type: cipherText.getVectorType()})
  }

  /**
   * Copy a vector's data into a Typed or regular JS array
   * @param vector
   * @param type
   * @returns {Int32Array|Uint32Array|BigInt64Array|BigUint64Array|Float64Array|Array}
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
      case 'int64':
        const int64Array = new BigInt64Array(vector.size())
        // retrieve value from the vector
        for (let i = 0; i < vector.size(); i++) {
          int64Array[i] = vector.get(i)
        }
        return int64Array
      case 'uint64':
        const uint64Array = new BigUint64Array(vector.size())
        // retrieve value from the vector
        for (let i = 0; i < vector.size(); i++) {
          uint64Array[i] = vector.get(i)
        }
        return uint64Array
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
   * @returns {Int32Array|Uint32Array|BigInt64Array|BigUint64Array|Float64Array|Array}
   */
  decrypt({cipherText}) {
    switch (this._schemeType) {
      case 'BFV': return this._decryptBFV({cipherText})
      case 'CKKS': return this._decryptCKKS({cipherText})
      default: return this._decryptBFV({cipherText})
    }
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
}
