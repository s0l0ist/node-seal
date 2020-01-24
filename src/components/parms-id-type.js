import { Exception } from './exception'

export const ParmsIdType = ({ library }) => {
  const _Exception = Exception({ library })
  let _instance = null
  try {
    _instance = new library.ParmsIdType()
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} ParmsIdType
   * @implements IParmsIdType
   */

  /**
   * @interface IParmsIdType
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IParmsIdType#instance
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
     * @name IParmsIdType#inject
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
     * @name IParmsIdType#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * The values of the current ParmsIdType as an Array of BigInts.
     *
     * @readonly
     * @name IParmsIdType#values
     * @type {Array<BigInt>}
     */
    get values() {
      try {
        const values = _instance.values()
        // eslint-disable-next-line no-undef
        return values.split(',').map(x => BigInt(x))
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
