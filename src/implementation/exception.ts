import { LoaderOptions, Library } from './seal'

export type ExceptionDependencies = {
  (): ExceptionConstructorOptions
}

export type ExceptionConstructorOptions = {
  (): Exception
}

export type SealError = number | Error | string

export type Exception = {
  readonly safe: (e: SealError) => Error
}

const ExceptionConstructor =
  (library: Library): ExceptionDependencies =>
    (): ExceptionConstructorOptions =>
      (): Exception => {
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
           * Takes a caught exception in SEAL library and gets a safe error string
           *
           * @function
           * @name Exception.safe
           * @param {(number|Error|string)} error Unsafe error to normalize
           * @returns {Error}
           */
          safe(error: number | Error | string): Error {
            if (typeof error === 'number') {
              return new Error(_getException(error))
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
