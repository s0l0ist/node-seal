import source from '../bin/seal'
import { Library } from './library'
import { SEAL } from './Seal'
import * as utils from './utils'
import * as Components from '../components'

export const Utils = utils

export const Seal = (async () => {
  /*
   * First, we initialize the library which loads from a WASM file/base64 string.
   * This file is loaded asynchronously and therefore we must wait
   * until it has fully initialized. The promise breaks when attempting to
   * resolve the module...
   */
  const lib = Library(source)
  await lib.initialize()

  // Add a component
  const addToComponent = lib => (acc, [key, val]) => {
    acc[key] = val(lib)
    return acc
  }

  const { pipe, entries, reduce } = utils
  // Add the library instance to all components
  const addLibraryToComponents = pipe(
    entries,
    reduce(addToComponent(lib.instance))({})
  )

  const factories = addLibraryToComponents(Components)

  return SEAL(factories)
})()
