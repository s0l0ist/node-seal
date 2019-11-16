export class Vector {
  constructor({library, array = new Int32Array(0)}) {
    this._vecFromArrayInt32 = library.vecFromArrayInt32
    this._vecFromArrayUInt32 = library.vecFromArrayUInt32
    // this._vecFromArrayInt64 = library.vecFromArrayInt64
    // this._vecFromArrayUInt64 = library.vecFromArrayUInt64
    this._vecFromArrayDouble = library.vecFromArrayDouble
    this._printVectorInt32 = library.printVectorInt32
    this._printVectorUInt32 = library.printVectorUInt32
    // this._printVectorInt64 = library.printVectorInt64
    // this._printVectorUInt64 = library.printVectorUInt64
    this._printVectorDouble = library.printVectorDouble
    // this._printVectorComplexDouble = library.printVectorComplexDouble
    this._printMatrixInt32 = library.printMatrixInt32
    this._printMatrixUInt32 = library.printMatrixUInt32

    this._jsArrayInt32FromVec = library.jsArrayInt32FromVec
    this._jsArrayUint32FromVec = library.jsArrayUint32FromVec
    this._jsArrayDoubleFromVec = library.jsArrayDoubleFromVec

    this._type = array.constructor
    this._instance = this.fromArray({array})
  }

  get instance() {
    return this._instance
  }

  inject({instance}) {
    if (this._instance) {
      this._instance.delete()
      this._instance = null
    }
    this._instance = instance
  }

  /**
   * Return the vector type
   * @returns {Int32ArrayConstructor|Uint32ArrayConstructor|Float64ArrayConstructor}
   */
  get type() {
    return this._type
  }

  /**
   * Return the vector size
   * @returns {number}
   */
  get size() {
    return this._instance.size()
  }

  /**
   * Prints a matrix to the console
   *
   * This method is mainly used for debugging this library
   *
   * @param rowSize
   */
  printMatrix({rowSize = this.size / 2} = {}) {
    switch (this._type) {
      case Int32Array: this._printMatrixInt32(this.instance, rowSize); break;
      case Uint32Array: this._printMatrixUInt32(this.instance, rowSize); break;
      default: throw new Error('Unsupported matrix type!')
    }
  }

  /**
   * Prints a vector to the console
   *
   * This method is mainly used for debugging this library
   *
   * @param printSize
   * @param precision
   */
  printVector({printSize = 4, precision = 5} = {}) {
    switch (this._type) {
      case Int32Array: this._printVectorInt32(this.instance, printSize, precision); break;
      case Uint32Array: this._printVectorUInt32(this.instance, printSize, precision); break;
      case Float64Array: this._printVectorDouble(this.instance, printSize, precision); break;
      default: throw new Error('Unsupported vector type!')
    }
  }

  /**
   * Convert a typed array to a vector.
   *
   * The type hint is useful for decryption
   *
   * @param array
   * @returns {vector<int32|uint32|double>}
   */
  fromArray({array}) {
    let vec = null
    switch (array.constructor) {
      case Int32Array:
        vec = this._vecFromArrayInt32(array); break;
      case Uint32Array:
        vec = this._vecFromArrayUInt32(array); break;
      case Float64Array:
        vec = this._vecFromArrayDouble(array); break;
      default: throw new Error('Unsupported vector type!')
    }
    return vec
  }

  /**
   * Get a value pointed to by the specified index
   * @param index
   * @returns {number}
   */
  getValue({index}) {
    return this._instance.get(index)
  }

  /**
   * Resizes a vector to the given size
   * @param size
   * @param fill
   */
  resize({size, fill}) {
    this._instance.resize(size, fill)
  }

  /**
   * Copy a vector's data into a Typed or regular JS array
   * @returns {Int32Array|Uint32Array|Float64Array}
   */
  toArray() {
    let arr = null
    switch (this._type) {
      case Int32Array:
        arr = this._jsArrayInt32FromVec(this._instance); break;
      case Uint32Array:
        arr = this._jsArrayUint32FromVec(this._instance); break;
      case Float64Array:
        arr = this._jsArrayDoubleFromVec(this._instance); break;
      default: throw new Error('Unsupported vector type!')
    }
    return arr
  }
}
