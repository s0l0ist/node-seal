import { LoaderOptions, Library } from './emscripten'

export type ExceptionDependencies = {
  ({}: ExceptionDependencyOptions): ExceptionConstructorOptions
}

export type ExceptionDependencyOptions = {}

export type ExceptionConstructorOptions = {
  (): Exception
}

export type Exception = {
  readonly getHuman: (pointer: number) => string
  readonly safe: (error: number | Error | string) => Error
}

const ExceptionConstructor = (
  library: Library
): ExceptionDependencies => ({}: ExceptionDependencyOptions): ExceptionConstructorOptions => (): Exception => {
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
     * @param {number} pointer The integer pointer thrown from emscripten
     * @returns {string} Human readable exception message
     */
    getHuman(pointer: number): string {
      return _getException(pointer)
    },

    /**
     * Takes a caught exception in SEAL library and gets a safe error string
     *
     * @function
     * @name Exception.safe
     * @param {(number|Error|string)} error Unsafe error to normalize
     * @returns {Error}
     */
    safe(error: number | Error | string): Error {
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

export const ExceptionInit = ({
  loader
}: LoaderOptions): ExceptionDependencies => {
  const library: Library = loader.library
  return ExceptionConstructor(library)
}
