export class Vector {
  constructor({library}) {
    this._library = library
    this._vecFromArrayInt32 = library.vecFromArrayInt32
    this._vecFromArrayUInt32 = library.vecFromArrayUInt32
    this._vecFromArrayInt64 = library.vecFromArrayInt64
    this._vecFromArrayUInt64 = library.vecFromArrayUInt64
    this._vecFromArrayDouble = library.vecFromArrayDouble
    this._printVectorInt32 = library.printVectorInt32
    this._printVectorUInt32 = library.printVectorUInt32
    this._printVectorInt64 = library.printVectorInt64
    this._printVectorUInt64 = library.printVectorUInt64
    this._printVectorDouble = library.printVectorDouble
    this._printVectorComplexDouble = library.printVectorComplexDouble
    this._printMatrixInt32 = library.printMatrixInt32
    this._printMatrixUInt32 = library.printMatrixUInt32
  }

  printMatrix({vector, rowSize, type}) {
    switch (type) {
      case 'int32': return this._printMatrixInt32(vector, rowSize)
      case 'uint32': return this._printMatrixUInt32(vector, rowSize)
      default: return this._printMatrixInt32(vector, rowSize)
    }
  }

  printVector({vector, printSize, precision, type}) {
    switch (type) {
      case 'int32': return this._printVectorInt32(vector, printSize, precision)
      case 'uint32': return this._printVectorUInt32(vector, printSize, precision)
      case 'int64': return this._printVectorInt64(vector, printSize, precision)
      case 'uint64': return this._printVectorUInt64(vector, printSize, precision)
      case 'double': return this._printVectorDouble(vector, printSize, precision)
      case 'complexDouble': return this._printVectorComplexDouble(vector, printSize, precision)
      default: return this._printVectorInt32(vector, printSize, precision)
    }
  }

  vecFromArray({array, type}) {
    switch (type) {
      case 'int32': return this._vecFromArrayInt32(array)
      case 'uint32': return this._vecFromArrayUInt32(array)
      case 'int64': return this._vecFromArrayInt64(array)
      case 'uint64': return this._vecFromArrayUInt64(array)
      case 'double': return this._vecFromArrayDouble(array)
    }
  }
}
