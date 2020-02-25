export const Vector = library => Exception => ({
  array = new Int32Array(0)
}) => {
  // Static methods
  const _vecFromArrayInt32 = library.vecFromArrayInt32
  const _vecFromArrayUInt32 = library.vecFromArrayUInt32
  const _vecFromArrayDouble = library.vecFromArrayDouble
  const _printVectorInt32 = library.printVectorInt32
  const _printVectorUInt32 = library.printVectorUInt32
  const _printVectorDouble = library.printVectorDouble
  const _printMatrixInt32 = library.printMatrixInt32
  const _printMatrixUInt32 = library.printMatrixUInt32
  const _jsArrayInt32FromVec = library.jsArrayInt32FromVec
  const _jsArrayUint32FromVec = library.jsArrayUint32FromVec
  const _jsArrayDoubleFromVec = library.jsArrayDoubleFromVec

  const _type = array.constructor

  const _fromArray = array => {
    try {
      if (array.constructor === Int32Array) {
        return _vecFromArrayInt32(array)
      }
      if (array.constructor === Uint32Array) {
        return _vecFromArrayUInt32(array)
      }
      if (array.constructor === Float64Array) {
        return _vecFromArrayDouble(array)
      }
      throw new Error('Unsupported vector type!')
    } catch (e) {
      throw Exception.safe(e)
    }
  }

  let _instance = _fromArray(array)

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
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name Vector#inject
     * @param {instance} instance WASM instance
     */
    inject(instance) {
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
     * Prints a matrix to the console
     *
     * This method is mainly used for debugging this library
     *
     * @function
     * @name Vector#printMatrix
     * @param {Number} rowSize Number of rows in of the Vector (BFV = polyModDeg / 2, CKKS = polyModDeg)
     */
    printMatrix(rowSize) {
      try {
        if (_type === Int32Array) {
          _printMatrixInt32(_instance, rowSize)
          return
        }
        if (_type === Uint32Array) {
          _printMatrixUInt32(_instance, rowSize)
          return
        }
        throw new Error('Unsupported matrix type!')
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Prints a vector to the console
     *
     * This method is mainly used for debugging this library
     *
     * @function
     * @name Vector#printVector
     * @param {Number} [printSize=4] Number of elements to print
     * @param {Number} [precision=5] Number of decimals to print
     */
    printVector(printSize = 4, precision = 5) {
      try {
        if (_type === Int32Array) {
          _printVectorInt32(_instance, printSize, precision)
          return
        }
        if (_type === Uint32Array) {
          _printVectorUInt32(_instance, printSize, precision)
          return
        }
        if (_type === Float64Array) {
          _printVectorDouble(_instance, printSize, precision)
          return
        }
        throw new Error('Unsupported vector type!')
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Convert a typed array to a vector.
     *
     * @function
     * @name Vector#fromArray
     * @param {(Int32Array|Uint32Array|Float64Array)} array Array of data to save to a Vector
     * @returns {Vector<(Int32Array|Uint32Array|Float64Array)>} Vector containing the same data type as the array
     */
    fromArray(array) {
      _fromArray(array)
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
     * @function
     * @name Vector#toArray
     * @returns {(Int32Array|Uint32Array|Float64Array)} TypedArray containing values from the Vector
     */
    toArray() {
      try {
        if (_type === Int32Array) {
          return Int32Array.from(_jsArrayInt32FromVec(_instance))
        }
        if (_type === Uint32Array) {
          return Uint32Array.from(_jsArrayUint32FromVec(_instance))
        }
        if (_type === Float64Array) {
          return Float64Array.from(_jsArrayDoubleFromVec(_instance))
        }
        throw new Error('Unsupported vector type!')
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}
