export const Util = library => Exception => {
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
     * @returns {Number} GCD of a and b
     */
    gcd(a, b) {
      try {
        return _gcd(a.toString(), b.toString())
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
