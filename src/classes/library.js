import pathlib from 'path'

export class Library {
  constructor() {
    this._module = null
    this._timeout = null
  }

  get instance() {
    return this._module
  }

  async initialize({source, sourceWasm}) {
    return await new Promise((resolve, reject) => {
      // If we tell emscripten to build both js and wasm, this code is needed
      // Right now, we use single file js where the wasm is a base64 string so
      // this code block doesn't execute.
      const module = source({
        locateFile(path) {
          // for jest
          if (process.env.NODE_ENV !== 'production') {
            return pathlib.resolve(__dirname, '../bin', path)
          }

          if(path.endsWith('.wasm')) {
            return sourceWasm
          }
          return path
        }
      })

      this._timeout = setTimeout(() => {
        reject()
      }, 10000)

      module.onRuntimeInitialized = () => {
        clearTimeout(this._timeout)
        this._module = module
        resolve()
      }
    })
  }
}
