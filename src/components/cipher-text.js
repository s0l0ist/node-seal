export const CipherText = library => ({
  Exception,
  ComprModeType,
  ParmsIdType,
  MemoryPoolHandle
}) => options => {
  const Constructor = library.Ciphertext
  let _instance = construct(options)

  function construct({
    context = null,
    parmsId = null,
    sizeCapacity = null,
    pool = MemoryPoolHandle.global
  } = {}) {
    try {
      if (context === null && parmsId === null && sizeCapacity === null) {
        return new Constructor(pool)
      } else if (
        context !== null &&
        parmsId === null &&
        sizeCapacity === null
      ) {
        return new Constructor(context.instance, pool)
      } else if (
        context !== null &&
        parmsId !== null &&
        sizeCapacity === null
      ) {
        return new Constructor(context.instance, parmsId.instance, pool)
      } else if (
        context !== null &&
        parmsId !== null &&
        sizeCapacity !== null
      ) {
        return new Constructor(
          context.instance,
          parmsId.instance,
          sizeCapacity.instance,
          pool
        )
      }
    } catch (e) {
      throw Exception.safe(e)
    }
  }

  /**
   * @implements CipherText
   */

  /**
   * @interface CipherText
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name CipherText#instance
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
     * @name CipherText#unsafeInject
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
     * @name CipherText#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Allocates enough memory to accommodate the backing array of a ciphertext
     * with given capacity. In addition to the capacity, the allocation size is
     * determined by the current encryption parameters.
     *
     * @function
     * @name CipherText#reserve
     * @param {Context} context The SEAL Context
     * @param {Number} capacity The capacity to reserve
     */
    reserve(context, capacity) {
      try {
        return _instance.reserve(context.instance, capacity)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Resizes the CipherText to given size, reallocating if the capacity
     * of the CipherText is too small.
     *
     * This function is mainly intended for internal use and is called
     * automatically by functions such as Evaluator.multiply and
     * Evaluator.relinearize. A normal user should never have a reason
     * to manually resize a CipherText.
     *
     * @function
     * @name CipherText#resize
     * @param {Number} size The new size
     */
    resize(size) {
      try {
        return _instance.resize(size)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Resets the CipherText. This function releases any memory allocated
     * by the CipherText, returning it to the memory pool. It also sets all
     * encryption parameter specific size information to zero.
     *
     * @function
     * @name CipherText#release
     */
    release() {
      try {
        return _instance.release()
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * The number of primes in the coefficient modulus of the
     * associated encryption parameters. This directly affects the
     * allocation size of the CipherText.
     *
     * @readonly
     * @name CipherText#coeffModCount
     * @type {Number}
     */
    get coeffModCount() {
      return _instance.coeffModCount()
    },

    /**
     * The degree of the polynomial modulus of the associated
     * encryption parameters. This directly affects the allocation size
     * of the CipherText.
     *
     * @readonly
     * @name CipherText#polyModulusDegree
     * @type {Number}
     */
    get polyModulusDegree() {
      return _instance.polyModulusDegree()
    },

    /**
     * The size of the CipherText.
     *
     * @readonly
     * @name CipherText#size
     * @type {Number}
     */
    get size() {
      return _instance.size()
    },

    /**
     * The capacity of the allocation. This means the largest size
     * of the CipherText that can be stored in the current allocation with
     * the current encryption parameters.
     *
     * @readonly
     * @name CipherText#sizeCapacity
     * @type {Number}
     */
    get sizeCapacity() {
      return _instance.sizeCapacity()
    },

    /**
     * Whether the current CipherText is transparent, i.e. does not require
     * a secret key to decrypt. In typical security models such transparent
     * CipherTexts would not be considered to be valid. Starting from the second
     * polynomial in the current CipherText, this function returns true if all
     * following coefficients are identically zero. Otherwise, returns false.
     *
     * @readonly
     * @name CipherText#isTransparent
     * @type {Boolean}
     */
    get isTransparent() {
      return _instance.isTransparent()
    },

    /**
     * Whether the CipherText is in NTT form.
     *
     * @readonly
     * @name CipherText#isNttForm
     * @type {Boolean}
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * The reference to parmsId.
     * @see {@link EncryptionParameters} for more information about parmsId.
     *
     * @readonly
     * @name CipherText#parmsId
     * @type {ParmsIdType}
     */
    get parmsId() {
      return ParmsIdType(_instance.parmsId())
    },

    /**
     * The reference to the scale. This is only needed when using the
     * CKKS encryption scheme. The user should have little or no reason to ever
     * change the scale by hand.
     *
     * @readonly
     * @name CipherText#scale
     * @type {Number}
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * The currently used MemoryPoolHandle.
     *
     * @readonly
     * @name CipherText#pool
     * @type {MemoryPoolHandle}
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save a cipherText to a base64 string
     *
     * @function
     * @name CipherText#save
     * @param {ComprModeType} [compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {String} base64 encoded string
     */
    save(compression = ComprModeType.deflate) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Load a cipherText from a base64 string
     *
     * @function
     * @name CipherText#load
     * @param {Context} context Encryption context to enforce
     * @param {String} encoded base64 encoded string
     */
    load(context, encoded) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Copy an existing CipherText and overwrite this instance
     *
     * @function
     * @name CipherText#copy
     * @param {CipherText} encrypted CipherText to copy
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const cipherTextB = Morfix.CipherText()
     * cipherTextB.copy(cipherTextA)
     * // cipherTextB holds a copy of cipherTextA
     */
    copy(encrypted) {
      try {
        _instance.copy(encrypted.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Clone and return a new instance of this CipherText
     *
     * @function
     * @name CipherText#clone
     * @returns {CipherText}
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const cipherTextB = cipherTextA.clone()
     * // cipherTextB holds a copy of cipherTextA
     */
    clone() {
      try {
        const clonedInstance = _instance.clone()
        const cipher = CipherText(library)({
          Exception,
          ComprModeType,
          ParmsIdType,
          MemoryPoolHandle
        })()
        cipher.unsafeInject(clonedInstance)
        return cipher
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Move a CipherText into this one and delete the old reference
     *
     * @function
     * @name CipherText#move
     * @param {CipherText} encrypted CipherText to move
     * @example
     * const cipherTextA = Morfix.CipherText()
     * // ... after encrypting some data ...
     * const cipherTextB = Morfix.CipherText()
     * cipherTextB.move(cipherTextA)
     * // cipherTextB holds a the instance of cipherTextA.
     * // cipherTextA no longer holds an instance
     */
    move(encrypted) {
      try {
        _instance.move(encrypted.instance)
        // TODO: find optimization
        // This method results in a copy instead of a real move.
        // Therefore, we need to delete the old instance.
        encrypted.delete()
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
