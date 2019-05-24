export class Library {
  constructor({source}) {
    this._source = null
    this._ready = false

    // Set the callback handle
    source.onRuntimeInitialized = () => {
      this._source = source
      this._ready = true
    }
  }

  get instance() {
    return this._source
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
