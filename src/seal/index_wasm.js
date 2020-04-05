import Source from '../bin/wasm/seal.js'
// We are embedding wasm as base64 instead of a
// separate file, keeping the include here in case
// we change to loading from a wasm file.
// import SourceWasm from '../bin/seal.wasm'

import { SEAL } from './seal'

/*
 * Helpers for jest tests
 */
let library = null
export const getLibrary = () => library

/*
 * Creates the Seal library
 */
const createSeal = wasm => {
  library = wasm
  return SEAL(wasm)
}

/*
 * Initialize the wasm by resolving on a callback
 */
const initialize = wasm =>
  new Promise(
    resolve => (wasm.onRuntimeInitialized = () => resolve(createSeal(wasm)))
  )

/*
 * Main module export
 */
export const Seal = async () => {
  // Webpack will change the name and potentially the path of the `.wasm` file.
  // We provide a `locateFile` hook to redirect to the appropriate path
  // More details: https://kripken.github.io/emscripten-site/docs/api_reference/module.html
  const wasm = Source({
    locateFile(path) {
      if (path.endsWith('.wasm')) {
        // return SourceWasm
        return Source
      }
      return path
    }
  })
  return initialize(wasm)
}

export default Seal
