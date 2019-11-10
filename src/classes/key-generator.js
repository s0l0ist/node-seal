import { PublicKey } from './public-key'
import { SecretKey } from './secret-key'
import { RelinKeys } from './relin-keys'
import { GaloisKeys } from './galois-keys'

export class KeyGenerator {
  constructor({library, context, secretKey = null, publicKey = null}) {

    // Ref to main lib
    this._library = library

    // Library constructors
    this._GaloisKeys = library.GaloisKeys
    this._RelinKeys = library.RelinKeys
    this._PublicKey = library.PublicKey
    this._SecretKey = library.SecretKey
    this._KeyGenerator = library.KeyGenerator

    if (secretKey && publicKey) {
      this._instance = new this._KeyGenerator(context.instance, secretKey.instance, publicKey.instance)
      return
    }
    if (secretKey && !publicKey) {
      this._instance = new this._KeyGenerator(context.instance, secretKey.instance)
      return
    }
    this._instance = new this._KeyGenerator(context.instance)
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      this._instance.delete()
      this._instance = null
    }
    this._instance = instance
  }

  /**
   * Return the generated PublicKey
   *
   * @returns {PublicKey}
   */
  getPublicKey() {
    const instance = this._instance.getPublicKey()
    const key = new PublicKey({library: this._library})
    key.inject({instance})
    return key
  }

  /**
   * Return the generated SecretKey
   *
   * @returns {SecretKey}
   */
  getSecretKey() {
    const instance = this._instance.getSecretKey()
    const key = new SecretKey({library: this._library})
    key.inject({instance})
    return key
  }

  /**
   * Generate and return a set of RelinKeys
   *
   * @returns {RelinKeys}
   */
  genRelinKeys() {
    const instance = this._instance.createRelinKeys()
    const key = new RelinKeys({library: this._library})
    key.inject({instance})
    return key
  }

  /**
   * Generate and return a set of GaloisKeys
   *
   * @returns {GaloisKeys}
   */
  genGaloisKeys() {
    const instance = this._instance.createGaloisKeys()
    const key = new GaloisKeys({library: this._library})
    key.inject({instance})
    return key
  }
}
