export class Exception {
  constructor({library}) {
    // Static methods
    this._getException = library.getException
  }

  /**
   * Returns the human readable exception string from
   * an emscripten exception pointer
   *
   * @param {number} pointer - The integer pointer thrown from emscripten
   * @returns {string} - Human readable exception message
   */
  getHuman({ pointer }) {
    return this._getException(pointer)
  }
}
