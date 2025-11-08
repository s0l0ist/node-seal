// src/index_throws.ts
import MainModuleFactory, { type MainModule } from './seal_throws.js'
export type * from './seal_throws.js'

export interface InitializeOptions {
  locateFile?: (path: string) => string
  [key: string]: any
}

export async function initialize(
  options: InitializeOptions = {}
): Promise<MainModule> {
  return await MainModuleFactory({
    locateFile: (path: string) => new URL(path, import.meta.url).href,
    ...options
  })
}

export default initialize
