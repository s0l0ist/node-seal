export const Exception = ({library}) => {

  const _getException = library.getException

  return {

    /**
     * Returns the human readable exception string from
     * an emscripten exception pointer
     *
     * @param {number} pointer - The integer pointer thrown from emscripten
     * @returns {string} - Human readable exception message
     */
    getHuman({pointer}) {
      return _getException(pointer)
    }
  }
}
