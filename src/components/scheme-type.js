/**
 * SchemeType
 * @typedef {Object} SchemeType
 * @constructor
 */
export const SchemeType = ({ library }) => {
  const _none = library.SchemeType.none
  const _BFV = library.SchemeType.BFV
  const _CKKS = library.SchemeType.CKKS

  return {
    /**
     * Return the none scheme type
     * @returns {SchemeType.none} 'none' scheme type
     */
    get none() {
      return _none
    },

    /**
     * Return the BFV scheme type
     * @returns {SchemeType.BFV} 'BFV' scheme type
     */
    get BFV() {
      return _BFV
    },

    /**
     * Return the CKKS scheme type
     * @returns {SchemeType.CKKS} 'CKKS' scheme type
     */
    get CKKS() {
      return _CKKS
    }
  }
}
