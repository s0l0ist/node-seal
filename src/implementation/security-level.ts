import { Library, LoaderOptions } from './seal'

export interface SecurityLevelDependencies {
  (): SecurityLevelConstructorOptions
}

export interface SecurityLevelConstructorOptions {
  (): SecurityLevel
}

export interface SecurityLevel {
  readonly none: any
  readonly tc128: any
  readonly tc192: any
  readonly tc256: any
}

const SecurityLevelConstructor =
  (library: Library): SecurityLevelDependencies =>
  (): SecurityLevelConstructorOptions =>
  (): SecurityLevel => {
    // Static methods
    const _none = library.SecLevelType.none
    const _tc128 = library.SecLevelType.tc128
    const _tc192 = library.SecLevelType.tc192
    const _tc256 = library.SecLevelType.tc256

    /**
     * @implements SecurityLevel
     */

    /**
     * @interface SecurityLevel
     */
    return {
      /**
       * Returns the 'none' security level
       *
       * @readonly
       * @name SecurityLevel.none
       * @type {SecurityLevel.none}
       */
      get none() {
        /**
         * @typedef {SecurityLevel.none} SecurityLevel.none
         */
        return _none
      },

      /**
       * Returns the '128' security level
       *
       * @readonly
       * @name SecurityLevel.tc128
       * @type {SecurityLevel.tc128}
       */
      get tc128() {
        /**
         * @typedef {SecurityLevel.tc128} SecurityLevel.tc128
         */
        return _tc128
      },

      /**
       * Returns the '192' security level
       *
       * @readonly
       * @name SecurityLevel.tc192
       * @type {SecurityLevel.tc192}
       */
      get tc192() {
        /**
         * @typedef {SecurityLevel.tc192} SecurityLevel.tc192
         */
        return _tc192
      },

      /**
       * Returns the '256' security level
       *
       * @readonly
       * @name SecurityLevel.tc256
       * @type {SecurityLevel.tc256}
       */
      get tc256() {
        /**
         * @typedef {SecurityLevel.tc256} SecurityLevel.tc256
         */
        return _tc256
      }
    }
  }
export const SecurityLevelInit = ({
  loader
}: LoaderOptions): SecurityLevelDependencies => {
  const library: Library = loader.library
  return SecurityLevelConstructor(library)
}
