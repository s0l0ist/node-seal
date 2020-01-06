import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

export const SecretKey = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.SecretKey()
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} SecretKey
   * @implements ISecretKey
   */

  /**
   * @interface ISecretKey
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name ISecretKey#instance
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
     * @name ISecretKey#inject
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
     * @name ISecretKey#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Save the Encryption Parameters to a base64 string
     *
     * @function
     * @name ISecretKey#save
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression=ComprModeType.none] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    save({ compression = _ComprModeType.none } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Load a SecretKey from a base64 string
     *
     * @function
     * @name ISecretKey#load
     * @param {Object} options Options
     * @param {Context} options.context Encryption context to enforce
     * @param {String} options.encoded Base64 encoded string
     */
    load({ context, encoded }) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
