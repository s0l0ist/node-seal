export const ComprModeType = ({library}) => {

  const _none = library.ComprModeType.none
  const _deflate = library.ComprModeType.deflate

  return {
    /**
     * Return the `none` Compression Mode Type
     *
     * @returns {number}
     */
    get none() {
      return _none
    },

    /**
     * Return the `deflate` Compression Mode Type
     *
     * @returns {number}
     */
    get deflate() {
      return _deflate
    }
  }
}
