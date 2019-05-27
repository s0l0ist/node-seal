import { resolve } from 'path'

export class Library {
  constructor({source, sourceWasm}) {
    this._module = null
    this._ready = false

    const module = source({
      locateFile(path) {
        // for jest
        if (process.env.NODE_ENV === 'development') {
          return resolve(__dirname, '../bin', path)
        }

        if(path.endsWith('.wasm')) {
          return sourceWasm
        }
        return path
      }
    })

    // Set the callback handle
    module.onRuntimeInitialized = () => {
      this._module = module
      this._ready = true
    }
  }

  get instance() {
    return this._module
  }

  _timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async initialize() {

    let counter = 0

    const check = async () => {

      counter += 1
      if (counter >= 5) {
        throw new Error('Timeout exceeded!')
      }

      if (this._ready === true) {
        return
      }

      // wait a bit and check again
      await this._timeout(500)

      return await check()
    }

    // start checking the ready status.
    return await check()
  }
}
