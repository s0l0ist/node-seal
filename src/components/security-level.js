export const SecurityLevel = ({library}) => {

  const _none = library.SecLevelType.none
  const _tc128 = library.SecLevelType.tc128
  const _tc192 = library.SecLevelType.tc192
  const _tc256 = library.SecLevelType.tc256

  return {
    /**
     * Returns the 'none' security type
     *
     * @returns SecurityType
     */
    get none() {
      return _none
    },

    /**
     * Returns the '128' security type
     *
     * @returns SecurityType
     */
    get tc128() {
      return _tc128
    },

    /**
     * Returns the '192' security type
     *
     * @returns SecurityType
     */
    get tc192() {
      return _tc192
    },

    /**
     * Returns the '256' security type
     *
     * @returns SecurityType
     */
    get tc256() {
      return _tc256
    }
  }
}
