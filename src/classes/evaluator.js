export class Evaluator {
  constructor({library}) {
    this._library = library
    this._Evaluator = library.Evaluator

    // Static Methods
    this._MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
    this._MemoryPoolHandleThreadLocal = library.MemoryPoolHandle.MemoryPoolHandleThreadLocal

    this._instance = null
  }

  get instance() {
    return this._instance
  }

  initialize({context}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = new this._Evaluator(context)
  }

  inject({instance}) {
    if (this._instance) {
      delete this._instance
    }
    this._instance = instance
  }

  negate({encrypted, destination}) {
    return this._instance.negate(encrypted, destination)
  }

  add({a, b, destination}) {
    return this._instance.add(a, b, destination)
  }

  sub({a, b, destination}) {
    return this._instance.sub(a, b, destination)
  }

  multiply({a, b, destination}) {
    return this._instance.multiply(a, b, destination, this._MemoryPoolHandleGlobal())
  }

  square({encrypted, destination}) {
    return this._instance.square(encrypted, destination, this._MemoryPoolHandleGlobal())
  }

  relinearize({encrypted, relinKeys, destination}) {
    return this._instance.relinearize(encrypted, relinKeys, destination, this._MemoryPoolHandleGlobal())
  }

  exponentiate({encrypted, exponent, relinKeys, destination}) {
    return this._instance.relinearize(encrypted, exponent, relinKeys, destination, this._MemoryPoolHandleGlobal())
  }

  addPlain({encrypted, plain, destination}) {
    return this._instance.addPlain(encrypted, plain, destination)
  }

  subPlain({encrypted, plain, destination}) {
    return this._instance.subPlain(encrypted, plain, destination)
  }

  multiplyPlain({encrypted, plain, destination}) {
    return this._instance.multiplyPlain(encrypted, plain, destination, this._MemoryPoolHandleGlobal())
  }

  applyGalois({encrypted, galoisElt, galoisKeys, destination}) {
    return this._instance.applyGalois(encrypted, galoisElt, galoisKeys, destination, this._MemoryPoolHandleGlobal())
  }

  rotateRows({encrypted, steps, galoisKeys, destination}) {
    return this._instance.rotateRows(encrypted, steps, galoisKeys, destination, this._MemoryPoolHandleGlobal())
  }

  rotateColumns({encrypted, galoisKeys, destination}) {
    return this._instance.rotateColumns(encrypted, galoisKeys, destination, this._MemoryPoolHandleGlobal())
  }

  rotateVector({encrypted, steps, galoisKeys, destination}) {
    return this._instance.rotateVector(encrypted, steps, galoisKeys, destination, this._MemoryPoolHandleGlobal())
  }

  complexConjugate({encrypted, galoisKeys, destination}) {
    return this._instance.complexConjugate(encrypted, galoisKeys, destination, this._MemoryPoolHandleGlobal())
  }
}
