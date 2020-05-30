import Source from '../bin/js/seal.js'

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
 * Main module export
 */
export const Seal = async () => {
  const wasm = await Source({
    locateFile(path) {
      if (path.endsWith('.wasm')) {
        return Source
      }
      return path
    }
  })
  return createSeal(wasm)
}

export default Seal
