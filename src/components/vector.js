import { Exception } from './exception'

/**
 * Vector
 * @typedef {Object} Vector
 * @constructor
 */
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
      // eslint-disable-next-line no-nested-ternary
      throw new Error(
        typeof e === 'number'
          ? _Exception.getHuman(e)
          : e instanceof Error
          ? e.message
          : e
      )
    }
  }

  let _instance = _fromArray({ array })

  // Public methods
  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     * @private
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw wasm instance
     * @param {Object} options Options
     * @param {instance} options.instance wasm instance
     * @private
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Delete the underlying wasm instance
     *
     * Should be called before dereferencing this object
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Return the vector type
     * @returns {Int32ArrayConstructor|Uint32ArrayConstructor|Float64ArrayConstructor} Constructor used to create the vector
     */
    get type() {
      return _type
    },

    /**
     * Return the vector size
     * @returns {number} number of elements in the vector
     */
    get size() {
      return _instance.size()
    },

    /**
     * Prints a matrix to the console
     *
     * This method is mainly used for debugging this library
     * @param {Object} options Options
     * @param {number} options.rowSize
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
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Prints a vector to the console
     *
     * This method is mainly used for debugging this library
     * @param {Object} options Options
     * @param {number} [options.printSize=4]
     * @param {number} [options.precision=5]
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
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Convert a typed array to a vector.
     * @param {Object} options Options
     * @param {Int32Array|Uint32Array|Float64Array} options.array Array of data to save to a Vector
     * @returns {Vector} Vector whos contents are of the same type as the array passed in.
     */
    fromArray({ array }) {
      _fromArray({ array })
    },

    /**
     * Get a value pointed to by the specified index
     * @param {Object} options Options
     * @param {number} options.index Vector index
     * @returns {number} value in the Vector pointed to by the index
     */
    getValue({ index }) {
      try {
        return _instance.get(index)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Resizes a vector to the given size
     * @param {Object} options Options
     * @param {number} options.size number of elements to resize
     * @param {number} options.fill data to fill the vector with
     */
    resize({ size, fill }) {
      try {
        _instance.resize(size, fill)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    },

    /**
     * Copy a vector's data into a Typed Array
     * @returns {Int32Array|Uint32Array|Float64Array} Typed Array containing values from the Vector
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
        // eslint-disable-next-line no-nested-ternary
        throw new Error(
          typeof e === 'number'
            ? _Exception.getHuman(e)
            : e instanceof Error
            ? e.message
            : e
        )
      }
    }
  }
}
