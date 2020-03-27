export const Vector = library => ({ Exception }) => (
  array = new Int32Array(0)
) => {
  // Static methods
  const _vecFromArrayUint8 = library.vecFromArrayUint8
  const _vecFromArrayInt32 = library.vecFromArrayInt32
  const _vecFromArrayUint32 = library.vecFromArrayUint32
  const _vecFromArrayDouble = library.vecFromArrayDouble
  const _jsArrayUint8FromVec = library.jsArrayUint8FromVec
  const _jsArrayInt32FromVec = library.jsArrayInt32FromVec
  const _jsArrayUint32FromVec = library.jsArrayUint32FromVec
  const _jsArrayDoubleFromVec = library.jsArrayDoubleFromVec

  const _type = array.constructor

  let _instance = createVector(array)

  function createVector(array) {
    try {
      if (array.constructor === Uint8Array) {
        return _vecFromArrayUint8(array)
      }
      if (array.constructor === Int32Array) {
        return _vecFromArrayInt32(array)
      }
      if (array.constructor === Uint32Array) {
        return _vecFromArrayUint32(array)
      }
      if (array.constructor === Float64Array) {
        return _vecFromArrayDouble(array)
      }
      throw new Error('Unsupported vector type!')
    } catch (e) {
      throw Exception.safe(e)
    }
  }

  /**
   * @implements Vector
   */

  /**
   * @interface Vector
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Vector#instance
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
     * @name Vector#unsafeInject
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
     * @name Vector#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * The Vector type
     *
     * @readonly
     * @name Vector#type
     * @type {(Int32ArrayConstructor|Uint32ArrayConstructor|Float64ArrayConstructor)}
     */
    get type() {
      return _type
    },

    /**
     * The vector size
     *
     * @readonly
     * @name Vector#size
     * @type {Number}
     */
    get size() {
      return _instance.size()
    },

    /**
     * Get a value pointed to by the specified index
     *
     * @function
     * @name Vector#getValue
     * @param {Number} index Index of the Vector
     * @returns {Number} Value of the element in the Vector pointed to by the index
     */
    getValue(index) {
      try {
        return _instance.get(index)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Resizes a vector to the given size
     *
     * @function
     * @name Vector#resize
     * @param {Number} size Number of elements to resize
     * @param {Number} fill Data to fill the vector with
     */
    resize(size, fill) {
      try {
        _instance.resize(size, fill)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Copy a vector's data into a Typed Array
     *
     * Note: we cannot simply return a view on the underlying ArrayBuffer
     * because emscripten's memory can grow and cause all the views to become
     * neutered. We have to perform a hard copy to get data from WASM heap to JS.
     *
     * @function
     * @name Vector#toArray
     * @returns {(Uint8Array|Int32Array|Uint32Array|Float64Array)} TypedArray containing values from the Vector
     */
    toArray() {
      switch (_type) {
        case Uint8Array:
          return Uint8Array.from(_jsArrayUint8FromVec(_instance))
        case Int32Array:
          return Int32Array.from(_jsArrayInt32FromVec(_instance))
        case Uint32Array:
          return Uint32Array.from(_jsArrayUint32FromVec(_instance))
        case Float64Array:
          return Float64Array.from(_jsArrayDoubleFromVec(_instance))
      }
    }
  }
}
