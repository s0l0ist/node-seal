export const ComprModeType = ({ library }) => {
  const _none = library.ComprModeType.none
  const _deflate = library.ComprModeType.deflate

  /**
   * @implements ComprModeType
   */

  /**
   * @interface ComprModeType
   */
  return {
    /**
     * The `none` Compression Mode Type
     *
     * @readonly
     * @name ComprModeType.none
     * @type {ComprModeType.none}
     */
    get none() {
      /**
       * @typedef {ComprModeType.none} ComprModeType.none
       */
      return _none
    },

    /**
     * The `deflate` Compression Mode Type
     *
     * @readonly
     * @name ComprModeType.deflate
     * @type {ComprModeType.deflate}
     */
    get deflate() {
      /**
       * @typedef {ComprModeType.deflate} ComprModeType.deflate
       */
      return _deflate
    }
  }
}
