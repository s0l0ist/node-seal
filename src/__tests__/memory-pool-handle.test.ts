import { beforeAll, describe, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('MemoryPoolHandle', () => {
  test('It should get a global handle to the memory pool', () => {
    const _handle = seal.MemoryPoolHandle.Global()
  })
  test('It should get a thread local handle to the memory pool', () => {
    const _handle = seal.MemoryPoolHandle.ThreadLocal()
  })
  test('It should get a global handle to the memory pool (clear on destruct)', () => {
    const _handle = seal.MemoryPoolHandle.New(true)
  })
  test('It should get a global handle to the memory pool (no clear on destruct)', () => {
    const _handle = seal.MemoryPoolHandle.New(false)
  })
})
