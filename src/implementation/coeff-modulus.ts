import { LoaderOptions, Library } from './seal'
import { Exception, SealError } from './exception'
import { SecurityLevel } from './security-level'
import { Vector, VectorConstructorOptions } from './vector'
import { UNSUPPORTED_BITSIZES_TYPE } from './constants'

export type CoeffModulusDependencyOptions = {
  readonly Exception: Exception
  readonly SecurityLevel: SecurityLevel
  readonly Vector: VectorConstructorOptions
}

export type CoeffModulusDependencies = {
  ({
    Exception,
    SecurityLevel,
    Vector
  }: CoeffModulusDependencyOptions): CoeffModulusConstructorOptions
}

export type CoeffModulusConstructorOptions = {
  (): CoeffModulus
}

export type CoeffModulus = {
  readonly MaxBitCount: (
    polyModulusDegree: number,
    securityLevel?: SecurityLevel
  ) => number
  readonly BFVDefault: (
    polyModulusDegree: number,
    securityLevel?: SecurityLevel
  ) => Vector
  readonly Create: (polyModulusDegree: number, bitSizes: Int32Array) => Vector
}

const CoeffModulusConstructor =
  (library: Library): CoeffModulusDependencies =>
    ({
      Exception,
      SecurityLevel,
      Vector
    }: CoeffModulusDependencyOptions): CoeffModulusConstructorOptions =>
      (): CoeffModulus => {
        // Static methods
        const _MaxBitCount = library.CoeffModulus.MaxBitCount
        const _BFVDefault = library.CoeffModulus.BFVDefault
        const _CreateFromArray = library.CoeffModulus.CreateFromArray

        /**
         * @implements CoeffModulus
         */

        /**
         * @interface CoeffModulus
         */
        return {
          /**
           * Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel
           *
           * @function
           * @name CoeffModulus.MaxBitCount
           * @param {number} polyModulusDegree Degree of the polynomial modulus
           * @param {SecurityLevel} [securityLevel={@link SecurityLevel.tc128}] Security Level
           * @returns {number} Maximum bit count
           */
          MaxBitCount(
            polyModulusDegree: number,
            securityLevel: SecurityLevel = SecurityLevel.tc128
          ): number {
            return _MaxBitCount(polyModulusDegree, securityLevel)
          },

          /**
           * Returns a default vector of primes for the BFV CoeffModulus parameter
           *
           * @function
           * @name CoeffModulus.BFVDefault
           * @param {number} polyModulusDegree Degree of the polynomial modulus
           * @param {SecurityLevel} [securityLevel={@link SecurityLevel.tc128}] Security Level
           * @returns {Vector} Vector containing Modulus primes
           */
          BFVDefault(
            polyModulusDegree: number,
            securityLevel: SecurityLevel = SecurityLevel.tc128
          ): Vector {
            try {
              const vectorModulus = Vector()
              const instance = _BFVDefault(polyModulusDegree, securityLevel)
              vectorModulus.unsafeInject(instance)
              vectorModulus.setType('Modulus')
              return vectorModulus
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          },

          /**
           * Creates a vector of primes for a given polyModulusDegree and bitSizes
           *
           * @function
           * @name CoeffModulus.Create
           * @param {number} polyModulusDegree Degree of the polynomial modulus
           * @param {Int32Array} bitSizes Int32Array containing values representing
           * bit-sizes of primes
           * @returns {Vector} Vector containing Modulus primes
           */
          Create(polyModulusDegree: number, bitSizes: Int32Array): Vector {
            try {
              if (bitSizes.constructor !== Int32Array) {
                throw new Error(UNSUPPORTED_BITSIZES_TYPE)
              }
              const vectorModulus = Vector()
              const instance = _CreateFromArray(polyModulusDegree, bitSizes)
              vectorModulus.unsafeInject(instance)
              vectorModulus.setType('Modulus')
              return vectorModulus
            } catch (e) {
              throw Exception.safe(e as SealError)
            }
          }
        }
      }

export const CoeffModulusInit = ({
  loader
}: LoaderOptions): CoeffModulusDependencies => {
  const library: Library = loader.library
  return CoeffModulusConstructor(library)
}
