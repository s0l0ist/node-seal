export const SchemeType = ({ library }) => {
  const _none = library.SchemeType.none
  const _BFV = library.SchemeType.BFV
  const _CKKS = library.SchemeType.CKKS

  /**
   * @implements SchemeType
   */

  /**
   * @interface SchemeType
   */
  return {
    /**
     * Return the 'none' scheme type
     *
     * @name SchemeType.none
     * @type {SchemeType.none}
     */
    get none() {
      /**
       * @typedef {SchemeType.none} SchemeType.none
       */
      return _none
    },

    /**
     * Return the 'BFV' scheme type
     *
     * @name SchemeType.BFV
     * @type {SchemeType.BFV}
     */
    get BFV() {
      /**
       * @typedef {SchemeType.BFV} SchemeType.BFV
       */
      return _BFV
    },

    /**
     * Return the 'CKKS' scheme type
     *
     * @name SchemeType.CKKS
     * @type {SchemeType.CKKS}
     */
    get CKKS() {
      /**
       * @typedef {SchemeType.CKKS} SchemeType.CKKS
       */
      return _CKKS
    }
  }
}
