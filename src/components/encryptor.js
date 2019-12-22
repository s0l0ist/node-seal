import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

export const Encryptor = ({ library, context, publicKey }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })

  let _instance = null
  try {
    _instance = new library.Encryptor(context.instance, publicKey.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} Encryptor
   * @implements IEncryptor
   */

  /**
   * @interface IEncryptor
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IEncryptor#instance
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
     * @name IEncryptor#inject
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
     * Encrypts a PlainText and stores the result in the destination parameter.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name IEncryptor#encrypt
     * @param {Object} options Options
     * @param {PlainText} options.plainText PlainText to encrypt
     * @param {CipherText} options.cipherText CipherText destination to store the result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    encrypt({ plainText, cipherText, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.encrypt(plainText.instance, cipherText.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
