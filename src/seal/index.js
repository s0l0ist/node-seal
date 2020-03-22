import Source from '../bin/seal'
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
export const Seal = (async () => {
  const wasm = Source()
  return initialize(wasm)
})()
