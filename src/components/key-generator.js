import { Exception } from './exception'
import { PublicKey } from './public-key'
import { SecretKey } from './secret-key'
import { RelinKeys } from './relin-keys'
import { GaloisKeys } from './galois-keys'

/**
 * KeyGenerator
 * @typedef {Object} KeyGenerator
 * @constructor
 */
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
      // eslint-disable-next-line no-nested-ternary
      throw new Error(
        typeof e === 'number'
          ? _Exception.getHuman(e)
          : e instanceof Error
          ? e.message
          : e
      )
    }
  }
  let _instance = constructInstance(secretKey, publicKey)

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     * @private
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {Object} options Options
     * @param {instance} options.instance wasm instance
     * @private
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Return the generated SecretKey
     * @returns {SecretKey} The secret key that was generated upon instantiation of this KeyGenerator
     */
    getSecretKey() {
      try {
        const instance = _instance.getSecretKey()
        const key = SecretKey({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Return the generated PublicKey
     * @returns {PublicKey} The public key that was generated upon instantiation of this KeyGenerator
     */
    getPublicKey() {
      try {
        const instance = _instance.getPublicKey()
        const key = PublicKey({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Generate and return a set of RelinKeys
     * @returns {RelinKeys} New RelinKeys from the KeyGenerator's internal secret key
     */
    genRelinKeys() {
      try {
        const instance = _instance.createRelinKeys()
        const key = RelinKeys({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Generate and return a set of GaloisKeys
     * @returns {GaloisKeys} New GaloisKeys from the KeyGenerator's internal secret key
     */
    genGaloisKeys() {
      try {
        const instance = _instance.createGaloisKeys()
        const key = GaloisKeys({ library: _library })
        key.inject({ instance })
        return key
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    }
  }
}
