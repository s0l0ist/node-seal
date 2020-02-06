import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'
import { CipherText } from './cipher-text'

export const Encryptor = ({ library, context, publicKey }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  const _library = library
  let _instance = null
  try {
    _instance = new library.Encryptor(context.instance, publicKey.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
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
     * @type {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name Encryptor#inject
     * @param {Object} options Options
     * @param {instance} options.instance WASM instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
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
        _instance = null
      }
    },

    /**
     * Encrypts a PlainText and stores the result in the destination parameter.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Encryptor#encrypt
     * @param {Object} options Options
     * @param {PlainText} options.plainText PlainText to encrypt
     * @param {CipherText} [options.cipherText] CipherText destination to store the encrypted result
     * @param {MemoryPoolHandle} [options.pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} Returns undefined if a CipherText was specified. Otherwise returns a
     * CipherText containng the enrypted result
     */
    encrypt({ plainText, cipherText, pool = _MemoryPoolHandle.global }) {
      try {
        if (cipherText) {
          _instance.encrypt(plainText.instance, cipherText.instance, pool)
          return
        }
        const cipher = CipherText({ library: _library })
        _instance.encrypt(plainText.instance, cipher.instance, pool)
        return cipher
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
