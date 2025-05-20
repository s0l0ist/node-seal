import sealLibrary from 'seal_allows_wasm_cf_worker'
import { SEALLibrary } from './implementation/seal'
import { Loader, createLoader } from './main/loader'
import { SEAL } from './main/seal'

/**
 * Main export for node-seal
 */
export default async (wasmBinary: WebAssembly.Module): Promise<SEALLibrary> => {
    const library = await sealLibrary({
        instantiateWasm(info: any, cb: any) {
            const instance = new WebAssembly.Instance(wasmBinary, info);
            cb(instance, wasmBinary)
        }
    });
    return SEAL(async () => ({ library }))
}
