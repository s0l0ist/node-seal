import Source from '../bin/seal'
import { SEAL } from './seal'

let library = null

const createSeal = wasm => {
  library = wasm
  return SEAL(wasm)
}

const initialize = wasm =>
  new Promise(
    resolve => (wasm.onRuntimeInitialized = () => resolve(createSeal(wasm)))
  )
export const getLibrary = () => library

export const Seal = (async () => {
  const wasm = Source()
  return initialize(wasm)
})()
