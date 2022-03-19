import { LoaderOptions, Library, Instance } from './seal'
import { Exception, SealError } from './exception'
import { Context } from './context'
import { SecretKey, SecretKeyConstructorOptions } from './secret-key'
import { RelinKeys, RelinKeysConstructorOptions } from './relin-keys'
import { Serializable, SerializableConstructorOptions } from './serializable'
import { PublicKey, PublicKeyConstructorOptions } from './public-key'
import { GaloisKeys, GaloisKeysConstructorOptions } from './galois-keys'

export type KeyGeneratorDependencyOptions = {
  readonly Exception: Exception
  readonly PublicKey: PublicKeyConstructorOptions
  readonly SecretKey: SecretKeyConstructorOptions
  readonly RelinKeys: RelinKeysConstructorOptions
  readonly GaloisKeys: GaloisKeysConstructorOptions
  readonly Serializable: SerializableConstructorOptions
}

export type KeyGeneratorDependencies = {
  ({
    Exception,
    PublicKey,
    SecretKey,
    RelinKeys,
    GaloisKeys,
    Serializable
  }: KeyGeneratorDependencyOptions): KeyGeneratorConstructorOptions
}

export type KeyGeneratorConstructorOptions = {
  (context: Context, secretKey?: SecretKey): KeyGenerator
}

export type KeyGenerator = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly secretKey: () => SecretKey
  readonly createPublicKeySerializable: () => Serializable
  readonly createPublicKey: () => PublicKey
  readonly createRelinKeysSerializable: () => Serializable
  readonly createRelinKeys: () => RelinKeys
  readonly createGaloisKeysSerializable: (steps?: Int32Array) => Serializable
  readonly createGaloisKeys: (steps?: Int32Array) => GaloisKeys
}

const KeyGeneratorConstructor =
  (library: Library): KeyGeneratorDependencies =>
    ({
      Exception,
      PublicKey,
      SecretKey,
      RelinKeys,
      GaloisKeys,
      Serializable
    }: KeyGeneratorDependencyOptions): KeyGeneratorConstructorOptions =>
      (context, secretKey): KeyGenerator => {
        const Constructor = library.KeyGenerator
        let _instance = constructInstance(context, secretKey)

        function constructInstance(context: Context, secretKey?: SecretKey) {
          try {
            if (secretKey) {
              return new Constructor(context.instance, secretKey.instance)
            }
            return new Constructor(context.instance)
          } catch (e) {
            throw Exception.safe(e as SealError)
          }
        }
        /**
         * @implements KeyGenerator
         */

        /**
         * @interface KeyGenerator
         */
        return {
          /**
           * Get the underlying WASM instance
           *
           * @private
           * @readonly
           * @name KeyGenerator#instance
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
           * @name KeyGenerator#unsafeInject
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
           * @name KeyGenerator#delete
           */
          delete() {
            if (_instance) {
              _instance.delete()
              _instance = undefined
            }
          },

          /**
           * Return the generated SecretKey
           *
           * @function
           * @name KeyGenerator#secretKey
           * @returns {SecretKey} The secret key that was generated upon instantiation of this KeyGenerator
           */
          secretKey(): SecretKey {
            try {
              const key = SecretKey()
              const instance = _instance.secretKey()
              key.inject(instance)
              return key
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Create a new PublicKey instance
           *
           * @function
           * @name KeyGenerator#createPublicKey
           * @returns {PublicKey} A new PublicKey instance
           */
          createPublicKey(): PublicKey {
            try {
              const key = PublicKey()
              _instance.createPublicKey(key.instance)
              return key
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Create a new, Serializable PublicKey instance
           *
           * @function
           * @name KeyGenerator#createPublicKeySerializable
           * @returns {Serializable<PublicKey>} A new, serializable, PublicKey instance
           */
          createPublicKeySerializable(): Serializable {
            try {
              const serialized = Serializable()
              const instance = _instance.createPublicKeySerializable()
              serialized.unsafeInject(instance)
              return serialized
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Generates and returns relinearization keys. This function returns
           * relinearization keys in a fully expanded form and is meant to be used
           * primarily for demo, testing, and debugging purposes.
           *
           * @function
           * @name KeyGenerator#createRelinKeys
           * @returns {RelinKeys} New RelinKeys from the KeyGenerator's internal secret key
           */
          createRelinKeys(): RelinKeys {
            try {
              const keys = RelinKeys()
              _instance.createRelinKeys(keys.instance)
              return keys
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Generates and returns relinearization keys as a serializable object.
           *
           * Half of the key data is pseudo-randomly generated from a seed to reduce
           * the object size. The resulting serializable object cannot be used
           * directly and is meant to be serialized for the size reduction to have an
           * impact.
           *
           *
           * @function
           * @name KeyGenerator#createRelinKeysSerializable
           * @returns {Serializable<RelinKeys>} New, serializable RelinKeys from the KeyGenerator's internal secret key
           */
          createRelinKeysSerializable(): Serializable {
            try {
              const serialized = Serializable()
              const instance = _instance.createRelinKeysSerializable()
              serialized.unsafeInject(instance)
              return serialized
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Generates and returns Galois keys. This function returns Galois keys in
           * a fully expanded form and is meant to be used primarily for demo, testing,
           * and debugging purposes. The user can optionally give an input a vector of desired
           * Galois rotation step counts, where negative step counts correspond to
           * rotations to the right and positive step counts correspond to rotations to
           * the left. A step count of zero can be used to indicate a column rotation
           * in the BFV scheme complex conjugation in the CKKS scheme.
           *
           * @function
           * @name KeyGenerator#createGaloisKeys
           * @param {Int32Array} [steps=Int32Array.from([])] Specific Galois Elements to generate
           * @returns {GaloisKeys} New GaloisKeys from the KeyGenerator's internal secret key
           */
          createGaloisKeys(steps: Int32Array = Int32Array.from([])): GaloisKeys {
            try {
              const keys = GaloisKeys()
              _instance.createGaloisKeys(steps, keys.instance)
              return keys
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Generates and returns Galois keys as a serializable object. This function
           * creates specific Galois keys that can be used to apply specific Galois
           * automorphisms on encrypted data. The user can optionally give an input a vector
           * of desired Galois rotation step counts, where negative step counts
           * correspond to rotations to the right and positive step counts correspond
           * to rotations to the left. A step count of zero can be used to indicate
           * a column rotation in the BFV scheme complex conjugation in the CKKS scheme.
           * Half of the key data is pseudo-randomly generated from a seed to reduce
           * the object size. The resulting serializable object cannot be used
           * directly and is meant to be serialized for the size reduction to have an
           * impact.
           *
           * @function
           * @name KeyGenerator#createGaloisKeysSerializable
           * @param {Int32Array} [steps=Int32Array.from([])] Specific Galois Elements to generate
           * @returns {Serializable<GaloisKeys>} Base64 encoded string
           */
          createGaloisKeysSerializable(
            steps: Int32Array = Int32Array.from([])
          ): Serializable {
            try {
              const serialized = Serializable()
              const instance = _instance.createGaloisKeysSerializable(steps)
              serialized.unsafeInject(instance)
              return serialized
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          }
        }
      }

export const KeyGeneratorInit = ({
  loader
}: LoaderOptions): KeyGeneratorDependencies => {
  const library: Library = loader.library
  return KeyGeneratorConstructor(library)
}
