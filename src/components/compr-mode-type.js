export const ComprModeType = ({ library }) => {
  const _none = library.ComprModeType.none
  const _deflate = library.ComprModeType.deflate

  return {
    /**
     * Return the `none` Compression Mode Type
     * @returns {ComprModeType} - enum for this type
     */
    get none() {
      return _none
    },

    /**
     * Return the `deflate` Compression Mode Type
     * @returns {ComprModeType} - enum for this type
     */
    get deflate() {
      return _deflate
    }
  }
}
