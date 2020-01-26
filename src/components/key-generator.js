import { Exception } from './exception'
import { PublicKey } from './public-key'
import { SecretKey } from './secret-key'
import { RelinKeys } from './relin-keys'
import { GaloisKeys } from './galois-keys'

export const KeyGenerator = ({
  library,
  context,
  secretKey = null,
  publicKey = null
}) => {
  const _Exception = Exception({ library })
  const _library = library
  const constructInstance = (secretKey, publicKey) => {
    try {
      if (secretKey && publicKey) {
        return new library.KeyGenerator(
          context.instance,
          secretKey.instance,
          publicKey.instance
        )
      }
      if (secretKey && !publicKey) {
        return new library.KeyGenerator(context.instance, secretKey.instance)
      }
      return new library.KeyGenerator(context.instance)
    } catch (e) {
      throw _Exception.safe({ error: e })
    }
  }
  let _instance = constructInstance(secretKey, publicKey)

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
     * @name KeyGenerator#inject
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
     * @name KeyGenerator#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Return the generated SecretKey
     *
     * @function
     * @name KeyGenerator#getSecretKey
     * @returns {SecretKey} The secret key that was generated upon instantiation of this KeyGenerator
     */
    getSecretKey() {
      try {
        const instance = _instance.getSecretKey()
        const key = SecretKey({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Return the generated PublicKey
     *
     * @function
     * @name KeyGenerator#getPublicKey
     * @returns {PublicKey} The public key that was generated upon instantiation of this KeyGenerator
     */
    getPublicKey() {
      try {
        const instance = _instance.getPublicKey()
        const key = PublicKey({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Generate and return a set of RelinKeys
     *
     * @function
     * @name KeyGenerator#genRelinKeys
     * @returns {RelinKeys} New RelinKeys from the KeyGenerator's internal secret key
     */
    genRelinKeys() {
      try {
        const instance = _instance.createRelinKeys()
        const key = RelinKeys({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Generate and return a set of GaloisKeys
     *
     * @function
     * @name KeyGenerator#genGaloisKeys
     * @returns {GaloisKeys} New GaloisKeys from the KeyGenerator's internal secret key
     */
    genGaloisKeys() {
      try {
        const instance = _instance.createGaloisKeys()
        const key = GaloisKeys({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
