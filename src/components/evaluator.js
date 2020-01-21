import { Exception } from './exception'
import { MemoryPoolHandle } from './memory-pool-handle'

export const Evaluator = ({ library, context }) => {
  const _Exception = Exception({ library })
  const _MemoryPoolHandle = MemoryPoolHandle({ library })
  let _instance = null
  try {
    _instance = new library.Evaluator(context.instance)
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @typedef {Object} Evaluator
   * @implements IEvaluator
   */

  /**
   * @interface IEvaluator
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IEvaluator#instance
     * @type {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name IEvaluator#inject
     * @param {Object} options Options
     * @param {instance} options.instance WASM instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name IEvaluator#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Negates a CipherText and stores the result in the destination parameter.
     *
     * @function
     * @name IEvaluator#negate
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to negate
     * @param {CipherText} options.destination CipherText to store the negated result
     */
    negate({ encrypted, destination }) {
      try {
        _instance.negate(encrypted.instance, destination.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Adds two CipherTexts. This function adds together a and b
     * and stores the result in the destination parameter.
     *
     * @function
     * @name IEvaluator#add
     * @param {Object} options Options
     * @param {CipherText} options.a CipherText operand A
     * @param {CipherText} options.b CipherText operand B
     * @param {CipherText} options.destination CipherText destination to store the sum
     */
    add({ a, b, destination }) {
      try {
        _instance.add(a.instance, b.instance, destination.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Subtracts two CipherTexts. This function computes the difference of a
     * and b and stores the result in the destination parameter.
     *
     * @function
     * @name IEvaluator#sub
     * @param {Object} options Options
     * @param {CipherText} options.a CipherText operand A
     * @param {CipherText} options.b CipherText operand B
     * @param {CipherText} options.destination CipherText destination to store the difference
     */
    sub({ a, b, destination }) {
      try {
        _instance.sub(a.instance, b.instance, destination.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Multiplies two CipherTexts. This functions computes the product of a
     * and b and stores the result in the destination parameter. Dynamic
     * memory allocations in the process are allocated from the memory pool pointed
     * to by the given MemoryPoolHandle.
     *
     * @function
     * @name IEvaluator#multiply
     * @param {Object} options Options
     * @param {CipherText} options.a CipherText operand A
     * @param {CipherText} options.b CipherText operand B
     * @param {CipherText} options.destination CipherText destination to store the product
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    multiply({ a, b, destination, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.multiply(a.instance, b.instance, destination.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Squares a CipherText. This functions computes the square of encrypted and
     * stores the result in the destination parameter. Dynamic memory allocations
     * in the process are allocated from the memory pool pointed to by the given
     * MemoryPoolHandle.
     *
     * @function
     * @name IEvaluator#square
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to square
     * @param {CipherText} options.destination CipherText destination to store the squared result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    square({ encrypted, destination, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.square(encrypted.instance, destination.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#relinearize
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to relinearize
     * @param {RelinKeys} options.relinKeys RelinKey used to perform relinearization
     * @param {CipherText} options.destination CipherText destination to store the relinearized result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    relinearize({
      encrypted,
      relinKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.relinearize(
          encrypted.instance,
          relinKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Given a CipherText encrypted modulo q_1...q_k, this function switches the
     * modulus down to q_1...q_{k-1} and stores the result in the destination
     * parameter. Dynamic memory allocations in the process are allocated from
     * the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name IEvaluator#cipherModSwitchToNext
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to switch its modulus down
     * @param {CipherText} options.destination CipherText destination to store the switched result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    cipherModSwitchToNext({
      encrypted,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.cipherModSwitchToNext(
          encrypted.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Given a CipherText encrypted modulo q_1...q_k, this function switches the
     * modulus down until the parameters reach the given parmsId and stores the
     * result in the destination parameter. Dynamic memory allocations in the process
     * are allocated from the memory pool pointed to by the given MemoryPoolHandle.
     *
     * @function
     * @name IEvaluator#cipherModSwitchTo
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to switch its modulus down
     * @param {ParmsIdType} options.parmsId Target parmsId to switch to
     * @param {CipherText} options.destination CipherText destination to store the switched result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    cipherModSwitchTo({
      encrypted,
      parmsId,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.cipherModSwitchTo(
          encrypted.instance,
          parmsId.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Modulus switches an NTT transformed PlainText from modulo q_1...q_k down
     * to modulo q_1...q_{k-1} and stores the result in the destination parameter.
     *
     * @function
     * @name IEvaluator#plainModSwitchToNext
     * @param {Object} options Options
     * @param {PlainText} options.plain PlainText to switch its modulus down
     * @param {PlainText} options.destination PlainText destination to store the switched result
     */
    plainModSwitchToNext({ plain, destination }) {
      try {
        _instance.plainModSwitchToNext(plain.instance, destination.instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Given an NTT transformed PlainText modulo q_1...q_k, this function switches
     * the modulus down until the parameters reach the given parmsId and stores
     * the result in the destination parameter.
     *
     * @function
     * @name IEvaluator#plainModSwitchTo
     * @param {Object} options Options
     * @param {PlainText} options.plain PlainText to switch its modulus down
     * @param {ParmsIdType} options.parmsId Target parmsId to switch to
     * @param {PlainText} options.destination PlainText destination to store the switched result
     */
    plainModSwitchTo({ plain, parmsId, destination }) {
      try {
        _instance.plainModSwitchTo(
          plain.instance,
          parmsId.instance,
          destination.instance
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#rescaleToNext
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to rescale
     * @param {CipherText} options.destination CipherText destination to store the rescaled result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    rescaleToNext({ encrypted, destination, pool = _MemoryPoolHandle.global }) {
      try {
        _instance.rescaleToNext(encrypted.instance, destination.instance, pool)
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#rescaleTo
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to rescale
     * @param {ParmsIdType} options.parmsId Target parmsId to rescale to
     * @param {CipherText} options.destination CipherText destination to store the rescaled result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    rescaleTo({
      encrypted,
      parmsId,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.rescaleTo(
          encrypted.instance,
          parmsId.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#exponentiate
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to exponentiate
     * @param {Number} options.exponent Positive integer to exponentiate the CipherText
     * @param {RelinKeys} options.relinKeys RelinKeys used to perform relinearization after each exponentiation
     * @param {CipherText} options.destination CipherText destination to store the exponentiated result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    exponentiate({
      encrypted,
      exponent,
      relinKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.exponentiate(
          encrypted.instance,
          exponent,
          relinKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Adds a CipherText and a PlainText. This function adds a CipherText and
     * a PlainText and stores the result in the destination parameter. The PlainText
     * must be valid for the current encryption parameters.
     *
     * @function
     * @name IEvaluator#addPlain
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText operand A
     * @param {PlainText} options.plain PlainText operand B
     * @param {CipherText} options.destination CipherText destination to store the sum
     */
    addPlain({ encrypted, plain, destination }) {
      try {
        _instance.addPlain(
          encrypted.instance,
          plain.instance,
          destination.instance
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Subtracts a PlainText from a CipherText. This function subtracts a PlainText
     * from a CipherText and stores the result in the destination parameter. The
     * PlainText must be valid for the current encryption parameters.
     *
     * @function
     * @name IEvaluator#subPlain
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText operand A
     * @param {PlainText} options.plain PlainText operand B
     * @param {CipherText} options.destination CipherText destination to store the difference
     */
    subPlain({ encrypted, plain, destination }) {
      try {
        _instance.subPlain(
          encrypted.instance,
          plain.instance,
          destination.instance
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#multiplyPlain
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText operand A
     * @param {PlainText} options.plain PlainText operand B
     * @param {CipherText} options.destination CipherText destination to store the product
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    multiplyPlain({
      encrypted,
      plain,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.multiplyPlain(
          encrypted.instance,
          plain.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Transforms a PlainText to NTT domain. This functions applies the Number
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
     * @name IEvaluator#plainTransformToNtt
     * @param {Object} options Options
     * @param {PlainText} options.plain PlainText to transform
     * @param {ParmsIdType} options.parmsId target parmsId to perform NTT transformation
     * @param {PlainText} options.destinationNtt PlainText destination to store the transformed result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    plainTransformToNtt({
      plain,
      parmsId,
      destinationNtt,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.plainTransformToNtt(
          plain.instance,
          parmsId.instance,
          destinationNtt.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Transforms a CipherText to NTT domain. This functions applies David Harvey's
     * Number Theoretic Transform separately to each polynomial of a CipherText.
     * The result is stored in the destinationNtt parameter.
     *
     * @function
     * @name IEvaluator#cipherTransformToNtt
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to transform
     * @param {CipherText} options.destinationNtt CipherText destination to store the transformed result
     */
    cipherTransformToNtt({ encrypted, destinationNtt }) {
      try {
        _instance.cipherTransformToNtt(
          encrypted.instance,
          destinationNtt.instance
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Transforms a CipherText back from NTT domain. This functions applies the
     * inverse of David Harvey's Number Theoretic Transform separately to each
     * polynomial of a CipherText. The result is stored in the destination parameter.
     *
     * @function
     * @name IEvaluator#cipherTransformFromNtt
     * @param {Object} options Options
     * @param {CipherText} options.encryptedNtt CipherText to transform
     * @param {CipherText} options.destination CipherText destination to store the transformed result
     */
    cipherTransformFromNtt({ encryptedNtt, destination }) {
      try {
        _instance.cipherTransformFromNtt(
          encryptedNtt.instance,
          destination.instance
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#applyGalois
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to apply the automorphism
     * @param {Number} options.galoisElt Number representing the Galois element
     * @param {GaloisKeys} options.galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} options.destination CipherText destination to store the result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    applyGalois({
      encrypted,
      galoisElt,
      galoisKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.applyGalois(
          encrypted.instance,
          galoisElt,
          galoisKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#rotateRows
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to rotate rows
     * @param {Number} options.steps Int representing steps to rotate (negative = right, positive = left)
     * @param {GaloisKeys} options.galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} options.destination CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    rotateRows({
      encrypted,
      steps,
      galoisKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.rotateRows(
          encrypted.instance,
          steps,
          galoisKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#rotateColumns
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to rotate columns
     * @param {GaloisKeys} options.galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} options.destination CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    rotateColumns({
      encrypted,
      galoisKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.rotateColumns(
          encrypted.instance,
          galoisKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#rotateVector
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to rotate the entire vector
     * @param {Number} options.steps Int representing steps to rotate (negative = right, positive = left)
     * @param {GaloisKeys} options.galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} options.destination CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    rotateVector({
      encrypted,
      steps,
      galoisKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.rotateVector(
          encrypted.instance,
          steps,
          galoisKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
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
     * @name IEvaluator#complexConjugate
     * @param {Object} options Options
     * @param {CipherText} options.encrypted CipherText to complex conjugate
     * @param {GaloisKeys} options.galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} options.destination CipherText destination to store the conjugated result
     * @param {MemoryPoolHandle} [options.pool=MemoryPoolHandle.global] MemoryPool to use
     */
    complexConjugate({
      encrypted,
      galoisKeys,
      destination,
      pool = _MemoryPoolHandle.global
    }) {
      try {
        _instance.complexConjugate(
          encrypted.instance,
          galoisKeys.instance,
          destination.instance,
          pool
        )
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
