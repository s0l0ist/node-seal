import source from '../bin/seal.js'
import sourceWasm from '../bin/seal'

import { SEAL } from './Seal'
import * as Components from '../components'

export const Seal = (async () => {
  const { Library, ...otherComponents } = Components
  /*
   * First, we initialize the library which loads from a WASM file/base64 string.
   * This file is loaded asynchronously and therefore we must wait
   * until it has fully initialized.
   */
  const lib = Library()
  await lib.initialize({ source, sourceWasm })

  /*
   * Now, we can instantiate everything else we need.
   */
  const options = {
    ...otherComponents,
    Library: lib
  }

  return SEAL({ options })
})()
