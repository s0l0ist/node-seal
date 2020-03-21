import * as Components from '../components'
import { applyDependencies, addLibraryToComponents } from './util'

export const SEAL = library => {
  // Inject all components with the seal wasm library
  const components = addLibraryToComponents(library)(Components)

  // Next, create our singleton and constructor modules in order of dependence
  const Exception = applyDependencies()(components.Exception)
  const ComprModeType = applyDependencies()(components.ComprModeType)
  const MemoryPoolHandle = applyDependencies()(components.MemoryPoolHandle)
  const CoeffModulus = applyDependencies({ Exception })(components.CoeffModulus)
  const SmallModulus = applyDependencies({ Exception, ComprModeType })(
    components.SmallModulus
  )
  const Vector = applyDependencies({ Exception })(components.Vector)
  const PlainModulus = applyDependencies({
    Exception,
    SmallModulus,
    Vector
  })(components.PlainModulus)
  const SchemeType = applyDependencies()(components.SchemeType)
  const SecurityLevel = applyDependencies()(components.SecurityLevel)
  const Util = applyDependencies({ Exception })(components.Util)
  const ParmsIdType = applyDependencies({ Exception })(components.ParmsIdType)
  const PlainText = applyDependencies({
    Exception,
    ComprModeType,
    ParmsIdType
  })(components.PlainText)
  const CipherText = applyDependencies({
    Exception,
    ComprModeType,
    ParmsIdType
  })(components.CipherText)
  const BatchEncoder = applyDependencies({
    Exception,
    MemoryPoolHandle,
    PlainText,
    Vector
  })(components.BatchEncoder)
  const CKKSEncoder = applyDependencies({
    Exception,
    MemoryPoolHandle,
    PlainText,
    Vector
  })(components.CKKSEncoder)
  const EncryptionParameterQualifiers = applyDependencies({
    Exception
  })(components.EncryptionParameterQualifiers)
  const EncryptionParameters = applyDependencies({
    Exception,
    ComprModeType,
    SmallModulus
  })(components.EncryptionParameters)
  const ContextData = applyDependencies({
    Exception,
    EncryptionParameters,
    ParmsIdType,
    EncryptionParameterQualifiers
  })(components.ContextData)
  const Context = applyDependencies({
    Exception,
    ParmsIdType,
    ContextData
  })(components.Context)
  const Decryptor = applyDependencies({
    Exception,
    PlainText
  })(components.Decryptor)
  const Encryptor = applyDependencies({
    Exception,
    MemoryPoolHandle,
    CipherText
  })(components.Encryptor)
  const Evaluator = applyDependencies({
    Exception,
    MemoryPoolHandle,
    CipherText,
    PlainText,
    SchemeType
  })(components.Evaluator)
  const PublicKey = applyDependencies({
    Exception,
    ComprModeType
  })(components.PublicKey)
  const SecretKey = applyDependencies({
    Exception,
    ComprModeType
  })(components.SecretKey)
  const RelinKeys = applyDependencies({
    Exception,
    ComprModeType
  })(components.RelinKeys)
  const GaloisKeys = applyDependencies({
    Exception,
    ComprModeType
  })(components.GaloisKeys)
  const IntegerEncoder = applyDependencies({
    Exception,
    PlainText
  })(components.IntegerEncoder)
  const KeyGenerator = applyDependencies({
    Exception,
    PublicKey,
    SecretKey,
    RelinKeys,
    GaloisKeys
  })(components.KeyGenerator)

  /**
   * @implements SEAL
   */

  /**
   * @interface SEAL
   */
  return {
    /**
     * @description
     * Provides functionality for CRT batching. If the polynomial modulus degree is N, and
     * the PlainText modulus is a prime number T such that T is congruent to 1 modulo 2N,
     * then BatchEncoder allows the PlainText elements to be viewed as 2-by-(N/2)
     * matrices of integers modulo T. Homomorphic operations performed on such encrypted
     * matrices are applied coefficient (slot) wise, enabling powerful SIMD functionality
     * for computations that are vectorizable. This functionality is often called "batching"
     * in the homomorphic encryption literature.
     *
     * @par Mathematical Background
     * Mathematically speaking, if the polynomial modulus is X^N+1, N is a power of two, and
     * PlainModulus is a prime number T such that 2N divides T-1, then integers modulo T
     * contain a primitive 2N-th root of unity and the polynomial X^N+1 splits into n distinct
     * linear factors as X^N+1 = (X-a_1)*...*(X-a_N) mod T, where the constants a1, ..., a_n
     * are all the distinct primitive 2N-th roots of unity in integers modulo T. The Chinese
     * Remainder Theorem (CRT) states that the PlainText space Z_T[X]/(X^N+1) in this case is
     * isomorphic (as an algebra) to the N-fold direct product of fields Z_T. The isomorphism
     * is easy to compute explicitly in both directions, which is what this class does.
     * Furthermore, the Galois group of the extension is (Z/2NZ)* ~= Z/2Z x Z/(N/2) whose
     * action on the primitive roots of unity is easy to describe. Since the batching slots
     * correspond 1-to-1 to the primitive roots of unity, applying Galois automorphisms on the
     * PlainText act by permuting the slots. By applying generators of the two cyclic
     * subgroups of the Galois group, we can effectively view the PlainText as a 2-by-(N/2)
     * matrix, and enable cyclic row rotations, and column rotations (row swaps).
     *
     * @par Valid Parameters
     * Whether batching can be used depends on whether the PlainText modulus has been chosen
     * appropriately. Thus, to construct a BatchEncoder the user must provide an instance
     * of Context such that its associated EncryptionParameterQualifiers object has the
     * flags parametersSet and enableBatching set to true.
     *
     * @function
     * @name SEAL#BatchEncoder
     * @param {Context} context Encryption context
     * @returns {BatchEncoder}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const batchEncoder = Morfix.BatchEncoder(context)
     */
    BatchEncoder,

    /**
     * @description
     * Class to store a CipherText element. The data for a CipherText consists
     * of two or more polynomials, which are in Microsoft SEAL stored in a CRT
     * form with respect to the factors of the coefficient modulus. This data
     * itself is not meant to be modified directly by the user, but is instead
     * operated on by functions in the Evaluator class. The size of the backing
     * array of a CipherText depends on the encryption parameters and the size
     * of the CipherText (at least 2). If the PolyModulusDegree encryption
     * parameter is N, and the number of primes in the CoeffModulus encryption
     * parameter is K, then the CipherText backing array requires precisely
     * 8*N*K*size bytes of memory. A CipherText also carries with it the
     * parmsId of its associated encryption parameters, which is used to check
     * the validity of the CipherText for homomorphic operations and decryption.
     *
     * @par Memory Management
     * The size of a CipherText refers to the number of polynomials it contains,
     * whereas its capacity refers to the number of polynomials that fit in the
     * current memory allocation. In high-performance applications unnecessary
     * re-allocations should be avoided by reserving enough memory for the
     * CipherText to begin with either by providing the desired capacity to the
     * constructor as an extra argument, or by calling the reserve function at
     * any time.
     *
     * @par Thread Safety
     * In general, reading from CipherText is thread-safe as long as no other
     * thread is concurrently mutating it. This is due to the underlying data
     * structure storing the CipherText not being thread-safe.
     *
     * @function
     * @name SEAL#CipherText
     * @param {CipherText} [instance=null] A WASM instance
     * @returns {CipherText} An empty CipherText instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const cipherText = Morfix.CipherText()
     */
    CipherText,

    /**
     * @description
     * Provides functionality for encoding vectors of complex or real numbers into
     * PlainText polynomials to be encrypted and computed on using the CKKS scheme.
     * If the polynomial modulus degree is N, then CKKSEncoder converts vectors of
     * N/2 complex numbers into PlainText elements. Homomorphic operations performed
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
     * whose action on the primitive roots of unity modulo CoeffModulus is easy to
     * describe. Since the batching slots correspond 1-to-1 to the primitive roots
     * of unity, applying Galois automorphisms on the PlainText acts by permuting
     * the slots. By applying generators of the two cyclic subgroups of the Galois
     * group, we can effectively enable cyclic rotations and complex conjugations
     * of the encrypted complex vectors.
     *
     * @function
     * @name SEAL#CKKSEncoder
     * @param {Context} context Encryption context
     * @returns {CKKSEncoder} An encoder used for the CKKS scheme type
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const ckksEncoder = Morfix.CKKSEncoder(context)
     */
    CKKSEncoder,

    /**
     * @description
     * This class contains static methods for creating a coefficient modulus easily.
     * Note that while these functions take a SecurityLevel argument, all security
     * guarantees are lost if the output is used with encryption parameters with
     * a mismatching value for the PolyModulusDegree.
     *
     * The default value SecurityLevel.tc128 provides a very high level of security
     * and is the default security level enforced by Microsoft SEAL when constructing
     * a Context object. Normal users should not have to specify the security
     * level explicitly anywhere.
     *
     * @readonly
     * @name SEAL#CoeffModulus
     * @type {CoeffModulus}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     * ...
     * const coeffModulus = Morfix.CoeffModulus.Create(4096, Int32Array.from([36, 36, 37])
     *
     * encParms.setCoeffModulus(coeffModulus)
     */
    CoeffModulus,

    /**
     * @description
     * A type to describe the compression algorithm applied to serialized data.
     * CipherText and key data consist of a large number of 64-bit words storing
     * integers modulo prime numbers much smaller than the word size, resulting in
     * a large number of zero bytes in the output. Any compression algorithm should
     * be able to clean up these zero bytes and hence compress both CipherText and
     * key data.
     *
     * @readonly
     * @name SEAL#ComprModeType
     * @type {ComprModeType}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const keyGenerator = Morfix.KeyGenerator(context)
     * const secretKey = keyGenerator.getSecretKey()
     * const base64 = secretKey.save() // Defaults to ComprModeType.deflate
     *
     * // Manually disable compression
     * // const base64 = secretKey.save(Morfix.ComprModeType.none)
     */
    ComprModeType,

    /**
     * @description
     * Performs sanity checks (validation) and pre-computations for a given set of encryption
     * parameters. While the EncryptionParameters class is intended to be a light-weight class
     * to store the encryption parameters, the Context class is a heavy-weight class that
     * is constructed from a given set of encryption parameters. It validates the parameters
     * for correctness, evaluates their properties, and performs and stores the results of
     * several costly pre-computations.
     *
     * After the user has set at least the PolyModulus, CoeffModulus, and PlainModulus
     * parameters in a given EncryptionParameters instance, the parameters can be validated
     * for correctness and functionality by constructing an instance of Context. The
     * constructor of Context does all of its work automatically, and concludes by
     * constructing and storing an instance of the EncryptionParameterQualifiers class, with
     * its flags set according to the properties of the given parameters. If the created
     * instance of EncryptionParameterQualifiers has the parametersSet flag set to true, the
     * given parameter set has been deemed valid and is ready to be used. If the parameters
     * were for some reason not appropriately set, the parametersSet flag will be false,
     * and a Context will have to be created after the parameters are corrected.
     *
     * By default, Context creates a chain of Context.ContextData instances. The
     * first one in the chain corresponds to special encryption parameters that are reserved
     * to be used by the various key classes (SecretKey, PublicKey, etc.). These are the exact
     * same encryption parameters that are created by the user and passed to th constructor of
     * Context. The functions keyContextData() and keyParmsId() return the ContextData
     * and the parmsId corresponding to these special parameters. The rest of the ContextData
     * instances in the chain correspond to encryption parameters that are derived from the
     * first encryption parameters by always removing the last one of the moduli in the
     * CoeffModulus, until the resulting parameters are no longer valid, e.g., there are no
     * more primes left. These derived encryption parameters are used by CipherTexts and
     * PlainTexts and their respective ContextData can be accessed through the
     * getContextData(ParmsIdType) function. The functions firstContextData() and
     * lastContextData() return the ContextData corresponding to the first and the last
     * set of parameters in the "data" part of the chain, i.e., the second and the last element
     * in the full chain. The chain itself is a doubly linked list, and is referred to as the
     * modulus switching chain.
     *
     * @function
     * @name SEAL#Context
     * @param {EncryptionParameters} encryptionParams A set of specific encryption parameters
     * @param {boolean} expandModChain Determines whether or not to enable modulus switching
     * @param {SecurityLevel} securityLevel The security strength in bits.
     * @returns {Context} An encryption context to be used for all operations
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     * ...
     * const context = Morfix.Context(encParms, true, Morfix.SecurityLevel.tc128)
     */
    Context,

    /**
     * @description
     * Hold pre-computation data for a given set of encryption parameters. Users should not need to directly create
     * this instance as it is used internally by the Seal Context.
     *
     * @private
     * @function
     * @name SEAL#ContextData
     * @returns {ContextData} The underlying context data from a given seal context
     */
    ContextData,

    /**
     * @description
     * Decrypts CipherText objects into PlainText objects. Constructing a Decryptor
     * requires a Context with valid encryption parameters, and the secret key.
     * The Decryptor is also used to compute the invariant noise budget in a given
     * CipherText.
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
     * When using the BFV scheme (SchemeType.BFV), all PlainText and CipherTexts
     * should remain by default in the usual coefficient representation, i.e. not in
     * NTT form. When using the CKKS scheme (SchemeType.CKKS), all PlainTexts and
     * CipherTexts should remain by default in NTT form. We call these scheme-specific
     * NTT states the "default NTT form". Decryption requires the input CipherTexts
     * to be in the default NTT form, and will throw an exception if this is not the
     * case.
     *
     * @function
     * @name SEAL#Decryptor
     * @param {Context} context Encryption context
     * @param {SecretKey} secretKey SecretKey to be used for decryption
     * @returns {Decryptor} A Decryptor instance that can be used to decrypt CipherTexts
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const decryptor = Morfix.Decryptor(context, secretKey)
     */
    Decryptor,

    /**
     * @description
     * Stores a set of attributes (qualifiers) of a set of encryption parameters.
     * These parameters are mainly used internally in various parts of the library,
     * e.g., to determine which algorithmic optimizations the current support. The
     * qualifiers are automatically created by the SEALContext class, silently passed
     * on to classes such as Encryptor, Evaluator, and Decryptor, and the only way to
     * change them is by changing the encryption parameters themselves. In other
     * words, a user will never have to create their own instance of this class, and
     * in most cases never have to worry about it at all.
     *
     * @private
     * @function
     * @name SEAL#EncryptionParameterQualifiers
     * @returns {EncryptionParameterQualifiers} The qualifiers of the encryption parameters
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     * ...
     * const context = Morfix.Context(encParms, true, Morfix.SecurityLevel.tc128)
     * const qualifiers = context.qualifiers
     */
    EncryptionParameterQualifiers,

    /**
     * @description
     * Represents user-customizable encryption scheme settings. The parameters (most
     * importantly PolyModulus, CoeffModulus, PlainModulus) significantly affect
     * the performance, capabilities, and security of the encryption scheme. Once
     * an instance of EncryptionParameters is populated with appropriate parameters,
     * it can be used to create an instance of the Context class, which verifies
     * the validity of the parameters, and performs necessary pre-computations.
     *
     * Picking appropriate encryption parameters is essential to enable a particular
     * application while balancing performance and security. Some encryption settings
     * will not allow some inputs (e.g. attempting to encrypt a polynomial with more
     * coefficients than PolyModulus or larger coefficients than PlainModulus) or,
     * support the desired computations (with noise growing too fast due to too large
     * PlainModulus and too small CoeffModulus).
     *
     * @par parmsId
     * The EncryptionParameters class maintains at all times a 256-bit hash of the
     * currently set encryption parameters called the parmsId. This hash acts as
     * a unique identifier of the encryption parameters and is used by all further
     * objects created for these encryption parameters. The parmsId is not intended
     * to be directly modified by the user but is used internally for pre-computation
     * data lookup and input validity checks. In modulus switching the user can use
     * the parmsId to keep track of the chain of encryption parameters. The parmsId
     * is not exposed in the public API of EncryptionParameters, but can be accessed
     * through the Context.ContextData class once the Context has been created.
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
     * @function
     * @name SEAL#EncryptionParameters
     * @param {SchemeType} schemeType The desired scheme type to use
     * @returns {EncryptionParameters} A set of encryption parameters based from the scheme type
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     */
    EncryptionParameters,

    /**
     * @description
     * Encrypts PlainText objects into CipherText objects. Constructing an Encryptor
     * requires a Context with valid encryption parameters, the public key and/or
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
     * call the encrypt function by giving it a thread-local MemoryPoolHandle
     * (MemoryPoolHandle.threadLocal) to use. It is important for a developer
     * to understand how this works to avoid unnecessary performance bottlenecks.
     *
     * @par NTT form
     * When using the BFV scheme (SchemeType.BFV), all PlainText and CipherTexts should
     * remain by default in the usual coefficient representation, i.e. not in NTT form.
     * When using the CKKS scheme (SchemeType.CKKS), all PlainTexts and CipherTexts
     * should remain by default in NTT form. We call these scheme-specific NTT states
     * the "default NTT form". Decryption requires the input CipherTexts to be in
     * the default NTT form, and will throw an exception if this is not the case.
     *
     *
     * @function
     * @name SEAL#Encryptor
     * @param {Context} context Encryption context
     * @param {PublicKey} publicKey PublicKey to be used for encryption
     * @returns {Encryptor} An Encryptor instance that can be used to encrypt PlainTexts
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encryptor = Morfix.Encryptor(context, publicKey)
     */
    Encryptor,

    /**
     * @description
     * Provides operations on CipherTexts. Due to the properties of the encryption
     * scheme, the arithmetic operations pass through the encryption layer to the
     * underlying PlainText, changing it according to the type of the operation. Since
     * the PlainText elements are fundamentally polynomials in the polynomial quotient
     * ring Z_T[x]/(X^N+1), where T is the PlainText modulus and X^N+1 is the polynomial
     * modulus, this is the ring where the arithmetic operations will take place.
     * BatchEncoder (batching) provider an alternative possibly more convenient view
     * of the PlainText elements as 2-by-(N2/2) matrices of integers modulo the PlainText
     * modulus. In the batching view the arithmetic operations act on the matrices
     * element-wise. Some of the operations only apply in the batching view, such as
     * matrix row and column rotations. Other operations such as relinearization have
     * no semantic meaning but are necessary for performance reasons.
     *
     * @par Arithmetic Operations
     * The core operations are arithmetic operations, in particular multiplication
     * and addition of CipherTexts. In addition to these, we also provide negation,
     * subtraction, squaring, exponentiation, and multiplication and addition of
     * several CipherTexts for convenience. in many cases some of the inputs to a
     * computation are PlainText elements rather than CipherTexts. For this we
     * provide fast "plain" operations: plain addition, plain subtraction, and plain
     * multiplication.
     *
     * @par Relinearization
     * One of the most important non-arithmetic operations is relinearization, which
     * takes as input a CipherText of size K+1 and relinearization keys (at least K-1
     * keys are needed), and changes the size of the CipherText down to 2 (minimum size).
     * For most use-cases only one relinearization key suffices, in which case
     * relinearization should be performed after every multiplication. Homomorphic
     * multiplication of CipherTexts of size K+1 and L+1 outputs a CipherText of size
     * K+L+1, and the computational cost of multiplication is proportional to K*L.
     * Plain multiplication and addition operations of any type do not change the
     * size. Relinearization requires relinearization keys to have been generated.
     *
     * @par Rotations
     * When batching is enabled, we provide operations for rotating the PlainText matrix
     * rows cyclically left or right, and for rotating the columns (swapping the rows).
     * Rotations require Galois keys to have been generated.
     *
     * @par Other Operations
     * We also provide operations for transforming CipherTexts to NTT form and back,
     * and for transforming PlainText polynomials to NTT form. These can be used in
     * a very fast plain multiplication variant, that assumes the inputs to be in NTT
     * form. Since the NTT has to be done in any case in plain multiplication, this
     * function can be used when e.g. one PlainText input is used in several plain
     * multiplication, and transforming it several times would not make sense.
     *
     * @par NTT form
     * When using the BFV scheme (SchemeType.BFV), all PlainTexts and CipherTexts
     * should remain by default in the usual coefficient representation, i.e., not
     * in NTT form. When using the CKKS scheme (SchemeType.CKKS), all PlainTexts
     * and CipherTexts should remain by default in NTT form. We call these scheme-
     * specific NTT states the "default NTT form". Some functions, such as add, work
     * even if the inputs are not in the default state, but others, such as multiply,
     * will throw an exception. The output of all evaluation functions will be in
     * the same state as the input(s), with the exception of the transformToNtt
     * and transformFromNtt functions, which change the state. Ideally, unless these
     * two functions are called, all other functions should "just work".
     *
     * @see {@link EncryptionParameters} for more details on encryption parameters.
     * @see {@link BatchEncoder} for more details on batching
     * @see {@link RelinKeys} for more details on relinearization keys.
     * @see {@link GaloisKeys} for more details on Galois keys.
     *
     * @function
     * @name SEAL#Evaluator
     * @param {Context} context Encryption context
     * @returns {Evaluator} An evaluator instance to be used to perform homomorphic evaluations
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const evaluator = Morfix.Evaluator(context)
     */
    Evaluator,

    /**
     * @description
     * Get the Exception singleton. Users should have little use
     * for this static instance as it is used internally.
     *
     * @readonly
     * @name SEAL#Exception
     * @type {Exception}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * try {
     *   <WASM method which is throwing>
     * } catch (e) {
     *   throw Morfix.Exception.safe(e)
     * }
     */
    Exception,

    /**
     *
     * @description
     * Class to store Galois keys.
     *
     * @par Slot Rotations
     * Galois keys are used together with batching (BatchEncoder). If the polynomial modulus
     * is a polynomial of degree N, in batching the idea is to view a PlainText polynomial as
     * a 2-by-(N/2) matrix of integers modulo PlainText modulus. Normal homomorphic computations
     * operate on such encrypted matrices element (slot) wise. However, special rotation
     * operations allow us to also rotate the matrix rows cyclically in either direction, and
     * rotate the columns (swap the rows). These operations require the Galois keys.
     *
     * @par Thread Safety
     * In general, reading from GaloisKeys is thread-safe as long as no other thread is
     * concurrently mutating it. This is due to the underlying data structure storing the
     * Galois keys not being thread-safe.
     *
     * @see {@link SecretKey} for the class that stores the secret key.
     * @see {@link PublicKey} for the class that stores the public key.
     * @see {@link RelinKeys} for the class that stores the relinearization keys.
     * @see {@link KeyGenerator} for the class that generates the galois keys.
     *
     * @function
     * @name SEAL#GaloisKeys
     * @returns {GaloisKeys} An empty GaloisKeys instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * // Generate an empty key and load from a base64 string
     * const galoisKeys = Morfix.GaloisKeys()
     * galoisKeys.load(context, <base64 string>)
     *
     * // Or generate them from a KeyGenerator
     * const keyGenerator = Morfix.KeyGenerator(context)
     * const galoisKeys = keyGenerator.genGaloisKeys()
     */
    GaloisKeys,

    /**
     * @description
     * Encodes integers into PlainText polynomials that Encryptor can encrypt. An instance of
     * the IntegerEncoder class converts an integer into a PlainText polynomial by placing its
     * binary digits as the coefficients of the polynomial. Decoding the integer amounts to
     * evaluating the PlainText polynomial at x=2.
     *
     * Addition and multiplication on the integer side translate into addition and multiplication
     * on the encoded PlainText polynomial side, provided that the length of the polynomial
     * never grows to be of the size of the polynomial modulus (PolyModulus), and that the
     * coefficients of the PlainText polynomials appearing throughout the computations never
     * experience coefficients larger than the PlainText modulus (PlainModulus).
     *
     * @par Negative Integers
     * Negative integers are represented by using -1 instead of 1 in the binary representation,
     * and the negative coefficients are stored in the PlainText polynomials as unsigned integers
     * that represent them modulo the PlainText modulus. Thus, for example, a coefficient of -1
     * would be stored as a polynomial coefficient PlainModulus-1.
     *
     * @function
     * @name SEAL#IntegerEncoder
     * @param {Context} context Encryption context
     * @returns {IntegerEncoder} An IntegerEncoder to be used for encoding only integers to PlainTexts
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const integerEncoder = Morfix.IntegerEncoder(context)
     */
    IntegerEncoder,

    /**
     * @description
     * Generates matching secret key and public key. An existing KeyGenerator can
     * also at any time be used to generate relinearization keys and Galois keys.
     * Constructing a KeyGenerator requires only a Context.
     *
     * @see {@link EncryptionParameters} for more details on encryption parameters.
     * @see {@link SecretKey} for more details on secret key.
     * @see {@link PublicKey} for more details on public key.
     * @see {@link RelinKeys} for more details on relinearization keys.
     * @see {@link GaloisKeys} for more details on Galois keys.
     *
     * @function
     * @name SEAL#KeyGenerator
     * @param {Context} context Encryption context
     * @param {SecretKey} [secretKey=null] Previously generated SecretKey
     * @param {PublicKey} [publicKey=null] Previously generated PublicKey
     * @returns {KeyGenerator} A KeyGenerator to be used to generate keys depending on how it was initialized
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * // Creating a KeyGenerator automatically creates an internal Secret and Public key pair
     * const keyGenerator = Morfix.KeyGenerator(context)
     *
     * // Optionally, pass in an existing SecetKey
     * const keyGenerator = Morfix.KeyGenerator(context, secretKey)
     *
     * // In addition, pass in an existing PublicKey with a SecetKey to avoid unnecessary key generation
     * const keyGenerator = Morfix.KeyGenerator(context, secretKey, publicKey)
     */
    KeyGenerator,

    /**
     * @description
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
     * assigning MemoryPoolHandle.Global() or MemoryPoolHandle.New() to it.
     *
     * @par Managing Lifetime
     * Internally, the MemoryPoolHandle wraps an std::shared_ptr pointing to
     * a memory pool class. Thus, as long as a MemoryPoolHandle pointing to
     * a particular memory pool exists, the pool stays alive. Classes such as
     * Evaluator and CipherText store their own local copies of a MemoryPoolHandle
     * to guarantee that the pool stays alive as long as the managing object
     * itself stays alive. The global memory pool is implemented as a global
     * std::shared_ptr to a memory pool class, and is thus expected to stay
     * alive for the entire duration of the program execution. Note that it can
     * be problematic to create other global objects that use the memory pool
     * e.g. in their constructor, as one would have to ensure the initialization
     * order of these global variables to be correct (i.e. global memory pool
     * first).
     *
     * @readonly
     * @name SEAL#MemoryPoolHandle
     * @type {MemoryPoolHandle}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encryptor = Morfix.Encryptor(context, publicKey)
     * encryptor.encrypt(plainText, cipherText, Morfix.MemoryPoolHandle.global)
     */
    MemoryPoolHandle,

    /**
     * @description
     * The EncryptionParameters class maintains at all times a 256-bit hash of the
     * currently set encryption parameters called the ParmsIdType. This hash acts as
     * a unique identifier of the encryption parameters and is used by all further
     * objects created for these encryption parameters. The ParmsIdType is not intended
     * to be directly modified by the user but is used internally for pre-computation
     * data lookup and input validity checks. In modulus switching the user can use
     * the ParmsIdType to keep track of the chain of encryption parameters. The ParmsIdType
     * is not exposed in the public API of EncryptionParameters, but can be accessed
     * through the Context.ContextData class once the Context has been created.
     *
     * @private
     * @name SEAL#ParmsIdType
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     * const context = Morfix.Context(encParms, true, Morfix.SecurityLevel.tc128)
     * const parmsId = context.firstParmsId
     */
    ParmsIdType,

    /**
     * @description
     * Contains static methods for creating a PlainText modulus easily
     *
     * @readonly
     * @name SEAL#PlainModulus
     * @type {PlainModulus}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const polyModulusDegree = 4096
     * const bitSize = 20
     * const smallModulus = Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
     */
    PlainModulus,

    /**
     * @description
     * Create an instance of a PlainText. The data for the PlainText is a polynomial
     * with coefficients modulo the PlainText modulus. The degree of the PlainText
     * polynomial must be one less than the degree of the polynomial modulus. The
     * backing array always allocates one 64-bit word per each coefficient of the
     * polynomial.
     *
     * @par Memory Management
     * The coefficient count of a PlainText refers to the number of word-size
     * coefficients in the PlainText, whereas its capacity refers to the number of
     * word-size coefficients that fit in the current memory allocation. In high-
     * performance applications unnecessary re-allocations should be avoided by
     * reserving enough memory for the PlainText to begin with either by providing
     * the desired capacity to the constructor as an extra argument, or by calling
     * the reserve function at any time.
     *
     * When the scheme is SchemeType.BFV each coefficient of a PlainText is a 64-bit
     * word, but when the scheme is SchemeType.CKKS the PlainText is by default
     * stored in an NTT transformed form with respect to each of the primes in the
     * coefficient modulus. Thus, the size of the allocation that is needed is the
     * size of the coefficient modulus (number of primes) times the degree of the
     * polynomial modulus. In addition, a valid CKKS PlainText also store the parmsId
     * for the corresponding encryption parameters.
     *
     * @par Thread Safety
     * In general, reading from PlainText is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the PlainText not being thread-safe.
     *
     * @see {@link CipherText} for the class that stores CipherTexts.
     *
     * @function
     * @name SEAL#PlainText
     * @param {PlainText} [instance=null] A WASM instance
     * @returns {PlainText} An empty PlainText instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const plainText = Morfix.PlainText()
     */
    PlainText,

    /**
     * @description
     * Create an instance of a PublicKey. This key is used to encrypt PlainTexts
     *
     * @par Thread Safety
     * In general, reading from PublicKey is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the public key not being thread-safe.
     *
     * @see {@link KeyGenerator} for the class that generates the public key.
     * @see {@link SecretKey} for the class that stores the secret key.
     * @see {@link RelinKeys} for the class that stores the relinearization keys.
     * @see {@link GaloisKeys} for the class that stores the galois keys.
     *
     * @function
     * @name SEAL#PublicKey
     * @returns {PublicKey} An empty PublicKey instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * // Generate an empty key and load from a base64 string
     * const publicKey = Morfix.PublicKey()
     * publicKey.load(context, <base64 string>)
     *
     * // Or generate them from a KeyGenerator
     * const keyGenerator = Morfix.KeyGenerator(context)
     * const publicKey = keyGenerator.getPublicKey()
     */
    PublicKey,

    /**
     * @description
     * Create an instance of a RelinKey. This key is used to perform relinearization
     * on CipherTexts.
     *
     * @par Relinearization
     * Freshly encrypted CipherTexts have a size of 2, and multiplying CipherTexts
     * of sizes K and L results in a CipherText of size K+L-1. Unfortunately, this
     * growth in size slows down further multiplications and increases noise growth.
     * Relinearization is an operation that has no semantic meaning, but it reduces
     * the size of CipherTexts back to 2. Microsoft SEAL can only relinearize size 3
     * CipherTexts back to size 2, so if the CipherTexts grow larger than size 3,
     * there is no way to reduce their size. Relinearization requires an instance of
     * RelinKeys to be created by the secret key owner and to be shared with the
     * evaluator. Note that plain multiplication is fundamentally different from
     * normal multiplication and does not result in CipherText size growth.
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
     * @see {@link SecretKey} for the class that stores the secret key.
     * @see {@link PublicKey} for the class that stores the public key.
     * @see {@link GaloisKeys} for the class that stores the galois keys.
     * @see {@link KeyGenerator} for the class that generates the relinearization keys.
     *
     * @function
     * @name SEAL#RelinKeys
     * @returns {RelinKeys} An empty RelinKeys instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * // Generate an empty key and load from a base64 string
     * const relinKeys = Morfix.RelinKeys()
     * relinKeys.load(context, <base64 string>)
     *
     * // Or generate them from a KeyGenerator
     * const keyGenerator = Morfix.KeyGenerator(context)
     * const relinKeys = keyGenerator.genRelinKeys()
     */
    RelinKeys,

    /**
     * @description
     * The SchemeType singleton
     *
     * @readonly
     * @name SEAL#SchemeType
     * @type {SchemeType}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     */
    SchemeType,

    /**
     * @description
     * Create an instance of a SecretKey. This key is used to decrypt CipherTexts.
     *
     * @par Thread Safety
     * In general, reading from SecretKey is thread-safe as long as no other thread
     * is concurrently mutating it. This is due to the underlying data structure
     * storing the secret key not being thread-safe.
     *
     * @see {@link KeyGenerator} for the class that generates the secret key.
     * @see {@link PublicKey} for the class that stores the public key.
     * @see {@link RelinKeys} for the class that stores the relinearization keys.
     * @see {@link GaloisKeys} for the class that stores the galois keys.
     *
     * @function
     * @name SEAL#SecretKey
     * @returns {SecretKey} An empty SecretKey instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * // Generate an empty key and load from a base64 string
     * const secretKey = Morfix.SecretKey()
     * secretKey.load(context, <base64 string>)
     *
     * // Or generate them from a KeyGenerator
     * const keyGenerator = Morfix.KeyGenerator(context)
     * const secretKey = keyGenerator.getSecretKey()
     */
    SecretKey,

    /**
     * @description
     * Represents a standard security level according to the HomomorphicEncryption.org
     * security standard. The value SecurityLevel.none signals that no standard
     * security level should be imposed. The value SecurityLevel.tc128 provides
     * a very high level of security and is the default security level enforced by
     * Microsoft SEAL when constructing a Context object. Normal users should not
     * have to specify the security level explicitly anywhere.
     *
     * @readonly
     * @name SEAL#SecurityLevel
     * @type {SecurityLevel}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const encParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
     * const context = Morfix.Context(encParms, true, Morfix.SecurityLevel.tc128)
     */
    SecurityLevel,

    /**
     * @description
     * Create an instance of a SmallModulus
     *
     * @function
     * @name SEAL#SmallModulus
     * @returns {SmallModulus} An empty SmallModulus instance
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const smallModulus = Morfix.SmallModulus()
     * smallModulus.setValue('5')
     */
    SmallModulus,

    /**
     * @description
     * Create an instance of a C++ Vector
     *
     * @private
     * @function
     * @name SEAL#Vector
     * @param {Int32Array|Uint32Array|Float64Array} array Typed Array of data
     * @returns {Vector} Vector containing the typed data
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const vectorInt32 = Morfix.Vector(Int32Array.from([1, 2, 3]))
     * const vectorUint32 = Morfix.Vector(Uint32Array.from([1, 2, 3]))
     * const vectorFloat64 = Morfix.Vector(Float64Array.from([1.11, 2.22, 3.33]))
     */
    Vector,

    /**
     * @description
     * Utility helper to accelerate mathematically intense operations in WebAssembly
     *
     * @readonly
     * @name SEAL#Util
     * @type {Util}
     * @example
     * import { Seal } from 'node-seal'
     * const Morfix = await Seal
     * ...
     * const gcd = Morfix.Util.gcd(BigInt(978), BigInt(384778233434))
     */
    Util
  }
}
