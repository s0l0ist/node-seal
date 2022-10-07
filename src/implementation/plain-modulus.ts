import { LoaderOptions, Library } from './seal'
import { Exception, SealError } from './exception'
import { Modulus, ModulusConstructorOptions } from './modulus'
import { Vector, VectorConstructorOptions } from './vector'

export type PlainModulusDependencyOptions = {
  readonly Exception: Exception
  readonly Modulus: ModulusConstructorOptions
  readonly Vector: VectorConstructorOptions
}

export type PlainModulusDependencies = {
  ({
    Exception,
    Modulus,
    Vector
  }: PlainModulusDependencyOptions): PlainModulusConstructorOptions
}

export type PlainModulusConstructorOptions = {
  (): PlainModulus
}

export type PlainModulus = {
  readonly Batching: (polyModulusDegree: number, bitSize: number) => Modulus
  readonly BatchingVector: (
    polyModulusDegree: number,
    bitSizes: Int32Array
  ) => Vector
}

const PlainModulusConstructor =
  (library: Library): PlainModulusDependencies =>
  ({
    Exception,
    Modulus,
    Vector
  }: PlainModulusDependencyOptions): PlainModulusConstructorOptions =>
  (): PlainModulus => {
    // Static methods
    const _Batching = library.PlainModulus.Batching
    const _BatchingVector = library.PlainModulus.BatchingVector

    /**
     * @implements PlainModulus
     */

    /**
     * @interface PlainModulus
     */
    return {
      /**
       * Creates a prime number PlainModulus for use as plainPlainModulus encryption
       * parameter that supports batching with a given polyPlainModulusDegree.
       *
       * @function
       * @name PlainModulus.Batching
       * @param {number} polyModulusDegree The degree of the polynomial modulus
       * @param {number} bitSize The bit-size of the desired prime number
       * @returns {Modulus} A PlainModulus containing the prime number
       */
      Batching(polyModulusDegree: number, bitSize: number): Modulus {
        try {
          const smallMod = Modulus(BigInt(0))
          smallMod.inject(_Batching(polyModulusDegree, bitSize))
          return smallMod
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      },

      /**
       * Creates several prime number PlainModulus elements that can be used as
       * plainPlainModulus encryption parameters, each supporting batching with a given
       * polyPlainModulusDegree.
       *
       * @function
       * @name PlainModulus.BatchingVector
       * @param {Number} polyPlainModulusDegree The degree of the polynomial modulus
       * @param {Int32Array} bitSizes Int32Array containing values representing bit-sizes of primes
       * @returns {Vector} Vector of Modulus containing prime numbers
       */
      BatchingVector(
        polyPlainModulusDegree: number,
        bitSizes: Int32Array
      ): Vector {
        try {
          const vectBitSizes = Vector()
          vectBitSizes.from(bitSizes)
          const vect = _BatchingVector(
            polyPlainModulusDegree,
            vectBitSizes.instance
          )
          vectBitSizes.delete()
          return vect
        } catch (e) {
          throw Exception.safe(e as SealError)
        }
      }
    }
  }

export const PlainModulusInit = ({
  loader
}: LoaderOptions): PlainModulusDependencies => {
  const library: Library = loader.library
  return PlainModulusConstructor(library)
}
