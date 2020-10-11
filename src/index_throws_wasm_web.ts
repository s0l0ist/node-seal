import { SEALLibrary } from 'implementation/seal'
import sealLibrary from 'seal_throws_transparent_wasm_web'
import { NestedLibrary, createLoader } from './loader'
import { SEAL } from './seal'
/**
 * Export a function which loads the proper build
 */
const Loader = async (): Promise<NestedLibrary> => createLoader(sealLibrary)

/**
 * Main export for node-seal
 */
export default async (): Promise<SEALLibrary> => SEAL(Loader)
