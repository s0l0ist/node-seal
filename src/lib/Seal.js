/**
 * Microsoft SEAL
 *
 * @param {Object} options Options
 * @param {BatchEncoder} options.BatchEncoder
 * @param {CipherText} options.CipherText
 * @param {CKKSEncoder} options.CKKSEncoder
 * @param {Context} options.Context
 * @param {Decryptor} options.Decryptor
 * @param {EncryptionParameters} options.EncryptionParameters
 * @param {Encryptor} options.Encryptor
 * @param {Evaluator} options.Evaluator
 * @param {GaloisKeys} options.GaloisKeys
 * @param {IntegerEncoder} options.IntegerEncoder
 * @param {KeyGenerator} options.KeyGenerator
 * @param {Library} options.Library - SEAL wasm library
 * @param {PlainText} options.PlainText
 * @param {PublicKey} options.PublicKey
 * @param {RelinKeys} options.RelinKeys
 * @param {SecretKey} options.SecretKey
 * @param {SmallModulus} options.SmallModulus
 * @param {Vector} options.Vector
 * @param {CoeffModulus} options.CoeffModulus
 * @param {ComprModeType} options.ComprModeType
 * @param {Exception} options.Exception
 * @param {MemoryPoolHandle} options.MemoryPoolHandle
 * @param {PlainModulus} options.PlainModulus
 * @param {SecurityLevel} options.SecurityLevel
 * @param {SchemeType} options.SchemeType
 * @constructor
 */
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
  const _ComprModeType = options.ComprModeType({
    library: _Library.instance
  })
  const _Exception = options.Exception({ library: _Library.instance })
  const _MemoryPoolHandle = options.MemoryPoolHandle({
    library: _Library.instance
  })
  const _PlainModulus = options.PlainModulus({ library: _Library.instance })
  const _SecurityLevel = options.SecurityLevel({
    library: _Library.instance
  })
  const _SchemeType = options.SchemeType({ library: _Library.instance })

  return {
    /**
     * Create an instance of a BatchEncoder
     *
     * Provides functionality for CRT batching. If the polynomial modulus degree is N, and
     * the plaintext modulus is a prime number T such that T is congruent to 1 modulo 2N,
     * then BatchEncoder allows the plaintext elements to be viewed as 2-by-(N/2)
     * matrices of integers modulo T. Homomorphic operations performed on such encrypted
     * matrices are applied coefficient (slot) wise, enabling powerful SIMD functionality
     * for computations that are vectorizable. This functionality is often called "batching"
     * in the homomorphic encryption literature.
     *
     * @par Mathematical Background
     * Mathematically speaking, if the polynomial modulus is X^N+1, N is a power of two, and
     * plain_modulus is a prime number T such that 2N divides T-1, then integers modulo T
     * contain a primitive 2N-th root of unity and the polynomial X^N+1 splits into n distinct
     * linear factors as X^N+1 = (X-a_1)*...*(X-a_N) mod T, where the constants a_1, ..., a_n
     * are all the distinct primitive 2N-th roots of unity in integers modulo T. The Chinese
     * Remainder Theorem (CRT) states that the plaintext space Z_T[X]/(X^N+1) in this case is
     * isomorphic (as an algebra) to the N-fold direct product of fields Z_T. The isomorphism
     * is easy to compute explicitly in both directions, which is what this class does.
     * Furthermore, the Galois group of the extension is (Z/2NZ)* ~= Z/2Z x Z/(N/2) whose
     * action on the primitive roots of unity is easy to describe. Since the batching slots
     * correspond 1-to-1 to the primitive roots of unity, applying Galois automorphisms on the
     * plaintext act by permuting the slots. By applying generators of the two cyclic
     * subgroups of the Galois group, we can effectively view the plaintext as a 2-by-(N/2)
     * matrix, and enable cyclic row rotations, and column rotations (row swaps).
     *
     * @par Valid Parameters
     * Whether batching can be used depends on whether the plaintext modulus has been chosen
     * appropriately. Thus, to construct a BatchEncoder the user must provide an instance
     * of SEALContext such that its associated EncryptionParameterQualifiers object has the
     * flags parameters_set and enable_batching set to true.
     *
     * @typedef {Object} BatchEncoder
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @property {function} encodeVectorInt32 Encodes a Vector of Int32 types to a PlainText
     * @property {function} encodeVectorUInt32 Encodes a Vector of UInt32 types to a PlainText
     * @property {function} decodeVectorInt32 Decodes a PlainText to a Vector of Int32
     * @property {function} decodeVectorUInt32 Decodes a PlainText to a Vector of UInt32
     * @property {getter} slotCount Getter for the total number of batching slots available to hold data
     * @returns {BatchEncoder} A 'batching' encoder used for the BFV scheme type
     * @constructor
     */
    BatchEncoder({ context }) {
      return _BatchEncoder({ library: _Library.instance, context })
    },

    /**
     * Create an instance of a CipherText
     *
     * Class to store a ciphertext element. The data for a ciphertext consists
     * of two or more polynomials, which are in Microsoft SEAL stored in a CRT
     * form with respect to the factors of the coefficient modulus. This data
     * itself is not meant to be modified directly by the user, but is instead
     * operated on by functions in the Evaluator class. The size of the backing
     * array of a ciphertext depends on the encryption parameters and the size
     * of the ciphertext (at least 2). If the poly_modulus_degree encryption
     * parameter is N, and the number of primes in the coeff_modulus encryption
     * parameter is K, then the ciphertext backing array requires precisely
     * 8*N*K*size bytes of memory. A ciphertext also carries with it the
     * parms_id of its associated encryption parameters, which is used to check
     * the validity of the ciphertext for homomorphic operations and decryption.
     *
     * @par Memory Management
     * The size of a ciphertext refers to the number of polynomials it contains,
     * whereas its capacity refers to the number of polynomials that fit in the
     * current memory allocation. In high-performance applications unnecessary
     * re-allocations should be avoided by reserving enough memory for the
     * ciphertext to begin with either by providing the desired capacity to the
     * constructor as an extra argument, or by calling the reserve function at
     * any time.
     *
     * @par Thread Safety
     * In general, reading from ciphertext is thread-safe as long as no other
     * thread is concurrently mutating it. This is due to the underlying data
     * structure storing the ciphertext not being thread-safe.
     *
     * @typedef {Object} CipherText
     * @property {getter} coeffModCount Getter for the number of primes in the coefficient modulus
     * @property {getter} polyModulusDegree Getter for the degree of the polynomial modulus
     * @property {getter} size Getter for the size of the ciphertext
     * @property {getter} sizeCapacity Getter for the capacity of the allocation
     * @property {getter} isTransparent Getter for whether the current ciphertext is transparent
     * @property {getter} isNttForm Getter for whether the ciphertext is in NTT form
     * @property {getter} parmsId Getter for a reference to parmsId
     * @property {getter} scale Getter for a reference to the scale
     * @property {getter} pool Getter for the currently used MemoryPoolHandle
     * @property {function} save Save a cipherText to a base64 string
     * @property {function} load Load a cipherText from a base64 string
     * @returns {CipherText} An empty CipherText instance
     * @constructor
     */
    CipherText() {
      return _CipherText({ library: _Library.instance })
    },

    /**
     * Create an instance of a CKKSEncoder
     *
     * Provides functionality for encoding vectors of complex or real numbers into
     * plaintext polynomials to be encrypted and computed on using the CKKS scheme.
     * If the polynomial modulus degree is N, then CKKSEncoder converts vectors of
     * N/2 complex numbers into plaintext elements. Homomorphic operations performed
     * on such encrypted vectors are applied coefficient (slot-)wise, enabling
     * powerful SIMD functionality for computations that are vectorizable. This
     * functionality is often called "batching" in the homomorphic encryption
     * literature.
     *
     * @par Mathematical Background
     * Mathematically speaking, if the polynomial modulus is X^N+1, N is a power of
     * two, the CKKSEncoder implements an approximation of the canonical embedding
     * of the ring of integers Z[X]/(X^N+1) into C^(N/2), where C denotes the complex
     * numbers. The Galois group of the extension is (Z/2NZ)* ~= Z/2Z x Z/(N/2)
     * whose action on the primitive roots of unity modulo coeff_modulus is easy to
     * describe. Since the batching slots correspond 1-to-1 to the primitive roots
     * of unity, applying Galois automorphisms on the plaintext acts by permuting
     * the slots. By applying generators of the two cyclic subgroups of the Galois
     * group, we can effectively enable cyclic rotations and complex conjugations
     * of the encrypted complex vectors.
     *
     * @typedef {Object} CKKSEncoder
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @property {function} encodeVectorDouble Encodes a Vector of Float64 types to a PlainText
     * @property {function} decodeVectorDouble Decodes a PlainText to a Vector of Float64
     * @property {getter} slotCount Getter to returns the total number of CKKS slots available to hold data
     * @returns {CKKSEncoder} An encoder used for the CKKS scheme type
     * @constructor
     */
    CKKSEncoder({ context }) {
      return _CKKSEncoder({ library: _Library.instance, context })
    },

    /**
     * CoeffModulus
     *
     * This class contains static methods for creating a coefficient modulus easily.
     * Note that while these functions take a sec_level_type argument, all security
     * guarantees are lost if the output is used with encryption parameters with
     * a mismatching value for the poly_modulus_degree.
     *
     * The default value sec_level_type::tc128 provides a very high level of security
     * and is the default security level enforced by Microsoft SEAL when constructing
     * a SEALContext object. Normal users should not have to specify the security
     * level explicitly anywhere.
     *
     * @typedef {Object} CoeffModulus
     * @property {function} MaxBitCount Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel
     * @property {function} BFVDefault Returns a default vector of primes for the BFV CoeffModulus parameter
     * @property {function} Create Creates a vector of primes for a given polyModulusDegree and bitSizes
     * @returns {CoeffModulus} The CoeffModulus singleton
     */
    get CoeffModulus() {
      return _CoeffModulus
    },

    /**
     * ComprModeType
     *
     * A type to describe the compression algorithm applied to serialized data.
     * Ciphertext and key data consist of a large number of 64-bit words storing
     * integers modulo prime numbers much smaller than the word size, resulting in
     * a large number of zero bytes in the output. Any compression algorithm should
     * be able to clean up these zero bytes and hence compress both ciphertext and
     * key data.
     *
     * @typedef {Object} ComprModeType
     * @property {getter} none - Getter for the compression mode 'none'
     * @property {getter} deflate - Getter for the compression mode 'deflate'
     * @returns {ComprModeType} - The ComprModeType singleton
     */
    get ComprModeType() {
      return _ComprModeType
    },

    /**
     * Create an instance of a Context
     *
     * Performs sanity checks (validation) and pre-computations for a given set of encryption
     * parameters. While the EncryptionParameters class is intended to be a light-weight class
     * to store the encryption parameters, the SEALContext class is a heavy-weight class that
     * is constructed from a given set of encryption parameters. It validates the parameters
     * for correctness, evaluates their properties, and performs and stores the results of
     * several costly pre-computations.
     *
     * After the user has set at least the poly_modulus, coeff_modulus, and plain_modulus
     * parameters in a given EncryptionParameters instance, the parameters can be validated
     * for correctness and functionality by constructing an instance of SEALContext. The
     * constructor of SEALContext does all of its work automatically, and concludes by
     * constructing and storing an instance of the EncryptionParameterQualifiers class, with
     * its flags set according to the properties of the given parameters. If the created
     * instance of EncryptionParameterQualifiers has the parameters_set flag set to true, the
     * given parameter set has been deemed valid and is ready to be used. If the parameters
     * were for some reason not appropriately set, the parameters_set flag will be false,
     * and a SEALContext will have to be created after the parameters are corrected.
     *
     * By default, SEALContext creates a chain of SEALContext::ContextData instances. The
     * first one in the chain corresponds to special encryption parameters that are reserved
     * to be used by the various key classes (SecretKey, PublicKey, etc.). These are the exact
     * same encryption parameters that are created by the user and passed to th constructor of
     * SEALContext. The functions key_context_data() and key_parms_id() return the ContextData
     * and the parms_id corresponding to these special parameters. The rest of the ContextData
     * instances in the chain correspond to encryption parameters that are derived from the
     * first encryption parameters by always removing the last one of the moduli in the
     * coeff_modulus, until the resulting parameters are no longer valid, e.g., there are no
     * more primes left. These derived encryption parameters are used by ciphertexts and
     * plaintexts and their respective ContextData can be accessed through the
     * get_context_data(parms_id_type) function. The functions first_context_data() and
     * last_context_data() return the ContextData corresponding to the first and the last
     * set of parameters in the "data" part of the chain, i.e., the second and the last element
     * in the full chain. The chain itself is a doubly linked list, and is referred to as the
     * modulus switching chain.
     *
     * @typedef {Object} Context
     * @param {Object} options Options
     * @param {EncryptionParameters} options.encryptionParams A set of specific encryption parameters
     * @param {boolean} options.expandModChain Determines whether or not to enable modulus switching
     * @param {SecurityLevel} options.securityLevel The security strength in bits.
     * @property {getter} keyContextData Getter for the ContextData corresponding to encryption parameters that are used for keys
     * @property {getter} firstContextData Getter for the ContextData corresponding to the first encryption parameters that are used for data
     * @property {getter} lastContextData Getter for the ContextData corresponding to the last encryption parameters that are used for data
     * @property {getter} parametersSet Getter for if the encryption parameters are set in a way that is considered valid by Microsoft SEAL
     * @property {getter} keyParmsId Getter for a parmsIdType corresponding to the set of encryption parameters that are used for keys
     * @property {getter} firstParmsId Getter for a parmsIdType corresponding to the first encryption parameters that are used for data
     * @property {getter} lastParmsId Getter for a parmsIdType corresponding to the last encryption parameters that are used for data
     * @property {getter} usingKeyswitching Getter for whether the coefficient modulus supports keyswitching
     * @property {function} print Prints the context parameters to STDOUT (console.log)
     * @property {function} getContextData Returns the ContextData corresponding to encryption parameters with a given parmsId
     * @returns {Context} - An encryption context to be used for all operations
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
     * Decrypts Ciphertext objects into Plaintext objects. Constructing a Decryptor
     * requires a SEALContext with valid encryption parameters, and the secret key.
     * The Decryptor is also used to compute the invariant noise budget in a given
     * ciphertext.
     *
     * @par Overloads
     * For the decrypt function we provide two overloads concerning the memory pool
     * used in allocations needed during the operation. In one overload the global
     * memory pool is used for this purpose, and in another overload the user can
     * supply a MemoryPoolHandle to be used instead. This is to allow one single
     * Decryptor to be used concurrently by several threads without running into
     * thread contention in allocations taking place during operations. For example,
     * one can share one single Decryptor across any number of threads, but in each
     * thread call the decrypt function by giving it a thread-local MemoryPoolHandle
     * to use. It is important for a developer to understand how this works to avoid
     * unnecessary performance bottlenecks.
     *
     * @par NTT form
     * When using the BFV scheme (scheme_type::BFV), all plaintext and ciphertexts
     * should remain by default in the usual coefficient representation, i.e. not in
     * NTT form. When using the CKKS scheme (scheme_type::CKKS), all plaintexts and
     * ciphertexts should remain by default in NTT form. We call these scheme-specific
     * NTT states the "default NTT form". Decryption requires the input ciphertexts
     * to be in the default NTT form, and will throw an exception if this is not the
     * case.
     *
     * @typedef {Object} Decryptor
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @param {SecretKey} options.secretKey SecretKey to be used for decryption
     * @property {function} decrypt Decrypts a Ciphertext and stores the result in the destination parameter
     * @property {function} invariantNoiseBudget Computes the invariant noise budget (in bits) of a ciphertext
     * @returns {Decryptor} - A decryptor instance that can be used to decrypt CipherTexts
     * @constructor
     */
    Decryptor({ context, secretKey }) {
      return _Decryptor({ library: _Library.instance, context, secretKey })
    },

    /**
     * Create an instance of EncryptionParameters
     *
     * Represents user-customizable encryption scheme settings. The parameters (most
     * importantly poly_modulus, coeff_modulus, plain_modulus) significantly affect
     * the performance, capabilities, and security of the encryption scheme. Once
     * an instance of EncryptionParameters is populated with appropriate parameters,
     * it can be used to create an instance of the SEALContext class, which verifies
     * the validity of the parameters, and performs necessary pre-computations.
     *
     * Picking appropriate encryption parameters is essential to enable a particular
     * application while balancing performance and security. Some encryption settings
     * will not allow some inputs (e.g. attempting to encrypt a polynomial with more
     * coefficients than poly_modulus or larger coefficients than plain_modulus) or,
     * support the desired computations (with noise growing too fast due to too large
     * plain_modulus and too small coeff_modulus).
     *
     * @par parms_id
     * The EncryptionParameters class maintains at all times a 256-bit hash of the
     * currently set encryption parameters called the parms_id. This hash acts as
     * a unique identifier of the encryption parameters and is used by all further
     * objects created for these encryption parameters. The parms_id is not intended
     * to be directly modified by the user but is used internally for pre-computation
     * data lookup and input validity checks. In modulus switching the user can use
     * the parms_id to keep track of the chain of encryption parameters. The parms_id
     * is not exposed in the public API of EncryptionParameters, but can be accessed
     * through the SEALContext::ContextData class once the SEALContext has been created.
     *
     * @par Thread Safety
     * In general, reading from EncryptionParameters is thread-safe, while mutating
     * is not.
     *
     * @warning Choosing inappropriate encryption parameters may lead to an encryption
     * scheme that is not secure, does not perform well, and/or does not support the
     * input and computation of the desired application. We highly recommend consulting
     * an expert in RLWE-based encryption when selecting parameters, as this is where
     * inexperienced users seem to most often make critical mistakes.
     *
     * @typedef {Object} EncryptionParameters
     * @param {Object} options Options
     * @param {SchemeType} options.schemeType The desired scheme type to use
     * @property {getter} scheme Getter for the encryption scheme type
     * @property {getter} polyModulusDegree Getter for the degree of the polynomial modulus parameter
     * @property {getter} coeffModulus Getter for the currently set coefficient modulus parameter
     * @property {getter} plainModulus Getter the currently set plaintext modulus parameter
     * @property {function} setPolyModulusDegree Sets the degree of the polynomial modulus parameter to the specified value
     * @property {function} setCoeffModulus Sets the coefficient modulus parameter
     * @property {function} setPlainModulus Sets the plaintext modulus parameter
     * @property {function} save Save the Encryption Parameters to a base64 string
     * @property {function} load Load the Encryption Parameters from a base64 string
     * @returns {EncryptionParameters} - A set of encryption parameters based from the scheme type
     * @constructor
     */
    EncryptionParameters({ schemeType }) {
      return _EncryptionParameters({
        library: _Library.instance,
        schemeType
      })
    },

    /**
     * Create an instance of an Encryptor
     *
     * Encrypts Plaintext objects into Ciphertext objects. Constructing an Encryptor
     * requires a SEALContext with valid encryption parameters, the public key and/or
     * the secret key. If an Encrytor is given a secret key, it supports symmetric-key
     * encryption. If an Encryptor is given a public key, it supports asymmetric-key
     * encryption.
     *
     * @par Overloads
     * For the encrypt function we provide two overloads concerning the memory pool
     * used in allocations needed during the operation. In one overload the global
     * memory pool is used for this purpose, and in another overload the user can
     * supply a MemoryPoolHandle to to be used instead. This is to allow one single
     * Encryptor to be used concurrently by several threads without running into thread
     * contention in allocations taking place during operations. For example, one can
     * share one single Encryptor across any number of threads, but in each thread
     * call the encrypt function by giving it a thread-local MemoryPoolHandle to use.
     * It is important for a developer to understand how this works to avoid unnecessary
     * performance bottlenecks.
     *
     * @par NTT form
     * When using the BFV scheme (scheme_type::BFV), all plaintext and ciphertexts should
     * remain by default in the usual coefficient representation, i.e. not in NTT form.
     * When using the CKKS scheme (scheme_type::CKKS), all plaintexts and ciphertexts
     * should remain by default in NTT form. We call these scheme-specific NTT states
     * the "default NTT form". Decryption requires the input ciphertexts to be in
     * the default NTT form, and will throw an exception if this is not the case.
     *
     *
     * @typedef {Object} Encryptor
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @param {PublicKey} options.publicKey - PublicKey to be used for encryption
     * @property {function} encrypt Encrypts a plaintext and stores the result in the destination parameter
     * @returns {Encryptor} - An encryptor instance that can be used to encrypt PlainTexts
     * @constructor
     */
    Encryptor({ context, publicKey }) {
      return _Encryptor({ library: _Library.instance, context, publicKey })
    },

    /**
     * Create an instance of an Evaluator
     *
     * Provides operations on ciphertexts. Due to the properties of the encryption
     * scheme, the arithmetic operations pass through the encryption layer to the
     * underlying plaintext, changing it according to the type of the operation. Since
     * the plaintext elements are fundamentally polynomials in the polynomial quotient
     * ring Z_T[x]/(X^N+1), where T is the plaintext modulus and X^N+1 is the polynomial
     * modulus, this is the ring where the arithmetic operations will take place.
     * BatchEncoder (batching) provider an alternative possibly more convenient view
     * of the plaintext elements as 2-by-(N2/2) matrices of integers modulo the plaintext
     * modulus. In the batching view the arithmetic operations act on the matrices
     * element-wise. Some of the operations only apply in the batching view, such as
     * matrix row and column rotations. Other operations such as relinearization have
     * no semantic meaning but are necessary for performance reasons.
     *
     * @par Arithmetic Operations
     * The core operations are arithmetic operations, in particular multiplication
     * and addition of ciphertexts. In addition to these, we also provide negation,
     * subtraction, squaring, exponentiation, and multiplication and addition of
     * several ciphertexts for convenience. in many cases some of the inputs to a
     * computation are plaintext elements rather than ciphertexts. For this we
     * provide fast "plain" operations: plain addition, plain subtraction, and plain
     * multiplication.
     *
     * @par Relinearization
     * One of the most important non-arithmetic operations is relinearization, which
     * takes as input a ciphertext of size K+1 and relinearization keys (at least K-1
     * keys are needed), and changes the size of the ciphertext down to 2 (minimum size).
     * For most use-cases only one relinearization key suffices, in which case
     * relinearization should be performed after every multiplication. Homomorphic
     * multiplication of ciphertexts of size K+1 and L+1 outputs a ciphertext of size
     * K+L+1, and the computational cost of multiplication is proportional to K*L.
     * Plain multiplication and addition operations of any type do not change the
     * size. Relinearization requires relinearization keys to have been generated.
     *
     * @par Rotations
     * When batching is enabled, we provide operations for rotating the plaintext matrix
     * rows cyclically left or right, and for rotating the columns (swapping the rows).
     * Rotations require Galois keys to have been generated.
     *
     * @par Other Operations
     * We also provide operations for transforming ciphertexts to NTT form and back,
     * and for transforming plaintext polynomials to NTT form. These can be used in
     * a very fast plain multiplication variant, that assumes the inputs to be in NTT
     * form. Since the NTT has to be done in any case in plain multiplication, this
     * function can be used when e.g. one plaintext input is used in several plain
     * multiplication, and transforming it several times would not make sense.
     *
     * @par NTT form
     * When using the BFV scheme (scheme_type::BFV), all plaintexts and ciphertexts
     * should remain by default in the usual coefficient representation, i.e., not
     * in NTT form. When using the CKKS scheme (scheme_type::CKKS), all plaintexts
     * and ciphertexts should remain by default in NTT form. We call these scheme-
     * specific NTT states the "default NTT form". Some functions, such as add, work
     * even if the inputs are not in the default state, but others, such as multiply,
     * will throw an exception. The output of all evaluation functions will be in
     * the same state as the input(s), with the exception of the transform_to_ntt
     * and transform_from_ntt functions, which change the state. Ideally, unless these
     * two functions are called, all other functions should "just work".
     *
     * @see EncryptionParameters for more details on encryption parameters.
     * @see BatchEncoder for more details on batching
     * @see RelinKeys for more details on relinearization keys.
     * @see GaloisKeys for more details on Galois keys.
     *
     * @typedef {Object} Evaluator
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @property {function} negate Negates a ciphertext and stores the result in the destination parameter
     * @property {function} add Adds two CipherTexts
     * @property {function} addPlain Adds a PlainText to a CipherText
     * @property {function} sub Subtracts two CipherTexts
     * @property {function} subPlain Subtracts a PlainText from a CipherText
     * @property {function} multiply Multiplies two CipherTexts
     * @property {function} multiplyPlain Multiplies a CipherText by a PlainText
     * @property {function} square Squares a CipherText
     * @property {function} relinearize Relinearizes a CipherText
     * @property {function} cipherModSwitchToNext Switches a CipherText to the next downstream modulus
     * @property {function} cipherModSwitchTo Switches a CipherText to the specified parmsId
     * @property {function} plainModSwitchToNext Switches a PlainText to the next downstream modulus
     * @property {function} plainModSwitchTo Switches a PlainText to the specified parmsId
     * @property {function} rescaleToNext Rescales a CipherText
     * @property {function} rescaleTo Rescales a CipherText to the specified parmsId
     * @property {function} exponentiate Exponentiates a CipherText
     * @property {function} plainTransformToNtt Transforms a PlainText to the NTT domain
     * @property {function} cipherTransformToNtt Transforms a CipherText to the NTT domain
     * @property {function} cipherTransformFromNtt Transforms a CipherText back from the NTT domain
     * @property {function} applyGalois Applies a Galois automorphism to a CipherText
     * @property {function} rotateRows Rotates a CipherText's matrix rows cyclically
     * @property {function} rotateColumns Rotates a CipherText's matrix columns cyclically
     * @property {function} rotateVector Rotates a CipherText's vector cyclically
     * @property {function} complexConjugate Complex conjugates CipherText's slot values (CKKS only)
     * @returns {Evaluator} An evaluator instance to be used to perform homomorphic evaluations
     * @constructor
     */
    Evaluator({ context }) {
      return _Evaluator({ library: _Library.instance, context })
    },

    /**
     * Get the Exception singleton
     * @typedef {Object} Exception
     * @property {function} getHuman Returns the human readable exception string from a WASM pointer
     * @returns {Exception} - The Exception singleton
     * @constructor
     */
    get Exception() {
      return _Exception
    },

    /**
     * Create an instance of GaloisKeys
     *
     * Class to store Galois keys.
     *
     * @par Slot Rotations
     * Galois keys are used together with batching (BatchEncoder). If the polynomial modulus
     * is a polynomial of degree N, in batching the idea is to view a plaintext polynomial as
     * a 2-by-(N/2) matrix of integers modulo plaintext modulus. Normal homomorphic computations
     * operate on such encrypted matrices element (slot) wise. However, special rotation
     * operations allow us to also rotate the matrix rows cyclically in either direction, and
     * rotate the columns (swap the rows). These operations require the Galois keys.
     *
     * @par Thread Safety
     * In general, reading from GaloisKeys is thread-safe as long as no other thread is
     * concurrently mutating it. This is due to the underlying data structure storing the
     * Galois keys not being thread-safe.
     *
     * @see SecretKey for the class that stores the secret key.
     * @see PublicKey for the class that stores the public key.
     * @see RelinKeys for the class that stores the relinearization keys.
     * @see KeyGenerator for the class that generates the Galois keys.
     *
     * @typedef {Object} GaloisKeys
     * @property {function} save Saves the instance to a base64 string
     * @property {function} load Loads the instance from a base64 string
     * @returns {GaloisKeys} - An empty GaloisKeys instance
     * @constructor
     */
    GaloisKeys() {
      return _GaloisKeys({ library: _Library.instance })
    },

    /**
     * Create an instance of an IntegerEncoder
     *
     * Encodes integers into plaintext polynomials that Encryptor can encrypt. An instance of
     * the IntegerEncoder class converts an integer into a plaintext polynomial by placing its
     * binary digits as the coefficients of the polynomial. Decoding the integer amounts to
     * evaluating the plaintext polynomial at x=2.
     *
     * Addition and multiplication on the integer side translate into addition and multiplication
     * on the encoded plaintext polynomial side, provided that the length of the polynomial
     * never grows to be of the size of the polynomial modulus (poly_modulus), and that the
     * coefficients of the plaintext polynomials appearing throughout the computations never
     * experience coefficients larger than the plaintext modulus (plain_modulus).
     *
     * @par Negative Integers
     * Negative integers are represented by using -1 instead of 1 in the binary representation,
     * and the negative coefficients are stored in the plaintext polynomials as unsigned integers
     * that represent them modulo the plaintext modulus. Thus, for example, a coefficient of -1
     * would be stored as a polynomial coefficient plain_modulus-1.
     *
     * @typedef {Object} IntegerEncoder
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @property {function} encodeInt32 Encode an Int32 value to a PlainText
     * @property {function} encodeUInt32 Encode an UInt32 value to a PlainText
     * @property {function} decodeInt32 Decode an Int32 value from a PlainText
     * @property {function} decodeUInt32 Decode an UInt32 value from a PlainText
     * @returns {IntegerEncoder} - An encoder to be used for encoding only integers to PlainTexts
     * @constructor
     */
    IntegerEncoder({ context }) {
      return _IntegerEncoder({ library: _Library.instance, context })
    },

    /**
     * Create an instance of a KeyGenerator
     *
     * Generates matching secret key and public key. An existing KeyGenerator can
     * also at any time be used to generate relinearization keys and Galois keys.
     * Constructing a KeyGenerator requires only a SEALContext.
     *
     * @see EncryptionParameters for more details on encryption parameters.
     * @see SecretKey for more details on secret key.
     * @see PublicKey for more details on public key.
     * @see RelinKeys for more details on relinearization keys.
     * @see GaloisKeys for more details on Galois keys.
     *
     * @typedef {Object} KeyGenerator
     * @param {Object} options Options
     * @param {Context} options.context Encryption context
     * @param {SecretKey} [options.secretKey] - Previously generated SecretKey
     * @param {PublicKey} [options.publicKey] - Previously generated PublicKey
     * @property {function} getSecretKey Returns the generated SecretKey
     * @property {function} getPublicKey Returns the generated PublicKey
     * @property {function} genRelinKeys Generate RelinKeys
     * @property {function} genGaloisKeys Generate GaloisKeys
     * @returns {KeyGenerator} - A KeyGenerator to be used to generate keys depending on how it was initialized
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
     * MemoryPoolHandle
     *
     * Manages a shared pointer to a memory pool. Microsoft SEAL uses memory pools
     * for improved performance due to the large number of memory allocations
     * needed by the homomorphic encryption operations, and the underlying polynomial
     * arithmetic. The library automatically creates a shared global memory pool
     * that is used for all dynamic allocations by default, and the user can
     * optionally create any number of custom memory pools to be used instead.
     *
     * @par Uses in Multi-Threaded Applications
     * Sometimes the user might want to use specific memory pools for dynamic
     * allocations in certain functions. For example, in heavily multi-threaded
     * applications allocating concurrently from a shared memory pool might lead
     * to significant performance issues due to thread contention. For these cases
     * Microsoft SEAL provides overloads of the functions that take a MemoryPoolHandle
     * as an additional argument, and uses the associated memory pool for all dynamic
     * allocations inside the function. Whenever these functions are called, the
     * user can then simply pass a thread-local MemoryPoolHandle to be used.
     *
     * @par Thread-Unsafe Memory Pools
     * While memory pools are by default thread-safe, in some cases it suffices
     * to have a memory pool be thread-unsafe. To get a little extra performance,
     * the user can optionally create such thread-unsafe memory pools and use them
     * just as they would use thread-safe memory pools.
     *
     * @par Initialized and Uninitialized Handles
     * A MemoryPoolHandle has to be set to point either to the global memory pool,
     * or to a new memory pool. If this is not done, the MemoryPoolHandle is
     * said to be uninitialized, and cannot be used. Initialization simple means
     * assigning MemoryPoolHandle::Global() or MemoryPoolHandle::New() to it.
     *
     * @par Managing Lifetime
     * Internally, the MemoryPoolHandle wraps an std::shared_ptr pointing to
     * a memory pool class. Thus, as long as a MemoryPoolHandle pointing to
     * a particular memory pool exists, the pool stays alive. Classes such as
     * Evaluator and Ciphertext store their own local copies of a MemoryPoolHandle
     * to guarantee that the pool stays alive as long as the managing object
     * itself stays alive. The global memory pool is implemented as a global
     * std::shared_ptr to a memory pool class, and is thus expected to stay
     * alive for the entire duration of the program execution. Note that it can
     * be problematic to create other global objects that use the memory pool
     * e.g. in their constructor, as one would have to ensure the initialization
     * order of these global variables to be correct (i.e. global memory pool
     * first).
     *
     * @typedef {Object} MemoryPoolHandle
     * @property {getter} global Getter for the MemoryPoolHandle pointing to the global memory pool
     * @property {getter} threadLocal Getter for the MemoryPoolHandle pointing to the theard-local memory pool
     * @returns {MemoryPoolHandle} - The MemoryPoolHandle singleton
     * @constructor
     */
    get MemoryPoolHandle() {
      return _MemoryPoolHandle
    },

    /**
     * Get the PlainModulus singleton
     *
     * @typedef {Object} PlainModulus
     * @property {function} Batching Creates a prime number SmallModulus for use as plainModulus encryption
     * parameter that supports batching with a given polyModulusDegree.
     * @property {function} BatchingVector Creates several prime number SmallModulus elements that can be used as
     * plainModulus encryption parameters, each supporting batching with a given
     * polyModulusDegree.
     * @returns {PlainModulus} - The PlainModulus singleton
     * @constructor
     */
    get PlainModulus() {
      return _PlainModulus
    },

    /**
     * Create an instance of a PlainText
     *
     * Class to store a plaintext element. The data for the plaintext is a polynomial
     * with coefficients modulo the plaintext modulus. The degree of the plaintext
     * polynomial must be one less than the degree of the polynomial modulus. The
     * backing array always allocates one 64-bit word per each coefficient of the
     * polynomial.
     *
     * @par Memory Management
     * The coefficient count of a plaintext refers to the number of word-size
     * coefficients in the plaintext, whereas its capacity refers to the number of
     * word-size coefficients that fit in the current memory allocation. In high-
     * performance applications unnecessary re-allocations should be avoided by
     * reserving enough memory for the plaintext to begin with either by providing
     * the desired capacity to the constructor as an extra argument, or by calling
     * the reserve function at any time.
     *
     * When the scheme is scheme_type::BFV each coefficient of a plaintext is a 64-bit
     * word, but when the scheme is scheme_type::CKKS the plaintext is by default
     * stored in an NTT transformed form with respect to each of the primes in the
     * coefficient modulus. Thus, the size of the allocation that is needed is the
     * size of the coefficient modulus (number of primes) times the degree of the
     * polynomial modulus. In addition, a valid CKKS plaintext also store the parms_id
     * for the corresponding encryption parameters.
     *
     * @par Thread Safety
     * In general, reading from plaintext is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the plaintext not being thread-safe.
     *
     * @see Ciphertext for the class that stores ciphertexts.
     *
     * @typedef {Object} PlainText
     * @property {getter} isZero Getter for whether the current plaintext polynomial has all zero coefficients
     * @property {getter} capacity Getter for the capacity of the current allocation
     * @property {getter} coeffCount Getter for the coefficient count of the current plaintext polynomial
     * @property {getter} significantCoeffCount Getter for the significant coefficient count of the current plaintext polynomial
     * @property {getter} nonzeroCoeffCount Getter for the non-zero coefficient count of the current plaintext polynomial
     * @property {getter} isNttForm Getter for whether the plaintext is in NTT form
     * @property {getter} parmsId Getter for a reference to parmsId
     * @property {getter} scale Getter for a reference to the scale
     * @property {getter} pool Getter for the currently used MemoryPoolHandle
     * @property {function} shrinkToFit Reduce the memory use of the plaintext
     * @property {function} setZero Set the PlainText polynomial to zero
     * @property {function} toPolynomial Returns a human-readable string description of the plaintext polynomial
     * @property {function} save Saves the instance to a base64 string
     * @property {function} load Loads the instance from a base64 string
     * @returns {PlainText} - An empty PlainText instance
     * @constructor
     */
    PlainText() {
      return _PlainText({ library: _Library.instance })
    },

    /**
     * Create an instance of a PublicKey
     *
     * Class to store a public key.
     *
     * @par Thread Safety
     * In general, reading from PublicKey is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the public key not being thread-safe.
     *
     * @see KeyGenerator for the class that generates the public key.
     * @see SecretKey for the class that stores the secret key.
     * @see RelinKeys for the class that stores the relinearization keys.
     * @see GaloisKeys for the class that stores the Galois keys.
     *
     * @typedef {Object} PublicKey
     * @property {function} save Saves the instance to a base64 string
     * @property {function} load Loads the instance from a base64 string
     * @returns {PublicKey} - An empty PublicKey instance
     * @constructor
     */
    PublicKey() {
      return _PublicKey({ library: _Library.instance })
    },

    /**
     * Create an instance of a RelinKeys
     *
     * Class to store relinearization keys.
     *
     * @par Relinearization
     * Freshly encrypted ciphertexts have a size of 2, and multiplying ciphertexts
     * of sizes K and L results in a ciphertext of size K+L-1. Unfortunately, this
     * growth in size slows down further multiplications and increases noise growth.
     * Relinearization is an operation that has no semantic meaning, but it reduces
     * the size of ciphertexts back to 2. Microsoft SEAL can only relinearize size 3
     * ciphertexts back to size 2, so if the ciphertexts grow larger than size 3,
     * there is no way to reduce their size. Relinearization requires an instance of
     * RelinKeys to be created by the secret key owner and to be shared with the
     * evaluator. Note that plain multiplication is fundamentally different from
     * normal multiplication and does not result in ciphertext size growth.
     *
     * @par When to Relinearize
     * Typically, one should always relinearize after each multiplications. However,
     * in some cases relinearization should be postponed as late as possible due to
     * its computational cost. For example, suppose the computation involves several
     * homomorphic multiplications followed by a sum of the results. In this case it
     * makes sense to not relinearize each product, but instead add them first and
     * only then relinearize the sum. This is particularly important when using the
     * CKKS scheme, where relinearization is much more computationally costly than
     * multiplications and additions.
     *
     * @par Thread Safety
     * In general, reading from RelinKeys is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the relinearization keys not being thread-safe.
     *
     * @see SecretKey for the class that stores the secret key.
     * @see PublicKey for the class that stores the public key.
     * @see GaloisKeys for the class that stores the Galois keys.
     * @see KeyGenerator for the class that generates the relinearization keys.
     *
     * @typedef {Object} RelinKeys
     * @property {function} save Saves the instance to a base64 string
     * @property {function} load Loads the instance from a base64 string
     * @returns {RelinKeys} - An empty RelinKeys instance
     * @constructor
     */
    RelinKeys() {
      return _RelinKeys({ library: _Library.instance })
    },

    /**
     * Get the SchemeType singleton
     *
     * @typedef {Object} SchemeType
     * @property {getter} none Getter for the 'none' scheme type
     * @property {getter} BFV Getter for the 'BFV' scheme type
     * @property {getter} CKKS Getter for the 'CKKS' scheme type
     * @returns {SchemeType} - The SchemeType singleton
     * @constructor
     */
    get SchemeType() {
      return _SchemeType
    },

    /**
     * Create an instance of a SecretKey
     *
     * Class to store a secret key.
     *
     * @par Thread Safety
     * In general, reading from SecretKey is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the secret key not being thread-safe.
     *
     * @see KeyGenerator for the class that generates the secret key.
     * @see PublicKey for the class that stores the public key.
     * @see RelinKeys for the class that stores the relinearization keys.
     * @see GaloisKeys for the class that stores the Galois keys.
     *
     * @typedef {Object} SecretKey
     * @property {function} save Saves the instance to a base64 string
     * @property {function} load Loads the instance from a base64 string
     * @returns {SecretKey} - An empty SecretKey instance
     * @constructor
     */
    SecretKey() {
      return _SecretKey({ library: _Library.instance })
    },

    /**
     * SecurityLevel
     *
     * Represents a standard security level according to the HomomorphicEncryption.org
     * security standard. The value sec_level_type::none signals that no standard
     * security level should be imposed. The value sec_level_type::tc128 provides
     * a very high level of security and is the default security level enforced by
     * Microsoft SEAL when constructing a SEALContext object. Normal users should not
     * have to specify the security level explicitly anywhere.
     *
     * @typedef {Object} SecurityLevel
     * @property {getter} none Getter for the 'none' security level
     * @property {getter} tc128 Getter for the '128 bit' security level
     * @property {getter} tc192 Getter for the '192 bit' security level
     * @property {getter} tc256 Getter for the '256 bit' security level
     * @returns {SecurityLevel} - The SecurityLevel singleton
     * @constructor
     */
    get SecurityLevel() {
      return _SecurityLevel
    },

    /**
     * Create an instance of a SmallModulus
     * @typedef {Object} SmallModulus
     * @property {getter} value Getter for the string value of the SmallModulus
     * @property {getter} bitCount Getter for the significant bit count of the value of the current SmallModulus
     * @property {getter} isZero Getter for whether the value of the current SmallModulus is zero
     * @property {getter} isPrime Getter for whether the value of the current SmallModulus is a prime number
     * @property {function} setValue Loads a SmallModulus from a string representing an uint64 value
     * @property {function} save Saves the instance to a base64 string
     * @returns {SmallModulus} - An empty SmallModulus instance
     * @constructor
     */
    SmallModulus() {
      return _SmallModulus({ library: _Library.instance })
    },

    /**
     * Create an instance of a C++ Vector
     * @typedef {Object} Vector
     * @param {Object} options Options
     * @param {Int32Array|Uint32Array|Float64Array} options.array - Typed Array of data
     * @property {getter} type Getter for the Vector type
     * @property {getter} size Getter for length of the Vector
     * @property {function} printMatrix Prints a matrix to the console
     * @property {function} printVector Prints a vector to the console
     * @property {function} fromArray Convert a typed array to a vector
     * @property {function} getValue Get a value pointed to by the specified index of a Vector
     * @property {function} resize Resizes a vector to the given size
     * @property {function} toArray Copy a vector's data into a Typed Array
     * @returns {Vector} - Vector containing the typed data
     * @constructor
     */
    Vector({ array }) {
      return _Vector({ library: _Library.instance, array })
    }
  }
}
