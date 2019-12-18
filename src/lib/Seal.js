export const SEAL = ({ options }) => {
  const _BatchEncoder = options.BatchEncoder
  const _CipherText = options.CipherText
  const _CKKSEncoder = options.CKKSEncoder
  const _Context = options.Context
  const _Decryptor = options.Decryptor
  const _EncryptionParameters = options.EncryptionParameters
  const _Encryptor = options.Encryptor
  const _Evaluator = options.Evaluator
  const _GaloisKeys = options.GaloisKeys
  const _IntegerEncoder = options.IntegerEncoder
  const _KeyGenerator = options.KeyGenerator
  const _Library = options.Library
  const _PlainText = options.PlainText
  const _PublicKey = options.PublicKey
  const _RelinKeys = options.RelinKeys
  const _SecretKey = options.SecretKey
  const _SmallModulus = options.SmallModulus
  const _Vector = options.Vector

  // Singletons
  const _CoeffModulus = options.CoeffModulus({ library: _Library.instance })
  const _ComprModeType = options.ComprModeType({ library: _Library.instance })
  const _Exception = options.Exception({ library: _Library.instance })
  const _MemoryPoolHandle = options.MemoryPoolHandle({
    library: _Library.instance
  })
  const _PlainModulus = options.PlainModulus({ library: _Library.instance })
  const _SecurityLevel = options.SecurityLevel({ library: _Library.instance })
  const _SchemeType = options.SchemeType({ library: _Library.instance })

  return {
    /**
     * Create an instance of a BatchEncoder
     *
     * @param context
     * @returns {BatchEncoder}
     * @constructor
     */
    BatchEncoder({ context }) {
      return _BatchEncoder({ library: _Library.instance, context })
    },

    /**
     * Create an instance of a CipherText
     *
     * @returns {CipherText}
     * @constructor
     */
    CipherText() {
      return _CipherText({ library: _Library.instance })
    },

    /**
     * Create an instance of a CKKSEncoder
     *
     * @param context
     * @returns {CKKSEncoder}
     * @constructor
     */
    CKKSEncoder({ context }) {
      return _CKKSEncoder({ library: _Library.instance, context })
    },

    /**
     * Get the CoeffModulus singleton instance
     *
     * @returns {CoeffModulus}
     */
    get CoeffModulus() {
      return _CoeffModulus
    },

    /**
     * Get the ComprModeType singleton instance
     *
     * @returns {ComprModeType}
     * @constructor
     */
    get ComprModeType() {
      return _ComprModeType
    },

    /**
     * Create an instance of a Context
     *
     * @param encryptionParams
     * @param expandModChain
     * @param securityLevel
     * @returns {Context}
     * @constructor
     */
    Context({ encryptionParams, expandModChain, securityLevel }) {
      return _Context({
        library: _Library.instance,
        encryptionParams,
        expandModChain,
        securityLevel
      })
    },

    /**
     * Create an instance of a Decryptor
     *
     * @param context
     * @param secretKey
     * @returns {Decryptor}
     * @constructor
     */
    Decryptor({ context, secretKey }) {
      return _Decryptor({ library: _Library.instance, context, secretKey })
    },

    /**
     * Create an instance of EncryptionParameters
     *
     * @param schemeType
     * @returns {EncryptionParameters}
     * @constructor
     */
    EncryptionParameters({ schemeType }) {
      return _EncryptionParameters({ library: _Library.instance, schemeType })
    },

    /**
     * Create an instance of an Encryptor
     *
     * @param context
     * @param publicKey
     * @returns {Encryptor}
     * @constructor
     */
    Encryptor({ context, publicKey }) {
      return _Encryptor({ library: _Library.instance, context, publicKey })
    },

    /**
     * Create an instance of an Evaluator
     *
     * @param context
     * @returns {Evaluator}
     * @constructor
     */
    Evaluator({ context }) {
      return _Evaluator({ library: _Library.instance, context })
    },

    /**
     * Get the Exception singleton instance
     *
     * @returns {Exception}
     * @constructor
     */
    get Exception() {
      return _Exception
    },

    /**
     * Create an instance of GaloisKeys
     *
     * Requires a
     *
     * @returns {GaloisKeys}
     * @constructor
     */
    GaloisKeys() {
      return _GaloisKeys({ library: _Library.instance })
    },

    /**
     *
     * Create an instance of an IntegerEncoder
     *
     * @param context
     * @returns {IntegerEncoder}
     * @constructor
     */
    IntegerEncoder({ context }) {
      return _IntegerEncoder({ library: _Library.instance, context })
    },

    /**
     * Create an instance of a KeyGenerator
     *
     * @param context
     * @param secretKey
     * @param publicKey
     * @returns {KeyGenerator}
     * @constructor
     */
    KeyGenerator({ context, secretKey = null, publicKey = null }) {
      return _KeyGenerator({
        library: _Library.instance,
        context,
        secretKey,
        publicKey
      })
    },

    /**
     * Get the MemoryPool singleton instance
     *
     * @returns {MemoryPoolHandle}
     * @constructor
     */
    get MemoryPoolHandle() {
      return _MemoryPoolHandle
    },

    /**
     * Get the PlainModulus singleton instance
     *
     * @returns {PlainModulus}
     * @constructor
     */
    get PlainModulus() {
      return _PlainModulus
    },

    /**
     * Create an instance of a PlainText
     *
     * @returns {PlainText}
     * @constructor
     */
    PlainText() {
      return _PlainText({ library: _Library.instance })
    },

    /**
     * Create an instance of a PublicKey
     *
     * @returns {PublicKey}
     * @constructor
     */
    PublicKey() {
      return _PublicKey({ library: _Library.instance })
    },

    /**
     * Create an instance of a RelinKeys
     *
     * @returns {RelinKeys}
     * @constructor
     */
    RelinKeys() {
      return _RelinKeys({ library: _Library.instance })
    },

    /**
     * Get the SchemeType singleton instance
     *
     * @returns {SchemeType}
     * @constructor
     */
    get SchemeType() {
      return _SchemeType
    },

    /**
     * Create an instance of a SecretKey
     *
     * @returns {SecretKey}
     * @constructor
     */
    SecretKey() {
      return _SecretKey({ library: _Library.instance })
    },

    /**
     * Get the SecurityLevel singleton instance
     *
     * @returns {SecurityLevel}
     * @constructor
     */
    get SecurityLevel() {
      return _SecurityLevel
    },

    /**
     * Create an instance of a SmallModulus
     *
     * @returns {SmallModulus}
     * @constructor
     */
    SmallModulus() {
      return _SmallModulus({ library: _Library.instance })
    },

    /**
     * Create an instance of a C++ Vector
     *
     * @param {Object} opts - Options
     * @param {Int32Array|Uint32Array|Float64Array} opts.array - Typed Array of data
     * @returns {Vector} - Vector containing the typed data
     * @constructor
     */
    Vector({ array }) {
      return _Vector({ library: _Library.instance, array })
    }
  }
}
