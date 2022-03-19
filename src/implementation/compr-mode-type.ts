import { LoaderOptions, Library } from './seal'

export type ComprModeTypeDependencies = {
  (): ComprModeTypeConstructorOptions
}

export type ComprModeTypeConstructorOptions = {
  (): ComprModeType
}

export type ComprModeType = {
  readonly none: any
  readonly zlib: any
  readonly zstd: any
}

const ComprModeTypeConstructor =
  (library: Library): ComprModeTypeDependencies =>
    (): ComprModeTypeConstructorOptions =>
      (): ComprModeType => {
        // Static methods
        const _none = library.ComprModeType.none
        const _zlib = library.ComprModeType.zlib
        const _zstd = library.ComprModeType.zstd

        /**
         * @implements ComprModeType
         */

        /**
         * @interface ComprModeType
         */
        return {
          /**
           * The `none` Compression Mode Type
           *
           * @readonly
           * @name ComprModeType.none
           * @type {ComprModeType.none}
           */
          get none() {
            /**
             * @typedef {ComprModeType.none} ComprModeType.none
             */
            return _none
          },

          /**
           * The `zlib` Compression Mode Type
           *
           * @readonly
           * @name ComprModeType.zlib
           * @type {ComprModeType.zlib}
           */
          get zlib() {
            /**
             * @typedef {ComprModeType.zlib} ComprModeType.zlib
             */
            return _zlib
          },

          /**
           * The `zstd` Compression Mode Type
           *
           * @readonly
           * @name ComprModeType.zstd
           * @type {ComprModeType.zstd}
           */
          get zstd() {
            /**
             * @typedef {ComprModeType.zstd} ComprModeType.zstd
             */
            return _zstd
          }
        }
      }

export const ComprModeTypeInit = ({
  loader
}: LoaderOptions): ComprModeTypeDependencies => {
  const library: Library = loader.library
  return ComprModeTypeConstructor(library)
}
