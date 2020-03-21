export const Exception = library => () => {
  // Static methods
  const _getException = library.getException

  /**
   * @implements Exception
   */

  /**
   * @interface Exception
   */
  return {
    /**
     * Returns the human readable exception string from
     * an emscripten exception pointer
     *
     * @function
     * @name Exception.getHuman
     * @param {Number} pointer The integer pointer thrown from emscripten
     * @returns {String} Human readable exception message
     */
    getHuman(pointer) {
      return _getException(pointer)
    },

    /**
     * Takes a caught exception in SEAL library and gets a safe error string
     *
     * @function
     * @name Exception.safe
     * @param {(Number|Error|String)} error Unsafe error to normalize
     * @returns {Error}
     */
    safe(error) {
      if (typeof error === 'number') {
        return new Error(this.getHuman(error))
      }

      if (error instanceof Error) {
        return error
      }
      return new Error(error || 'Unknown Error!')
    }
  }
}
