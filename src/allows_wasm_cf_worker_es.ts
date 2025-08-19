import sealLibrary from 'seal_allows_wasm_cf_worker'
import { SEALLibrary } from './implementation/seal'
import { SEAL } from './main/seal'

/**
 * Main export for node-seal
 */
export default async (wasmBinary: WebAssembly.Module): Promise<SEALLibrary> => {
  const library = await sealLibrary({
    instantiateWasm(
      info: WebAssembly.Imports,
      cb: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void
    ) {
      const instance = new WebAssembly.Instance(wasmBinary, info)
      cb(instance, wasmBinary)
    }
  })
  return SEAL(async () => ({ library }))
}
