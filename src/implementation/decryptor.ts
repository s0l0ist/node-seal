import { CipherText } from './cipher-text'
import { Context } from './context'
import { Exception, SealError } from './exception'
import { PlainText, PlainTextConstructorOptions } from './plain-text'
import { Instance, Library, LoaderOptions } from './seal'
import { SecretKey } from './secret-key'

export type DecryptorDependencyOptions = {
  readonly Exception: Exception
  readonly PlainText: PlainTextConstructorOptions
}

export type DecryptorDependencies = {
  ({
    Exception,
    PlainText
  }: DecryptorDependencyOptions): DecryptorConstructorOptions
}

export type DecryptorConstructorOptions = {
  (context: Context, secretKey: SecretKey): Decryptor
}

export type Decryptor = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly decrypt: (
    cipherText: CipherText,
    plainText?: PlainText
  ) => PlainText | void
  readonly invariantNoiseBudget: (cipherText: CipherText) => number
}

const DecryptorConstructor =
  (library: Library): DecryptorDependencies =>
  ({
    Exception,
    PlainText
  }: DecryptorDependencyOptions): DecryptorConstructorOptions =>
  (context, secretKey): Decryptor => {
    const Constructor = library.Decryptor
    let _instance: Instance
    try {
      _instance = new Constructor(context.instance, secretKey.instance)
    } catch (e) {
      throw Exception.safe(e as SealError)
    }
    /**
     * @implements Decryptor
     */

    /**
     * @interface Decryptor
     */
    return {
      /**
       * Get the underlying WASM instance
       *
       * @private
       * @readonly
       * @name Decryptor#instance
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
       * @name Decryptor#unsafeInject
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
       * @name Decryptor#delete
       */
      delete() {
        if (_instance) {
          _instance.delete()
          _instance = undefined
        }
      },

      /**
       * Decrypts a CipherText and stores the result in the destination parameter.
       *
       * @function
       * @name Decryptor#decrypt
       * @param {CipherText} cipherText CipherText to decrypt
       * @param {PlainText} [plainText] PlainText destination to store the decrypted result
       * @returns {PlainText|void} Returns undefined if a PlainText was specified. Otherwise returns a
       * PlainText containng the decrypted result
       */
      decrypt(cipherText: CipherText, plainText?: PlainText): PlainText | void {
        try {
          if (plainText) {
            _instance.decrypt(cipherText.instance, plainText.instance)
            return
          }
          const plain = PlainText()
          _instance.decrypt(cipherText.instance, plain.instance)
          return plain
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Computes the invariant noise budget (in bits) of a CipherText. The invariant
       * noise budget measures the amount of room there is for the noise to grow while
       * ensuring correct decryptions. This function works only with the BFV scheme.
       *
       * @par Invariant Noise Budget
       * The invariant noise polynomial of a CipherText is a rational coefficient
       * polynomial, such that a CipherText decrypts correctly as long as the
       * coefficients of the invariantnoise polynomial are of absolute value less
       * than 1/2. Thus, we call the infinity-norm of the invariant noise polynomial
       * the invariant noise, and for correct decryption requireit to be less than
       * 1/2. If v denotes the invariant noise, we define the invariant noise budget
       * as -log2(2v). Thus, the invariant noise budget starts from some initial
       * value, which depends on the encryption parameters, and decreases when
       * computations are performed. When the budget reaches zero, the CipherText
       * becomes too noisy to decrypt correctly.
       *
       * @function
       * @name Decryptor#invariantNoiseBudget
       * @param {CipherText} cipherText CipherText to measure
       * @returns {number} Invariant noise budget (in bits)
       */
      invariantNoiseBudget(cipherText: CipherText): number {
        try {
          return _instance.invariantNoiseBudget(cipherText.instance)
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      }
    }
  }

export const DecryptorInit = ({
  loader
}: LoaderOptions): DecryptorDependencies => {
  const library: Library = loader.library
  return DecryptorConstructor(library)
}
