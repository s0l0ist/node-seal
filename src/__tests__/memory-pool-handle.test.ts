import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('MemoryPoolHandle', () => {
  test('It should construct an uninitialized handle', () => {
    const handle = new seal.MemoryPoolHandle()
    expect(handle.isInitialized()).toBe(false)
    expect(handle.poolCount()).toBe(0)
    expect(handle.allocByteCount()).toBe(0)
    expect(handle.useCount()).toBe(0)
  })
  test('It should get a global handle to the memory pool', () => {
    const handle = seal.MemoryPoolHandle.Global()
    expect(handle.isInitialized()).toBe(true)
    expect(handle.useCount()).toBeGreaterThan(0)
  })
  test('It should get a thread local handle to the memory pool', () => {
    const handle = seal.MemoryPoolHandle.ThreadLocal()
    expect(handle.isInitialized()).toBe(true)
    expect(handle.useCount()).toBeGreaterThan(0)
  })
  test('It should get a new handle to the memory pool (clear on destruct)', () => {
    const handle = seal.MemoryPoolHandle.New(true)
    expect(handle.isInitialized()).toBe(true)
    expect(handle.poolCount()).toBe(0)
    expect(handle.allocByteCount()).toBe(0)
  })
  test('It should get a new handle to the memory pool (no clear on destruct)', () => {
    const handle = seal.MemoryPoolHandle.New(false)
    expect(handle.isInitialized()).toBe(true)
    expect(handle.poolCount()).toBe(0)
    expect(handle.allocByteCount()).toBe(0)
  })
  test('It should report allocations made by a plaintext', () => {
    const handle = seal.MemoryPoolHandle.New(false)
    const plain = seal.Plaintext.withPool(handle)
    plain.resize(1024)
    expect(handle.poolCount()).toBe(1)
    expect(handle.allocByteCount()).toBeGreaterThanOrEqual(1024 * 8)
    expect(plain.pool().allocByteCount()).toBe(handle.allocByteCount())
  })
})
