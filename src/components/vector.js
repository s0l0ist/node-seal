export const Vector = ({library, array = new Int32Array(0)}) => {
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


  const _fromArray = ({array}) => {
    let vec = null
    switch (array.constructor) {
      case Int32Array:
        vec = _vecFromArrayInt32(array); break;
      case Uint32Array:
        vec = _vecFromArrayUInt32(array); break;
      case Float64Array:
        vec = _vecFromArrayDouble(array); break;
      default: throw new Error('Unsupported vector type!')
    }
    return vec
  }

  let _instance = _fromArray({array})

  // Public methods
  return {
    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Return the vector type
     * @returns {Int32ArrayConstructor|Uint32ArrayConstructor|Float64ArrayConstructor}
     */
    get type() {
      return _type
    },

    /**
     * Return the vector size
     * @returns {number}
     */
    get size() {
      return _instance.size()
    },

    /**
     * Prints a matrix to the console
     *
     * This method is mainly used for debugging this library
     *
     * @param rowSize
     */
    printMatrix({rowSize = size / 2} = {}) {
      switch (_type) {
        case Int32Array: _printMatrixInt32(_instance, rowSize); break;
        case Uint32Array: _printMatrixUInt32(_instance, rowSize); break;
        default: throw new Error('Unsupported matrix type!')
      }
    },

    /**
     * Prints a vector to the console
     *
     * This method is mainly used for debugging this library
     *
     * @param printSize
     * @param precision
     */
    printVector({printSize = 4, precision = 5} = {}) {
      switch (_type) {
        case Int32Array: _printVectorInt32(_instance, printSize, precision); break;
        case Uint32Array: _printVectorUInt32(_instance, printSize, precision); break;
        case Float64Array: _printVectorDouble(_instance, printSize, precision); break;
        default: throw new Error('Unsupported vector type!')
      }
    },

    /**
     * Convert a typed array to a vector.
     *
     * The type hint is useful for decryption
     *
     * @param array
     * @returns {vector<int32|uint32|double>}
     */
    fromArray({array}) {
      _fromArray({array})
    },

    /**
     * Get a value pointed to by the specified index
     * @param index
     * @returns {number}
     */
    getValue({index}) {
      return _instance.get(index)
    },

    /**
     * Resizes a vector to the given size
     * @param size
     * @param fill
     */
    resize({size, fill}) {
      _instance.resize(size, fill)
    },

    /**
     * Copy a vector's data into a Typed or regular JS array
     * @returns {Int32Array|Uint32Array|Float64Array}
     */
    toArray() {
      let arr = null
      switch (_type) {
        case Int32Array:
          arr = _jsArrayInt32FromVec(_instance); break;
        case Uint32Array:
          arr = _jsArrayUint32FromVec(_instance); break;
        case Float64Array:
          arr = _jsArrayDoubleFromVec(_instance); break;
        default: throw new Error('Unsupported vector type!')
      }
      return arr
    }
  }
}
