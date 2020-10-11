import { SEALLibrary } from 'implementation/seal'
import sealLibrary from 'seal_allows_transparent_js_node'
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
