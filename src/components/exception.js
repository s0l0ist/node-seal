/**
 * Exception
 * @typedef {Object} Exception
 * @constructor
 */
export const Exception = ({ library }) => {
  const _getException = library.getException

  return {
    /**
     * Returns the human readable exception string from
     * an emscripten exception pointer
     * @param {Object} options Options
     * @param {number} options.pointer - The integer pointer thrown from emscripten
     * @returns {string} - Human readable exception message
     */
    getHuman({ pointer }) {
      return _getException(pointer)
    }
  }
}
