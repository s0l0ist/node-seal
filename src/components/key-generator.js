import { PublicKey } from './public-key'
import { SecretKey } from './secret-key'
import { RelinKeys } from './relin-keys'
import { GaloisKeys } from './galois-keys'

export const KeyGenerator = ({library, context, secretKey = null, publicKey = null}) => {

  const constructInstance = (secretKey, publicKey) => {
    if (secretKey && publicKey) {
      return new library.KeyGenerator(context.instance, secretKey.instance, publicKey.instance)
    }
    if (secretKey && !publicKey) {
      return new library.KeyGenerator(context.instance, secretKey.instance)
    }
    return new library.KeyGenerator(context.instance)
  }

  const _library = library
  let _instance = constructInstance(secretKey, publicKey)

  return {
    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Return the generated SecretKey
     *
     * @returns {SecretKey}
     */
    getSecretKey() {
      const instance = _instance.getSecretKey()
      const key = SecretKey({library: _library})
      key.inject({instance})
      return key
    },

    /**
     * Return the generated PublicKey
     *
     * @returns {PublicKey}
     */
    getPublicKey() {
      const instance = _instance.getPublicKey()
      const key = PublicKey({library: _library})
      key.inject({instance})
      return key
    },

    /**
     * Generate and return a set of RelinKeys
     *
     * @returns {RelinKeys}
     */
    genRelinKeys() {
      const instance = _instance.createRelinKeys()
      const key = RelinKeys({library: _library})
      key.inject({instance})
      return key
    },

    /**
     * Generate and return a set of GaloisKeys
     *
     * @returns {GaloisKeys}
     */
    genGaloisKeys() {
      const instance = _instance.createGaloisKeys()
      const key = GaloisKeys({library: _library})
      key.inject({instance})
      return key
    }
  }
}
