export const Evaluator = library => ({
  Exception,
  MemoryPoolHandle,
  CipherText,
  PlainText
}) => context => {
  const Constructor = library.Evaluator
  let _instance = null
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
     * @type {instance}
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
     * @param {instance} instance WASM instance
     */
    unsafeInject(instance) {
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
     * @name Evaluator#delete
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
     * @name Evaluator#negate
     * @param {CipherText} encrypted CipherText to negate
     * @param {CipherText} [destination=null] CipherText to store the negated results
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherText = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.negate(cipherText)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.negate(encrypted, cipherDest)
     */
    negate(encrypted, destination) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the sum
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * const cipherTextB = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.add(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.add(cipherTextA, cipherTextB, cipherDest)
     */
    add(a, b, destination) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the difference
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * const cipherTextB = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.sub(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.sub(cipherTextA, cipherTextB, cipherDest)
     */
    sub(a, b, destination) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the product
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * const cipherTextB = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.multiply(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.multiply(cipherTextA, cipherTextB, cipherDest)
     */
    multiply(a, b, destination, pool = MemoryPoolHandle.global) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the squared result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.square(cipherTextA, cipherTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.square(cipherTextA, cipherDest)
     */
    square(encrypted, destination, pool = MemoryPoolHandle.global) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the relinearized result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const relinKeys = keyGenerator.genRelinKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.relinearize(cipherTextA, relinKeys)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.relinearize(cipherTextA, relinKeys, cipherDest)
     */
    relinearize(
      encrypted,
      relinKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the switched result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.cipherModSwitchToNext(cipherTextA)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.cipherModSwitchToNext(cipherTextA, cipherDest)
     */
    cipherModSwitchToNext(
      encrypted,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the switched result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const context = Morfix.Context(encParms, true)
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.cipherModSwitchTo(cipherTextA, parmsId)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.cipherModSwitchTo(cipherTextA, parmsId, cipherDest)
     */
    cipherModSwitchTo(
      encrypted,
      parmsId,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {PlainText} [destination=null] PlainText destination to store the switched result
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     * @example
     * const plainTextA = Morfix.PlainText()
     * // ... after encoding some data ...
     * const resultCipher = evaluator.plainModSwitchToNext(plainTextA)
     * // or
     * const plainDest = Morfix.PlainText()
     * evaluator.plainModSwitchToNext(plainTextA, plainDest)
     */
    plainModSwitchToNext(plain, destination) {
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
     * @param {PlainText} [destination=null] PlainText destination to store the switched result
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     * @example
     * const context = Morfix.Context(encParms, true)
     * const plainTextA = Morfix.PlainText()
     * // ... after encoding some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.plainModSwitchTo(plainTextA, parmsId)
     * // or
     * const plainDest = Morfix.PlainText()
     * evaluator.plainModSwitchTo(plainTextA, parmsId, plainDest)
     */
    plainModSwitchTo(plain, parmsId, destination) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the rescaled result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rescaleToNext(cipherTextA)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.rescaleToNext(cipherTextA, cipherDest)
     */
    rescaleToNext(encrypted, destination, pool = MemoryPoolHandle.global) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the rescaled result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const context = Morfix.Context(encParms, true)
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.rescaleTo(cipherTextA, parmsId)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.rescaleTo(cipherTextA, parmsId, cipherDest)
     */
    rescaleTo(encrypted, parmsId, destination, pool = MemoryPoolHandle.global) {
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
     * @param {Number} exponent Positive integer to exponentiate the CipherText
     * @param {RelinKeys} relinKeys RelinKeys used to perform relinearization after each exponentiation
     * @param {CipherText} [destination=null] CipherText destination to store the exponentiated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const relinKeys = keyGenerator.genRelinKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.exponentiate(cipherTextA, 3, relinKeys)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.exponentiate(cipherTextA, 3, relinKeys, cipherDest)
     */
    exponentiate(
      encrypted,
      exponent,
      relinKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the sum
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * const plainTextB = Morfix.PlainText()
     * // ... after encrypting/encoding some data ...
     * const resultCipher = evaluator.addPlain(cipherTextA, plainTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.addPlain(cipherTextA, plainTextB, cipherDest)
     */
    addPlain(encrypted, plain, destination) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the difference
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * const plainTextB = Morfix.PlainText()
     * // ... after encrypting/encoding some data ...
     * const resultCipher = evaluator.subPlain(cipherTextA, plainTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.subPlain(cipherTextA, plainTextB, cipherDest)
     */
    subPlain(encrypted, plain, destination) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the product
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * const plainTextB = Morfix.PlainText()
     * // ... after encrypting/encoding some data ...
     * const resultCipher = evaluator.multiplyPlain(cipherTextA, plainTextB)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.multiplyPlain(cipherTextA, plainTextB, cipherDest)
     */
    multiplyPlain(
      encrypted,
      plain,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @name Evaluator#plainTransformToNtt
     * @param {PlainText} plain PlainText to transform
     * @param {ParmsIdType} parmsId target parmsId to perform NTT transformation
     * @param {PlainText} [destinationNtt=null] PlainText destination to store the transformed result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {PlainText|undefined} PlainText containing the result or undefined if a destination was supplied
     * @example
     * const context = Morfix.Context(encParms, true)
     * const plainTextA = Morfix.PlainText()
     * // ... after encoding some data ...
     * const parmsId = context.lastParmsId
     * const resultCipher = evaluator.plainTransformToNtt(plainTextA, parmsId)
     * // or
     * const plainDest = Morfix.PlainText()
     * evaluator.plainTransformToNtt(plainTextA, parmsId, plainDest)
     */
    plainTransformToNtt(
      plain,
      parmsId,
      destinationNtt,
      pool = MemoryPoolHandle.global
    ) {
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
     * Number Theoretic Transform separately to each polynomial of a CipherText.
     * The result is stored in the destinationNtt parameter.
     *
     * @function
     * @name Evaluator#cipherTransformToNtt
     * @param {CipherText} encrypted CipherText to transform
     * @param {CipherText} [destinationNtt=null] CipherText destination to store the transformed result
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.cipherTransformToNtt(cipherTextA)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.cipherTransformToNtt(cipherTextA, cipherDest)
     */
    cipherTransformToNtt(encrypted, destinationNtt) {
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
     * inverse of David Harvey's Number Theoretic Transform separately to each
     * polynomial of a CipherText. The result is stored in the destination parameter.
     *
     * @function
     * @name Evaluator#cipherTransformFromNtt
     * @param {CipherText} encryptedNtt CipherText to transform
     * @param {CipherText} [destination=null] CipherText destination to store the transformed result
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * // ... after cipherTransformToNtt ...
     * const resultCipher = evaluator.cipherTransformFromNtt(cipherTextANtt)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.cipherTransformFromNtt(cipherTextANtt, cipherDest)
     */
    cipherTransformFromNtt(encryptedNtt, destination) {
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
     * @param {Number} galoisElt Number representing the Galois element
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination=null] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * ...
     * const evaluator = Morfix.Evaluator(context)
     * const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
     * const plain = encoder.encode(arr)
     * const cipher = encryptor.encrypt(plain)
     * const cipherDest = Morfix.CipherText()
     * const galElt = 2 * parms.polyModulusDegree - 1
     * evaluator.applyGalois(cipher, galElt, galoisKeys, cipherDest)
     */
    applyGalois(
      encrypted,
      galoisElt,
      galoisKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {Number} steps Int representing steps to rotate (negative = right, positive = left)
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination=null] CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.genGaloisKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rotateRows(cipherTextA, 3, galoisKeys)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.rotateRows(cipherTextA, 3, galoisKeys, cipherDest)
     */
    rotateRows(
      encrypted,
      steps,
      galoisKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.genGaloisKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rotateColumns(cipherTextA, galoisKeys)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.rotateColumns(cipherTextA, galoisKeys, cipherDest)
     */
    rotateColumns(
      encrypted,
      galoisKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {Number} steps Int representing steps to rotate (negative = right, positive = left)
     * @param {GaloisKeys} galoisKeys GaloisKeys used to perform rotations
     * @param {CipherText} [destination=null] CipherText destination to store the rotated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.genGaloisKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.rotateVector(cipherTextA, 3, galoisKeys)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.rotateVector(cipherTextA, 3, galoisKeys, cipherDest)
     */
    rotateVector(
      encrypted,
      steps,
      galoisKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the conjugated result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.genGaloisKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.complexConjugate(cipherTextA, galoisKeys)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.complexConjugate(cipherTextA, galoisKeys, cipherDest)
     */
    complexConjugate(
      encrypted,
      galoisKeys,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const galoisKeys = keyGenerator.genGaloisKeys()
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.sumElements(cipherTextA, galoisKeys, Morfix.SchemeTypes.BFV)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.sumElements(cipherTextA, galoisKeys, Morfix.SchemeTypes.BFV, cipherDest)
     */
    sumElements(
      encrypted,
      galoisKeys,
      scheme,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
     * @param {CipherText} [destination=null] CipherText destination to store the result
     * @param {MemoryPoolHandle} [pool={@link MemoryPoolHandle.global}] MemoryPool to use
     * @returns {CipherText|undefined} CipherText containing the result or undefined if a destination was supplied
     * @example
     * const relinKeys = keyGenerator.genRelinKeys()
     * const galoisKeys = keyGenerator.genGaloisKeys()
     * const cipherTextA = Morfix.CipherText()
     * const cipherTextB = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const resultCipher = evaluator.dotProduct(cipherTextA, cipherTextB, relinKeys, galoisKeys, Morfix.SchemeTypes.BFV)
     * // or
     * const cipherDest = Morfix.CipherText()
     * evaluator.dotProduct(cipherTextA, cipherTextB, relinKeys, galoisKeys, Morfix.SchemeTypes.BFV, cipherDest)
     */
    dotProduct(
      a,
      b,
      relinKeys,
      galoisKeys,
      scheme,
      destination,
      pool = MemoryPoolHandle.global
    ) {
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
    }
  }
}
