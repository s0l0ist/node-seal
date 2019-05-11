const {loopWhile} = require('deasync')
const seal = require('../bin/a.out.js')

class Module {
  constructor() {
    this._module = null
  }

  get instance() {
    return this._module
  }

  initialize() {
    const timeoutHandle = setTimeout(() => {
      throw new Error('Could not load WASM!')
    }, 5000)

    seal.onRuntimeInitialized = () => {
      clearTimeout(timeoutHandle)
      this._module = seal
    }

    loopWhile(() => {
      return !this._module
    })
  }
}

module.exports = Module
