export const Util = library => () => {
  // Static methods
  const _gcd = library.gcd

  /**
   * @implements Util
   */

  /**
   * @interface Util
   */
  return {
    /**
     * Find the gcd between two numbers
     *
     * @function
     * @name Util#gcd
     * @param {BigInt} a
     * @param {BigInt} b
     * @returns {BigInt} GCD of a and b
     */
    gcd(a, b) {
      // eslint-disable-next-line no-undef
      return BigInt(_gcd(a.toString(), b.toString()))
    }
  }
}
