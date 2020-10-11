import { LoaderOptions, Library, Instance } from './emscripten'
import { Exception } from './exception'
import { CipherText, CipherTextConstructorOptions } from './cipher-text'
import { Context } from './context'
import { PlainText, PlainTextConstructorOptions } from './plain-text'
import { MemoryPoolHandle } from './memory-pool-handle'
import { RelinKeys } from './relin-keys'
import { ParmsIdType } from './parms-id-type'
import { GaloisKeys } from './galois-keys'
import { SchemeType } from './scheme-type'

export type EvaluatorDependencyOptions = {
  readonly Exception: Exception
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly CipherText: CipherTextConstructorOptions
  readonly PlainText: PlainTextConstructorOptions
}

export type EvaluatorDependencies = {
  ({
    Exception,
    MemoryPoolHandle,
    CipherText,
    PlainText
  }: EvaluatorDependencyOptions): EvaluatorConstructorOptions
}

export type EvaluatorConstructorOptions = {
  (context: Context): Evaluator
}

export type Evaluator = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly negate: (
    encrypted: CipherText,
    destination?: CipherText
  ) => CipherText | void
  readonly add: (
    a: CipherText,
    b: CipherText,
    destination?: CipherText
  ) => CipherText | void
  readonly sub: (
    a: CipherText,
    b: CipherText,
    destination?: CipherText
  ) => CipherText | void
  readonly multiply: (
    a: CipherText,
    b: CipherText,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly square: (
    encrypted: CipherText,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly relinearize: (
    encrypted: CipherText,
    relinKeys: RelinKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly cipherModSwitchToNext: (
    encrypted: CipherText,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly cipherModSwitchTo: (
    encrypted: CipherText,
    parmsId: ParmsIdType,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly plainModSwitchToNext: (
    plain: PlainText,
    destination?: PlainText
  ) => PlainText | void
  readonly plainModSwitchTo: (
    plain: PlainText,
    parmsId: ParmsIdType,
    destination?: PlainText
  ) => PlainText | void
  readonly rescaleToNext: (
    encrypted: CipherText,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly rescaleTo: (
    encrypted: CipherText,
    parmsId: ParmsIdType,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly exponentiate: (
    encrypted: CipherText,
    exponent: number,
    relinKeys: RelinKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly addPlain: (
    encrypted: CipherText,
    plain: PlainText,
    destination?: CipherText
  ) => CipherText | void
  readonly subPlain: (
    encrypted: CipherText,
    plain: PlainText,
    destination?: CipherText
  ) => CipherText | void
  readonly multiplyPlain: (
    encrypted: CipherText,
    plain: PlainText,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly plainTransformToNtt: (
    plain: PlainText,
    parmsId: ParmsIdType,
    destinationNtt?: PlainText,
    pool?: MemoryPoolHandle
  ) => PlainText | void
  readonly cipherTransformToNtt: (
    encrypted: CipherText,
    destinationNtt?: CipherText
  ) => CipherText | void
  readonly cipherTransformFromNtt: (
    encryptedNtt: CipherText,
    destination?: CipherText
  ) => CipherText | void
  readonly applyGalois: (
    encrypted: CipherText,
    galoisElt: number,
    galoisKeys: GaloisKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly rotateRows: (
    encrypted: CipherText,
    steps: number,
    galoisKeys: GaloisKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly rotateColumns: (
    encrypted: CipherText,
    galoisKeys: GaloisKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly rotateVector: (
    encrypted: CipherText,
    steps: number,
    galoisKeys: GaloisKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly complexConjugate: (
    encrypted: CipherText,
    galoisKeys: GaloisKeys,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly sumElements: (
    encrypted: CipherText,
    galoisKeys: GaloisKeys,
    scheme: SchemeType,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly dotProduct: (
    a: CipherText,
    b: CipherText,
    relinKeys: RelinKeys,
    galoisKeys: GaloisKeys,
    scheme: SchemeType,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
  readonly dotProductPlain: (
    a: CipherText,
    b: PlainText,
    galoisKeys: GaloisKeys,
    scheme: SchemeType,
    destination?: CipherText,
    pool?: MemoryPoolHandle
  ) => CipherText | void
}

const EvaluatorConstructor = (library: Library): EvaluatorDependencies => ({
  Exception,
  MemoryPoolHandle,
  CipherText,
  PlainText
}: EvaluatorDependencyOptions): EvaluatorConstructorOptions => (
  context
): Evaluator => {
  const Constructor = library.Evaluator
  let _instance: Instance
  try {
    _instance = new Constructor(context.instance)
  } catch (e) {
    throw Exception.safe(e)
  }
  /**
   * @implements Evaluator
   */

  /**
   * @interface Evaluator
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Evaluator#instance
     * @type {Instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name Evaluator#unsafeInject
     * @param {Instance} instance WASM instance
     */
    unsafeInject(instance: Instance) {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name Evaluator#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
    },

    /**
     * Negates a CipherText and stores the result in the destination parameter.
     *
     * @function
     * @name Evaluator#negate
     * @param {CipherText} encrypted CipherText to negate
     * @param {CipherText} [destination] CipherText to store the negated results
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherText = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.negate(cipherText)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.negate(encrypted, cipherDest)
     */
    negate(encrypted: CipherText, destination?: CipherText): CipherText | void {
      try {
        if (destination) {
          _instance.negate(encrypted.instance, destination.instance)
          return
        }
        const temp = CipherText()
        _instance.negate(encrypted.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Adds two CipherTexts. This function adds together a and b
     * and stores the result in the destination parameter.
     *
     * @function
     * @name Evaluator#add
     * @param {CipherText} a CipherText operand A
     * @param {CipherText} b CipherText operand B
     * @param {CipherText} [destination] CipherText destination to store the sum
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * const cipherTextB = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.add(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.add(cipherTextA, cipherTextB, cipherDest)
     */
    add(
      a: CipherText,
      b: CipherText,
      destination?: CipherText
    ): CipherText | void {
      try {
        if (destination) {
          _instance.add(a.instance, b.instance, destination.instance)
          return
        }
        const temp = CipherText()
        _instance.add(a.instance, b.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Subtracts two CipherTexts. This function computes the difference of a
     * and b and stores the result in the destination parameter.
     *
     * @function
     * @name Evaluator#sub
     * @param {CipherText} a CipherText operand A
     * @param {CipherText} b CipherText operand B
     * @param {CipherText} [destination] CipherText destination to store the difference
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * const cipherTextB = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.sub(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.sub(cipherTextA, cipherTextB, cipherDest)
     */
    sub(
      a: CipherText,
      b: CipherText,
      destination?: CipherText
    ): CipherText | void {
      try {
        if (destination) {
          _instance.sub(a.instance, b.instance, destination.instance)
          return
        }
        const temp = CipherText()
        _instance.sub(a.instance, b.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Multiplies two CipherTexts. This functions computes the product of a
     * and b and stores the result in the destination parameter. Dynamic
     * memory allocations in the process are allocated from the memory pool pointed
     * to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#multiply
     * @param {CipherText} a CipherText operand A
     * @param {CipherText} b CipherText operand B
     * @param {CipherText} [destination] CipherText destination to store the product
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * const cipherTextB = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.multiply(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.multiply(cipherTextA, cipherTextB, cipherDest)
     */
    multiply(
      a: CipherText,
      b: CipherText,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.multiply(a.instance, b.instance, destination.instance, pool)
          return
        }
        const temp = CipherText()
        _instance.multiply(a.instance, b.instance, temp.instance, pool)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Squares a CipherText. This functions computes the square of encrypted and
     * stores the result in the destination parameter. Dynamic memory allocations
     * in the process are allocated from the memory pool pointed to by the given
     * MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#square
     * @param {CipherText} encrypted CipherText to square
     * @param {CipherText} [destination] CipherText destination to store the squared result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.square(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.square(cipherTextA, cipherDest)
     */
    square(
      encrypted: CipherText,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.square(encrypted.instance, destination.instance, pool)
          return
        }
        const temp = CipherText()
        _instance.square(encrypted.instance, temp.instance, pool)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Relinearizes a CipherText. This functions relinearizes encrypted, reducing
     * its size down to 2, and stores the result in the destination parameter.
     * If the size of encrypted is K+1, the given relinearization keys need to
     * have size at least K-1. Dynamic memory allocations in the process are allocated
     * from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#relinearize
     * @param {CipherText} encrypted CipherText to relinearize
     * @param {RelinKeys} relinKeys RelinKey used to perform relinearization
     * @param {CipherText} [destination] CipherText destination to store the relinearized result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const relinKeys = keyGenerator.relinKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.relinearize(cipherTextA, relinKeys)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.relinearize(cipherTextA, relinKeys, cipherDest)
     */
    relinearize(
      encrypted: CipherText,
      relinKeys: RelinKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.relinearize(
            encrypted.instance,
            relinKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.relinearize(
          encrypted.instance,
          relinKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Given a CipherText encrypted modulo q_1...q_k, this function switches the
     * modulus down to q_1...q_{k-1} and stores the result in the destination
     * parameter. Dynamic memory allocations in the process are allocated from
     * the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#cipherModSwitchToNext
     * @param {CipherText} encrypted CipherText to switch its modulus down
     * @param {CipherText} [destination] CipherText destination to store the switched result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.cipherModSwitchToNext(cipherTextA)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.cipherModSwitchToNext(cipherTextA, cipherDest)
     */
    cipherModSwitchToNext(
      encrypted: CipherText,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.cipherModSwitchToNext(
            encrypted.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.cipherModSwitchToNext(encrypted.instance, temp.instance, pool)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Given a CipherText encrypted modulo q_1...q_k, this function switches the
     * modulus down until the parameters reach the given parmsId and stores the
     * result in the destination parameter. Dynamic memory allocations in the process
     * are allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#cipherModSwitchTo
     * @param {CipherText} encrypted CipherText to switch its modulus down
     * @param {ParmsIdType} parmsId Target parmsId to switch to
     * @param {CipherText} [destination] CipherText destination to store the switched result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const context = seal.Context(encParms, true)
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.cipherModSwitchTo(cipherTextA, parmsId)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.cipherModSwitchTo(cipherTextA, parmsId, cipherDest)
     */
    cipherModSwitchTo(
      encrypted: CipherText,
      parmsId: ParmsIdType,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.cipherModSwitchTo(
            encrypted.instance,
            parmsId.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.cipherModSwitchTo(
          encrypted.instance,
          parmsId.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Modulus switches an NTT transformed PlainText from modulo q_1...q_k down
     * to modulo q_1...q_{k-1} and stores the result in the destination parameter.
     *
     * @function
     * @name Evaluator#plainModSwitchToNext
     * @param {PlainText} plain PlainText to switch its modulus down
     * @param {PlainText} [destination] PlainText destination to store the switched result
     * @returns {PlainText|void} PlainText containing the result or void if a destination was supplied
     * @example
     * const plainTextA = seal.PlainText()
     * // ... after encoding some data ...
     * const resultCipher = evaluator.plainModSwitchToNext(plainTextA)
     * // or
     * const plainDest = seal.PlainText()
     * evaluator.plainModSwitchToNext(plainTextA, plainDest)
     */
    plainModSwitchToNext(
      plain: PlainText,
      destination?: PlainText
    ): PlainText | void {
      try {
        if (destination) {
          _instance.plainModSwitchToNext(plain.instance, destination.instance)
          return
        }
        const temp = PlainText()
        _instance.plainModSwitchToNext(plain.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Given an NTT transformed PlainText modulo q_1...q_k, this function switches
     * the modulus down until the parameters reach the given parmsId and stores
     * the result in the destination parameter.
     *
     * @function
     * @name Evaluator#plainModSwitchTo
     * @param {PlainText} plain PlainText to switch its modulus down
     * @param {ParmsIdType} parmsId Target parmsId to switch to
     * @param {PlainText} [destination] PlainText destination to store the switched result
     * @returns {PlainText|void} PlainText containing the result or void if a destination was supplied
     * @example
     * const context = seal.Context(encParms, true)
     * const plainTextA = seal.PlainText()
     * // ... after encoding some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.plainModSwitchTo(plainTextA, parmsId)
     * // or
     * const plainDest = seal.PlainText()
     * evaluator.plainModSwitchTo(plainTextA, parmsId, plainDest)
     */
    plainModSwitchTo(
      plain: PlainText,
      parmsId: ParmsIdType,
      destination?: PlainText
    ): PlainText | void {
      try {
        if (destination) {
          _instance.plainModSwitchTo(
            plain.instance,
            parmsId.instance,
            destination.instance
          )
          return
        }
        const temp = PlainText()
        _instance.plainModSwitchTo(
          plain.instance,
          parmsId.instance,
          temp.instance
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Given a CipherText encrypted modulo q_1...q_k, this function switches the
     * modulus down to q_1...q_{k-1}, scales the message down accordingly, and
     * stores the result in the destination parameter. Dynamic memory allocations
     * in the process are allocated from the memory pool pointed to by the given
     * MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#rescaleToNext
     * @param {CipherText} encrypted CipherText to rescale
     * @param {CipherText} [destination] CipherText destination to store the rescaled result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rescaleToNext(cipherTextA)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.rescaleToNext(cipherTextA, cipherDest)
     */
    rescaleToNext(
      encrypted: CipherText,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.rescaleToNext(
            encrypted.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.rescaleToNext(encrypted.instance, temp.instance, pool)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Given a CipherText encrypted modulo q_1...q_k, this function switches the
     * modulus down until the parameters reach the given parmsId, scales the message
     * down accordingly, and stores the result in the destination parameter. Dynamic
     * memory allocations in the process are allocated from the memory pool pointed
     * to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#rescaleTo
     * @param {CipherText} encrypted CipherText to rescale
     * @param {ParmsIdType} parmsId Target parmsId to rescale to
     * @param {CipherText} [destination] CipherText destination to store the rescaled result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const context = seal.Context(encParms, true)
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.rescaleTo(cipherTextA, parmsId)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.rescaleTo(cipherTextA, parmsId, cipherDest)
     */
    rescaleTo(
      encrypted: CipherText,
      parmsId: ParmsIdType,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.rescaleTo(
            encrypted.instance,
            parmsId.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.rescaleTo(
          encrypted.instance,
          parmsId.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Exponentiates a CipherText. This functions raises encrypted to a power and
     * stores the result in the destination parameter. Dynamic memory allocations
     * in the process are allocated from the memory pool pointed to by the given
     * MemoryPoolHandle. The exponentiation is done in a depth-optimal order, and
     * relinearization is performed automatically after every multiplication in
     * the process. In relinearization the given relinearization keys are used.
     *
     * @function
     * @name Evaluator#exponentiate
     * @param {CipherText} encrypted CipherText to exponentiate
     * @param {number} exponent Positive integer to exponentiate the CipherText
     * @param {RelinKeys} relinKeys RelinKeys used to perform relinearization after each exponentiation
     * @param {CipherText} [destination] CipherText destination to store the exponentiated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const relinKeys = keyGenerator.relinKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.exponentiate(cipherTextA, 3, relinKeys)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.exponentiate(cipherTextA, 3, relinKeys, cipherDest)
     */
    exponentiate(
      encrypted: CipherText,
      exponent: number,
      relinKeys: RelinKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.exponentiate(
            encrypted.instance,
            exponent,
            relinKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.exponentiate(
          encrypted.instance,
          exponent,
          relinKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Adds a CipherText and a PlainText. This function adds a CipherText and
     * a PlainText and stores the result in the destination parameter. The PlainText
     * must be valid for the current encryption parameters.
     *
     * @function
     * @name Evaluator#addPlain
     * @param {CipherText} encrypted CipherText operand A
     * @param {PlainText} plain PlainText operand B
     * @param {CipherText} [destination] CipherText destination to store the sum
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * const plainTextB = seal.PlainText()
     * // ... after encrypting/encoding some data ...
     * const resultCipher = evaluator.addPlain(cipherTextA, plainTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.addPlain(cipherTextA, plainTextB, cipherDest)
     */
    addPlain(
      encrypted: CipherText,
      plain: PlainText,
      destination?: CipherText
    ): CipherText | void {
      try {
        if (destination) {
          _instance.addPlain(
            encrypted.instance,
            plain.instance,
            destination.instance
          )
          return
        }
        const temp = CipherText()
        _instance.addPlain(encrypted.instance, plain.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Subtracts a PlainText from a CipherText. This function subtracts a PlainText
     * from a CipherText and stores the result in the destination parameter. The
     * PlainText must be valid for the current encryption parameters.
     *
     * @function
     * @name Evaluator#subPlain
     * @param {CipherText} encrypted CipherText operand A
     * @param {PlainText} plain PlainText operand B
     * @param {CipherText} [destination] CipherText destination to store the difference
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * const plainTextB = seal.PlainText()
     * // ... after encrypting/encoding some data ...
     * const resultCipher = evaluator.subPlain(cipherTextA, plainTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.subPlain(cipherTextA, plainTextB, cipherDest)
     */
    subPlain(
      encrypted: CipherText,
      plain: PlainText,
      destination?: CipherText
    ): CipherText | void {
      try {
        if (destination) {
          _instance.subPlain(
            encrypted.instance,
            plain.instance,
            destination.instance
          )
          return
        }
        const temp = CipherText()
        _instance.subPlain(encrypted.instance, plain.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Multiplies a CipherText with a PlainText. This function multiplies
     * a CipherText with a PlainText and stores the result in the destination
     * parameter. The PlainText must be a valid for the current encryption parameters,
     * and cannot be identially 0. Dynamic memory allocations in the process are
     * allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#multiplyPlain
     * @param {CipherText} encrypted CipherText operand A
     * @param {PlainText} plain PlainText operand B
     * @param {CipherText} [destination] CipherText destination to store the product
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText?} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * const plainTextB = seal.PlainText()
     * // ... after encrypting/encoding some data ...
     * const resultCipher = evaluator.multiplyPlain(cipherTextA, plainTextB)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.multiplyPlain(cipherTextA, plainTextB, cipherDest)
     */
    multiplyPlain(
      encrypted: CipherText,
      plain: PlainText,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.multiplyPlain(
            encrypted.instance,
            plain.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.multiplyPlain(
          encrypted.instance,
          plain.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Transforms a PlainText to NTT domain. This functions applies the number
     * Theoretic Transform to a PlainText by first embedding integers modulo the
     * PlainText modulus to integers modulo the coefficient modulus and then
     * performing David Harvey's NTT on the resulting polynomial. The transformation
     * is done with respect to encryption parameters corresponding to a given
     * parmsId. The result is stored in the destinationNtt parameter. For the
     * operation to be valid, the PlainText must have degree less than PolyModulusDegree
     * and each coefficient must be less than the PlainText modulus, i.e., the PlainText
     * must be a valid PlainText under the current encryption parameters. Dynamic
     * memory allocations in the process are allocated from the memory pool pointed
     * to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#plainTransformToNtt
     * @param {PlainText} plain PlainText to transform
     * @param {ParmsIdType} parmsId target parmsId to perform NTT transformation
     * @param {PlainText} [destinationNtt] PlainText destination to store the transformed result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {PlainText|void} PlainText containing the result or void if a destination was supplied
     * @example
     * const context = seal.Context(encParms, true)
     * const plainTextA = seal.PlainText()
     * // ... after encoding some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.plainTransformToNtt(plainTextA, parmsId)
     * // or
     * const plainDest = seal.PlainText()
     * evaluator.plainTransformToNtt(plainTextA, parmsId, plainDest)
     */
    plainTransformToNtt(
      plain: PlainText,
      parmsId: ParmsIdType,
      destinationNtt?: PlainText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): PlainText | void {
      try {
        if (destinationNtt) {
          _instance.plainTransformToNtt(
            plain.instance,
            parmsId.instance,
            destinationNtt.instance,
            pool
          )
          return
        }
        const temp = PlainText()
        _instance.plainTransformToNtt(
          plain.instance,
          parmsId.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Transforms a CipherText to NTT domain. This functions applies David Harvey's
     * number Theoretic Transform separately to each polynomial of a CipherText.
     * The result is stored in the destinationNtt parameter.
     *
     * @function
     * @name Evaluator#cipherTransformToNtt
     * @param {CipherText} encrypted CipherText to transform
     * @param {CipherText} [destinationNtt] CipherText destination to store the transformed result
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.cipherTransformToNtt(cipherTextA)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.cipherTransformToNtt(cipherTextA, cipherDest)
     */
    cipherTransformToNtt(
      encrypted: CipherText,
      destinationNtt?: CipherText
    ): CipherText | void {
      try {
        if (destinationNtt) {
          _instance.cipherTransformToNtt(
            encrypted.instance,
            destinationNtt.instance
          )
          return
        }
        const temp = CipherText()
        _instance.cipherTransformToNtt(encrypted.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Transforms a CipherText back from NTT domain. This functions applies the
     * inverse of David Harvey's number Theoretic Transform separately to each
     * polynomial of a CipherText. The result is stored in the destination parameter.
     *
     * @function
     * @name Evaluator#cipherTransformFromNtt
     * @param {CipherText} encryptedNtt CipherText to transform
     * @param {CipherText} [destination] CipherText destination to store the transformed result
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * // ... after cipherTransformToNtt ...
     * const resultCipher = evaluator.cipherTransformFromNtt(cipherTextANtt)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.cipherTransformFromNtt(cipherTextANtt, cipherDest)
     */
    cipherTransformFromNtt(
      encryptedNtt: CipherText,
      destination?: CipherText
    ): CipherText | void {
      try {
        if (destination) {
          _instance.cipherTransformFromNtt(
            encryptedNtt.instance,
            destination.instance
          )
          return
        }
        const temp = CipherText()
        _instance.cipherTransformFromNtt(encryptedNtt.instance, temp.instance)
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Applies a Galois automorphism to a CipherText and writes the result to the
     * destination parameter. To evaluate the Galois automorphism, an appropriate
     * set of Galois keys must also be provided. Dynamic memory allocations in
     * the process are allocated from the memory pool pointed to by the given
     * MemoryPoolHandle.
     *
     * The desired Galois automorphism is given as a Galois element, and must be
     * an odd integer in the interval [1, M-1], where M = 2*N, and N = degree(poly_modulus).
     * Used with batching, a Galois element 3^i % M corresponds to a cyclic row
     * rotation i steps to the left, and a Galois element 3^(N/2-i) % M corresponds
     * to a cyclic row rotation i steps to the right. The Galois element M-1 corresponds
     * to a column rotation (row swap) in BFV, and complex conjugation in CKKS.
     * In the polynomial view (not batching), a Galois automorphism by a Galois
     * element p changes Enc(plain(x)) to Enc(plain(x^p)).
     *
     * @function
     * @name Evaluator#applyGalois
     * @param {CipherText} encrypted CipherText to apply the automorphism
     * @param {number} galoisElt number representing the Galois element
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * ...
     * const evaluator = seal.Evaluator(context)
     * const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
     * const plain = encoder.encode(arr)
     * const cipher = encryptor.encrypt(plain)
     * const cipherDest = seal.CipherText()
     * const galElt = 2 * parms.polyModulusDegree - 1
     * evaluator.applyGalois(cipher, galElt, galoisKeys, cipherDest)
     */
    applyGalois(
      encrypted: CipherText,
      galoisElt: number,
      galoisKeys: GaloisKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.applyGalois(
            encrypted.instance,
            galoisElt,
            galoisKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.applyGalois(
          encrypted.instance,
          galoisElt,
          galoisKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Rotates PlainText matrix rows cyclically. When batching is used with the
     * BFV scheme, this function rotates the encrypted PlainText matrix rows
     * cyclically to the left (steps > 0) or to the right (steps < 0) and writes
     * the result to the destination parameter. Since the size of the batched
     * matrix is 2-by-(N/2), where N is the degree of the polynomial modulus,
     * the number of steps to rotate must have absolute value at most N/2-1. Dynamic
     * memory allocations in the process are allocated from the memory pool pointed
     * to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#rotateRows
     * @param {CipherText} encrypted CipherText to rotate rows
     * @param {number} steps Int representing steps to rotate (negative = right, positive = left)
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination] CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rotateRows(cipherTextA, 3, galoisKeys)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.rotateRows(cipherTextA, 3, galoisKeys, cipherDest)
     */
    rotateRows(
      encrypted: CipherText,
      steps: number,
      galoisKeys: GaloisKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.rotateRows(
            encrypted.instance,
            steps,
            galoisKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.rotateRows(
          encrypted.instance,
          steps,
          galoisKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Rotates PlainText matrix columns cyclically. When batching is used with
     * the BFV scheme, this function rotates the encrypted PlainText matrix columns
     * cyclically, and writes the result to the destination parameter. Since the
     * size of the batched matrix is 2-by-(N/2), where N is the degree of the
     * polynomial modulus, this means simply swapping the two rows. Dynamic memory
     * allocations in the process are allocated from the memory pool pointed to
     * by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#rotateColumns
     * @param {CipherText} encrypted CipherText to rotate columns
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination] CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rotateColumns(cipherTextA, galoisKeys)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.rotateColumns(cipherTextA, galoisKeys, cipherDest)
     */
    rotateColumns(
      encrypted: CipherText,
      galoisKeys: GaloisKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.rotateColumns(
            encrypted.instance,
            galoisKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.rotateColumns(
          encrypted.instance,
          galoisKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Rotates PlainText vector cyclically. When using the CKKS scheme, this function
     * rotates the encrypted PlainText vector cyclically to the left (steps > 0)
     * or to the right (steps < 0) and writes the result to the destination parameter.
     * Since the size of the batched matrix is 2-by-(N/2), where N is the degree
     * of the polynomial modulus, the number of steps to rotate must have absolute
     * value at most N/2-1. Dynamic memory allocations in the process are allocated
     * from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#rotateVector
     * @param {CipherText} encrypted CipherText to rotate the entire vector
     * @param {number} steps Int representing steps to rotate (negative = right, positive = left)
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination] CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rotateVector(cipherTextA, 3, galoisKeys)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.rotateVector(cipherTextA, 3, galoisKeys, cipherDest)
     */
    rotateVector(
      encrypted: CipherText,
      steps: number,
      galoisKeys: GaloisKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.rotateVector(
            encrypted.instance,
            steps,
            galoisKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.rotateVector(
          encrypted.instance,
          steps,
          galoisKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Complex conjugates PlainText slot values. When using the CKKS scheme, this
     * function complex conjugates all values in the underlying PlainText, and
     * writes the result to the destination parameter. Dynamic memory allocations
     * in the process are allocated from the memory pool pointed to by the given
     * MemoryPoolHandle.
     *
     * @function
     * @name Evaluator#complexConjugate
     * @param {CipherText} encrypted CipherText to complex conjugate
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination] CipherText destination to store the conjugated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.complexConjugate(cipherTextA, galoisKeys)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.complexConjugate(cipherTextA, galoisKeys, cipherDest)
     */
    complexConjugate(
      encrypted: CipherText,
      galoisKeys: GaloisKeys,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.complexConjugate(
            encrypted.instance,
            galoisKeys.instance,
            destination.instance,
            pool
          )
          return
        }
        const temp = CipherText()
        _instance.complexConjugate(
          encrypted.instance,
          galoisKeys.instance,
          temp.instance,
          pool
        )
        return temp
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Sum all elements in the encrypted CipherText. The resulting CipherText contains the sum in every element.
     *
     * @function
     * @name Evaluator#sumElements
     * @param {CipherText} encrypted CipherText to sum elements
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {SchemeType} scheme Scheme that was used for encryption
     * @param {CipherText} [destination] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.sumElements(cipherTextA, galoisKeys, seal.SchemeTypes.BFV)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.sumElements(cipherTextA, galoisKeys, seal.SchemeTypes.BFV, cipherDest)
     */
    sumElements(
      encrypted: CipherText,
      galoisKeys: GaloisKeys,
      scheme: SchemeType,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.sumElements(
            encrypted.instance,
            galoisKeys.instance,
            scheme,
            destination.instance,
            pool
          )
          return
        }

        const newDest = CipherText()
        _instance.sumElements(
          encrypted.instance,
          galoisKeys.instance,
          scheme,
          newDest.instance,
          pool
        )
        return newDest
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Perform the dot product (A.B) of two CipherTexts The resulting CipherText contains the dot product in every
     * element.
     *
     * @function
     * @name Evaluator#dotProduct
     * @param {CipherText} a CipherText operand A
     * @param {CipherText} b CipherText operand B
     * @param {RelinKeys} relinKeys RelinKeys used to perform relinearization after multiplication
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {SchemeType} scheme Scheme that was used for encryption
     * @param {CipherText} [destination] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const relinKeys = keyGenerator.relinKeys()
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * const cipherTextB = seal.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.dotProduct(cipherTextA, cipherTextB, relinKeys, galoisKeys, seal.SchemeTypes.BFV)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.dotProduct(cipherTextA, cipherTextB, relinKeys, galoisKeys, seal.SchemeTypes.BFV, cipherDest)
     */
    dotProduct(
      a: CipherText,
      b: CipherText,
      relinKeys: RelinKeys,
      galoisKeys: GaloisKeys,
      scheme: SchemeType,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.multiply(a.instance, b.instance, destination.instance, pool)
          _instance.relinearize(
            destination.instance,
            relinKeys.instance,
            destination.instance,
            pool
          )
          _instance.sumElements(
            destination.instance,
            galoisKeys.instance,
            scheme,
            destination.instance,
            pool
          )
          return
        }

        const newDest = CipherText()
        _instance.multiply(a.instance, b.instance, newDest.instance, pool)
        _instance.relinearize(
          newDest.instance,
          relinKeys.instance,
          newDest.instance,
          pool
        )
        _instance.sumElements(
          newDest.instance,
          galoisKeys.instance,
          scheme,
          newDest.instance,
          pool
        )
        return newDest
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Perform the dot product (A.B) of CipherText (A) and PlainText (B). The resulting CipherText contains the dot
     * product in every element.
     *
     * @function
     * @name Evaluator#dotProductPlain
     * @param {CipherText} a CipherText operand A
     * @param {PlainText} b PlainText operand B
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {SchemeType} scheme Scheme that was used for encryption
     * @param {CipherText} [destination] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|void} CipherText containing the result or void if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.galoisKeys()
     * const cipherTextA = seal.CipherText()
     * const plainTextB = seal.PlainText()
     * // ... after encoding / encrypting some data ...
     * const resultCipher = evaluator.dotProductPlain(cipherTextA, plainTextB, galoisKeys, seal.SchemeTypes.BFV)
     * // or
     * const cipherDest = seal.CipherText()
     * evaluator.dotProductPlain(cipherTextA, plainTextB, galoisKeys, seal.SchemeTypes.BFV, cipherDest)
     */
    dotProductPlain(
      a: CipherText,
      b: PlainText,
      galoisKeys: GaloisKeys,
      scheme: SchemeType,
      destination?: CipherText,
      pool: MemoryPoolHandle = MemoryPoolHandle.global
    ): CipherText | void {
      try {
        if (destination) {
          _instance.multiplyPlain(
            a.instance,
            b.instance,
            destination.instance,
            pool
          )
          _instance.sumElements(
            destination.instance,
            galoisKeys.instance,
            scheme,
            destination.instance,
            pool
          )
          return
        }

        const newDest = CipherText()
        _instance.multiplyPlain(a.instance, b.instance, newDest.instance, pool)
        _instance.sumElements(
          newDest.instance,
          galoisKeys.instance,
          scheme,
          newDest.instance,
          pool
        )
        return newDest
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}

export const EvaluatorInit = ({
  loader
}: LoaderOptions): EvaluatorDependencies => {
  const library: Library = loader.library
  return EvaluatorConstructor(library)
}
