/**
 * ComprModeType
 * @typedef {Object} ComprModeType
 * @constructor
 */
export const ComprModeType = ({ library }) => {
  const _none = library.ComprModeType.none
  const _deflate = library.ComprModeType.deflate

  return {
    /**
     * Return the `none` Compression Mode Type
     * @returns {ComprModeType.none} Compression mode 'none'
     */
    get none() {
      return _none
    },

    /**
     * Return the `deflate` Compression Mode Type
     * @returns {ComprModeType.deflate} Compression mode 'deflate'
     */
    get deflate() {
      return _deflate
    }
  }
}
