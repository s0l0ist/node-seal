import { Exception } from './exception'

export const Vector = ({ library, array = new Int32Array(0) }) => {
  const _Exception = Exception({ library })
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
  const _fromArray = ({ array }) => {
    try {
      let vec = null
      switch (array.constructor) {
        case Int32Array:
          vec = _vecFromArrayInt32(array)
          break
        case Uint32Array:
          vec = _vecFromArrayUInt32(array)
          break
        case Float64Array:
          vec = _vecFromArrayDouble(array)
          break
        default:
          throw new Error('Unsupported vector type!')
      }
      return vec
    } catch (e) {
      throw _Exception.safe({ error: e })
    }
  }

  let _instance = _fromArray({ array })

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
     * @param {Object} options Options
     * @param {Number} options.rowSize Number of rows in of the Vector (BFV = polyModDeg / 2, CKKS = polyModDeg)
     */
    printMatrix({ rowSize }) {
      try {
        switch (_type) {
          case Int32Array:
            _printMatrixInt32(_instance, rowSize)
            break
          case Uint32Array:
            _printMatrixUInt32(_instance, rowSize)
            break
          default:
            throw new Error('Unsupported matrix type!')
        }
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Prints a vector to the console
     *
     * This method is mainly used for debugging this library
     *
     * @function
     * @name Vector#printVector
     * @param {Object} options Options
     * @param {Number} [options.printSize=4] Number of elements to print
     * @param {Number} [options.precision=5] Number of decimals to print
     */
    printVector({ printSize = 4, precision = 5 } = {}) {
      try {
        switch (_type) {
          case Int32Array:
            _printVectorInt32(_instance, printSize, precision)
            break
          case Uint32Array:
            _printVectorUInt32(_instance, printSize, precision)
            break
          case Float64Array:
            _printVectorDouble(_instance, printSize, precision)
            break
          default:
            throw new Error('Unsupported vector type!')
        }
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Convert a typed array to a vector.
     *
     * @function
     * @name Vector#fromArray
     * @param {Object} options Options
     * @param {(Int32Array|Uint32Array|Float64Array)} options.array Array of data to save to a Vector
     * @returns {Vector<(Int32Array|Uint32Array|Float64Array)>} Vector containing the same data type as the array
     */
    fromArray({ array }) {
      _fromArray({ array })
    },

    /**
     * Get a value pointed to by the specified index
     *
     * @function
     * @name Vector#getValue
     * @param {Object} options Options
     * @param {Number} options.index Index of the Vector
     * @returns {Number} Value of the element in the Vector pointed to by the index
     */
    getValue({ index }) {
      try {
        return _instance.get(index)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Resizes a vector to the given size
     *
     * @function
     * @name Vector#resize
     * @param {Object} options Options
     * @param {Number} options.size Number of elements to resize
     * @param {Number} options.fill Data to fill the vector with
     */
    resize({ size, fill }) {
      try {
        _instance.resize(size, fill)
      } catch (e) {
        throw _Exception.safe({ error: e })
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
        let arr = null
        switch (_type) {
          case Int32Array:
            arr = _jsArrayInt32FromVec(_instance)
            break
          case Uint32Array:
            arr = _jsArrayUint32FromVec(_instance)
            break
          case Float64Array:
            arr = _jsArrayDoubleFromVec(_instance)
            break
          default:
            throw new Error('Unsupported vector type!')
        }
        return arr
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
