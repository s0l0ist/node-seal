import { Library, LoaderOptions } from './seal'

export interface SchemeTypeDependencies {
  (): SchemeTypeConstructorOptions
}

export interface SchemeTypeConstructorOptions {
  (): SchemeType
}

export interface SchemeType {
  readonly none: any
  readonly bfv: any
  readonly ckks: any
  readonly bgv: any
}

const SchemeTypeConstructor =
  (library: Library): SchemeTypeDependencies =>
  (): SchemeTypeConstructorOptions =>
  (): SchemeType => {
    // Static methods
    const _none = library.SchemeType.none
    const _bfv = library.SchemeType.bfv
    const _ckks = library.SchemeType.ckks
    const _bgv = library.SchemeType.bgv

    /**
     * @implements SchemeType
     */

    /**
     * @interface SchemeType
     */
    return {
      /**
       * Return the 'none' scheme type
       *
       * @readonly
       * @name SchemeType.none
       * @type {SchemeType.none}
       */
      get none() {
        /**
         * @typedef {SchemeType.none} SchemeType.none
         */
        return _none
      },

      /**
       * Return the 'bfv' scheme type
       *
       * @readonly
       * @name SchemeType.bfv
       * @type {SchemeType.bfv}
       */
      get bfv() {
        /**
         * @typedef {SchemeType.bfv} SchemeType.bfv
         */
        return _bfv
      },

      /**
       * Return the 'ckks' scheme type
       *
       * @readonly
       * @name SchemeType.ckks
       * @type {SchemeType.ckks}
       */
      get ckks() {
        /**
         * @typedef {SchemeType.ckks} SchemeType.ckks
         */
        return _ckks
      },

      /**
       * Return the 'bgv' scheme type
       *
       * @readonly
       * @name SchemeType.bgv
       * @type {SchemeType.bgv}
       */
      get bgv() {
        /**
         * @typedef {SchemeType.bgv} SchemeType.bgv
         */
        return _bgv
      }
    }
  }

export const SchemeTypeInit = ({
  loader
}: LoaderOptions): SchemeTypeDependencies => {
  const library: Library = loader.library
  return SchemeTypeConstructor(library)
}
