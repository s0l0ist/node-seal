export const ComprModeType = ({ library }) => {
  const _none = library.ComprModeType.none
  const _deflate = library.ComprModeType.deflate

  /**
   * @typedef {Object} ComprModeType
   * @implements IComprModeType
   */

  /**
   * @interface IComprModeType
   */
  return {
    /**
     * The `none` Compression Mode Type
     *
     * @readonly
     * @name IComprModeType#none
     * @type {ComprModeType.none}
     */
    get none() {
      return _none
    },

    /**
     * The `deflate` Compression Mode Type
     *
     * @readonly
     * @name IComprModeType#deflate
     * @type {ComprModeType.deflate}
     */
    get deflate() {
      return _deflate
    }
  }
}
