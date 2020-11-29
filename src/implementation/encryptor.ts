import { LoaderOptions, Library, Instance } from './seal'
import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'
import { CipherText, CipherTextConstructorOptions } from './cipher-text'
import { Context } from './context'
import { Serializable, SerializableConstructorOptions } from './serializable'
import { PublicKey } from './public-key'
import { SecretKey } from './secret-key'
import { PlainText } from './plain-text'

export type EncryptorDependencyOptions = {
  readonly Exception: Exception
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly CipherText: CipherTextConstructorOptions
  readonly Serializable: SerializableConstructorOptions
}

export type EncryptorDependencies = {
  ({
    Exception,
    MemoryPoolHandle,
    CipherText,
    Serializable
  }: EncryptorDependencyOptions): EncryptorConstructorOptions
}

export type EncryptorConstructorOptions = {
  (context: Context, publicKey: PublicKey, secretKey?: SecretKey): Encryptor
}

export type Encryptor = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly encrypt: (
    plainText: PlainText,
    cipherText?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly encryptSerializable: (
    plainText: PlainText,
    pool?: MemoryPoolHandle
  ) => Serializable
  readonly encryptSymmetric: (
    plainText: PlainText,
    cipherText?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly encryptSymmetricSerializable: (
    plainText: PlainText,
    pool?: MemoryPoolHandle
  ) => Serializable
  readonly encryptZero: (
    cipherText?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly encryptZeroSerializable: (pool?: MemoryPoolHandle) => Serializable
}

const EncryptorConstructor = (library: Library): EncryptorDependencies => ({
  Exception,
  MemoryPoolHandle,
  CipherText,
  Serializable
}: EncryptorDependencyOptions): EncryptorConstructorOptions => (
  context,
  publicKey,
  secretKey
): Encryptor => {
  const Constructor = library.Encryptor
  let _instance = constructInstance(context, publicKey, secretKey)

  function constructInstance(
    context: Context,
    publicKey: PublicKey,
    secretKey?: SecretKey
  ) {
    try {
      if (secretKey) {
        return new Constructor(
          context.instance,
          publicKey.instance,
          secretKey.instance
        )
      }
      return new Constructor(context.instance, publicKey.instance)
    } catch (e) {
      throw Exception.safe(e)
    }
  }
  /**
   * @implements Encryptor
   */

  /**
   * @interface Encryptor
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Encryptor#instance
     * @type {Instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name Encryptor#unsafeInject
     * @param {Instance} instance WASM instance
     */
    unsafeInject(instance: Instance) {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name Encryptor#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
    },

    /**
     * Encrypts a PlainText and stores the result in the destination parameter.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encrypt
     * @param {PlainText} plainText PlainText to encrypt
     * @param {CipherText} [cipherText] CipherText destination to store the encrypted result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} Returns undefined if a CipherText was specified. Otherwise returns a
     * CipherText containing the encrypted result
     */
    encrypt(
      plainText: PlainText,
      cipherText?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (cipherText) {
          _instance.encrypt(plainText.instance, cipherText.instance, pool)
          return
        }
        const cipher = CipherText()
        _instance.encrypt(plainText.instance, cipher.instance, pool)
        return cipher
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Encrypts a PlainText and returns a CipherText as a Serializable object.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encryptSerializable
     * @param {PlainText} plainText PlainText to encrypt
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {Serializable<CipherText>} A Serializable containing the encrypted result
     */
    encryptSerializable(
      plainText: PlainText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): Serializable {
      try {
        const temp = Serializable()
        const instance = _instance.encryptSerializable(plainText.instance, pool)
        temp.unsafeInject(instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Encrypts a PlainText with the secret key and stores the result in
     * destination.
     *
     * The encryption parameters for the resulting CipherText
     * correspond to:
     * 1) in BFV, the highest (data) level in the modulus switching chain,
     * 2) in CKKS, the encryption parameters of the plaintext.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encryptSymmetric
     * @param {PlainText} plainText PlainText to encrypt
     * @param {CipherText} [cipherText] CipherText destination to store the encrypted result.
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} Returns undefined if a CipherText was specified. Otherwise returns a
     * CipherText containing the encrypted result
     */
    encryptSymmetric(
      plainText: PlainText,
      cipherText?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (cipherText) {
          _instance.encryptSymmetric(
            plainText.instance,
            cipherText.instance,
            pool
          )
          return
        }
        const cipher = CipherText()
        _instance.encryptSymmetric(plainText.instance, cipher.instance, pool)
        return cipher
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Encrypts a plaintext with the secret key and returns the ciphertext as
     * a serializable object.
     *
     * The encryption parameters for the resulting CipherText
     * correspond to:
     * 1) in BFV, the highest (data) level in the modulus switching chain,
     * 2) in CKKS, the encryption parameters of the plaintext.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * Half of the ciphertext data is pseudo-randomly generated from a seed to
     * reduce the object size. The resulting serializable object cannot be used
     * directly and is meant to be serialized for the size reduction to have an
     * impact.
     *
     * @function
     * @name Encryptor#encryptSymmetricSerializable
     * @param {PlainText} plainText PlainText to encrypt
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {Serializable<CipherText>} Returns a Serializable containing the encrypted result
     */
    encryptSymmetricSerializable(
      plainText: PlainText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): Serializable {
      try {
        const serialized = Serializable()
        const instance = _instance.encryptSymmetricSerializable(
          plainText.instance,
          pool
        )
        serialized.unsafeInject(instance)
        return serialized
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     *
     * Encrypts a zero plaintext with the public key and returns the ciphertext
     * as a serializable object.
     *
     * The encryption parameters for the resulting ciphertext correspond to the
     * highest (data) level in the modulus switching chain. Dynamic memory
     * allocations in the process are allocated from the memory pool pointed to
     * by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encryptZero
     * @param {CipherText} [cipherText] A CipherText to overwrite.
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} Returns undefined if a CipherText was specified. Otherwise returns a
     * CipherText containing the encrypted result
     */
    encryptZero(
      cipherText?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (cipherText) {
          _instance.encryptZero(cipherText.instance, pool)
          return
        }
        const cipher = CipherText()
        _instance.encryptZero(cipher.instance, pool)
        return cipher
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     *
     * Encrypts a zero plaintext with the public key and stores the result in
     * destination.
     *
     * The encryption parameters for the resulting ciphertext correspond to the
     * highest (data) level in the modulus switching chain. Dynamic memory
     * allocations in the process are allocated from the memory pool pointed to
     * by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encryptZeroSerializable
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {Serializable<CipherText>} A CipherText as a serialized object containing the encrypted result
     */
    encryptZeroSerializable(
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): Serializable {
      try {
        const serialized = Serializable()
        const instance = _instance.encryptZeroSerializable(pool)
        serialized.unsafeInject(instance)
        return serialized
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}

export const EncryptorInit = ({
  loader
}: LoaderOptions): EncryptorDependencies => {
  const library: Library = loader.library
  return EncryptorConstructor(library)
}
