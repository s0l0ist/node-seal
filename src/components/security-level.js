export const SecurityLevel = ({ library }) => {
  const _none = library.SecLevelType.none
  const _tc128 = library.SecLevelType.tc128
  const _tc192 = library.SecLevelType.tc192
  const _tc256 = library.SecLevelType.tc256

  /**
   * @typedef {Object} SecurityLevel
   * @implements ISecurityLevel
   */

  /**
   * @interface ISecurityLevel
   */
  return {
    /**
     * Returns the 'none' security level
     *
     * @name ISecurityLevel.none
     * @type {SecurityLevel.none}
     */
    get none() {
      return _none
    },

    /**
     * Returns the '128' security level
     *
     * @name ISecurityLevel.tc128
     * @type {SecurityLevel.tc128}
     */
    get tc128() {
      return _tc128
    },

    /**
     * Returns the '192' security level
     *
     * @name ISecurityLevel.tc192
     * @type {SecurityLevel.tc192}
     */
    get tc192() {
      return _tc192
    },

    /**
     * Returns the '256' security level
     *
     * @name ISecurityLevel.tc256
     * @type {SecurityLevel.tc256}
     */
    get tc256() {
      return _tc256
    }
  }
}
