import { Library } from '../implementation/seal'

export interface Loader {
  readonly library: Library
}

/**
 * Export a default function which instantiates the library
 * @param {Object} bin Emscripten library to initialize
 */
export const createLoader = async (
  bin: () => Promise<Library>
): Promise<Loader> => ({
  library: await bin()
})
