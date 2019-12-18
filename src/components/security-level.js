/**
 * SecurityLevel
 * @typedef {Object} SecurityLevel
 * @constructor
 */
export const SecurityLevel = ({ library }) => {
  const _none = library.SecLevelType.none
  const _tc128 = library.SecLevelType.tc128
  const _tc192 = library.SecLevelType.tc192
  const _tc256 = library.SecLevelType.tc256

  return {
    /**
     * Returns the 'none' security level
     * @returns {SecurityLevel.none} - none security level
     */
    get none() {
      return _none
    },

    /**
     * Returns the '128' security level
     * @returns {SecurityLevel.tc128} - 128 bit security level
     */
    get tc128() {
      return _tc128
    },

    /**
     * Returns the '192' security level
     * @returns {SecurityLevel.tc192} - 192 bit security level
     */
    get tc192() {
      return _tc192
    },

    /**
     * Returns the '256' security level
     * @returns {SecurityLevel.tc256} - 256 bit security level
     */
    get tc256() {
      return _tc256
    }
  }
}
