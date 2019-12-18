export const SmallModulus = ({library}) => {

  const _getException = library.getException
  const _saveToString = library.SmallModulus.saveToString
  // const _createFromString = library.SmallModulus.createFromString
  const _ComprModeType = library.ComprModeType
  let _instance = null
  try {
    _instance = new library.SmallModulus()
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
  }

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
     * Loads a SmallModulus from a string representing an uint64 value.
     *
     * @param value
     */
    setValue({value}) {
      try {
        _instance.loadFromString(value + '')
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    },

    /**
     * Returns the value of the current SmallModulus as a string.
     *
     * It's a string because JS does not support uint64
     * data type very well
     *
     * @returns {String} integer value of the SmallModulus
     */
    get value() {
      return _instance.Value()
    },

    /**
     Returns the significant bit count of the value of the current SmallModulus.
     */
    get bitCount() {
      return _instance.bitCount()
    },

    /**
     Returns whether the value of the current SmallModulus is zero.
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     Returns whether the value of the current SmallModulus is a prime number.
     */
    get isPrime() {
      return _instance.isPrime()
    },

    /**
     * Save the SmallModulus as a base64 string
     *
     * @returns {*}
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _saveToString(compression)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    }
  }
}
