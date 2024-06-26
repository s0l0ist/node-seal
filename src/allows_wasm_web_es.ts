import sealLibrary from 'seal_allows_wasm_web'
import { SEALLibrary } from './implementation/seal'
import { Loader, createLoader } from './main/loader'
import { SEAL } from './main/seal'
/**
 * Export a function which loads the proper build
 */
const loader = async (): Promise<Loader> => createLoader(sealLibrary)

/**
 * Main export for node-seal
 */
export default async (): Promise<SEALLibrary> => SEAL(loader)
