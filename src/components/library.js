import pathlib from 'path'

/**
 * Library
 * @typedef {Object} Library
 * @constructor
 */
export const Library = () => {
  let _module = null
  let _timeout = null

  return {
    /**
     * Get the underlying wasm instance
     * @returns {instance} wasm instance
     * @private
     */
    get instance() {
      return _module
    },
    /**
     * Initialize the library
     * @param {Object} options Options
     * @param {*} options.source Source library
     * @param {*} options.sourceWasm Source WASM file
     * @returns {Promise<null>}
     */
    initialize: async ({ source, sourceWasm }) => {
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

            if (path.endsWith('.wasm')) {
              return sourceWasm
            }
            return path
          }
        })

        _timeout = setTimeout(() => {
          reject(new Error('Could not initialize library in time!'))
        }, 10000)

        module.onRuntimeInitialized = () => {
          clearTimeout(_timeout)
          _module = module
          resolve()
        }
      })
    }
  }
}
