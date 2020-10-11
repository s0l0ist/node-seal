import { Library } from '../implementation/emscripten'

export type NestedLibrary = {
  readonly library: Library
}
export type Loader = NestedLibrary

/**
 * Export a default function which instantiates the library
 * @param {Object} bin Emscripten library to initialize
 */
export const createLoader = async (
  bin: () => Promise<Library>
): Promise<NestedLibrary> => ({
  library: await bin()
})
