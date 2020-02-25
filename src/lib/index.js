import source from '../bin/seal.js'
import sourceWasm from '../bin/seal'

import { pipe, entries, reduce } from './util'

import { SEAL } from './Seal'
import { Library } from './library'

import * as Components from '../components'

export const Seal = (async () => {
  /*
   * First, we initialize the library which loads from a WASM file/base64 string.
   * This file is loaded asynchronously and therefore we must wait
   * until it has fully initialized.
   */

  const lib = Library()
  await lib.initialize({ source, sourceWasm })

  // Add a component
  const addToComponent = lib => (acc, [key, val]) => {
    acc[key] = val(lib)
    return acc
  }

  // Add the library instance to all components
  const addLibraryToComponents = pipe(
    entries,
    reduce(addToComponent(lib.instance))({})
  )

  const factories = addLibraryToComponents(Components)

  return SEAL(factories)
})()
