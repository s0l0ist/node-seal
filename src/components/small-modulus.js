export const SmallModulus = ({library}) => {

  const _saveToString = library.SmallModulus.saveToString
  // const _createFromString = library.SmallModulus.createFromString
  const _ComprModeType = library.ComprModeType
  let _instance = new library.SmallModulus()

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
      _instance.loadFromString(value + '')
    },

    /**
     Returns the value of the current SmallModulus as a string.

     It's a string because JS does not support uint64
     data type very well
     */
    value() {
      return _instance.Value()
    },

    /**
     Returns the significant bit count of the value of the current SmallModulus.
     */
    bitCount() {
      return _instance.bitCount()
    },

    /**
     Returns whether the value of the current SmallModulus is zero.
     */
    isZero() {
      return _instance.isZero()
    },

    /**
     Returns whether the value of the current SmallModulus is a prime number.
     */
    isPrime() {
      return _instance.isPrime()
    },

    /**
     * Save the SmallModulus as a base64 string
     *
     * @returns {*}
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      return _saveToString(compression)
    }
  }
}
