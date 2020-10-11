import { SEALLibrary } from './implementation/seal'
import sealLibrary from 'seal_throws_wasm_worker'
import { Loader, createLoader } from './main/loader'
import { SEAL } from './main/seal'
/**
 * Export a function which loads the proper build
 */
const Loader = async (): Promise<Loader> => createLoader(sealLibrary)

/**
 * Main export for node-seal
 */
export default async (): Promise<SEALLibrary> => SEAL(Loader)
