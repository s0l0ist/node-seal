import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('MemoryManager', () => {
  test('It should get the default memory pool', () => {
    const pool = seal.MemoryManager.GetPool()
    expect(pool.isInitialized()).toBe(true)
    expect(pool.allocByteCount()).toBe(
      seal.MemoryPoolHandle.Global().allocByteCount()
    )
  })
  test('It should get a new memory pool with a profile option', () => {
    const pool = seal.MemoryManager.GetPool(2n)
    const plain = seal.Plaintext.withPool(pool)
    plain.resize(1024)
    const pool2 = seal.MemoryManager.GetPool(2n)
    expect(pool.allocByteCount()).toBeGreaterThan(0)
    expect(pool2.isInitialized()).toBe(true)
    expect(pool2.allocByteCount()).toBe(0)
  })
  test('It should use a fixed profile for default allocations', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const profile = new seal.MMProfFixed(pool)
    const previous = seal.MemoryManager.SwitchProfile(profile)
    try {
      const plain = new seal.Plaintext(1024)
      expect(pool.allocByteCount()).toBeGreaterThan(0)
      expect(plain.pool().allocByteCount()).toBe(pool.allocByteCount())
      expect(seal.MemoryManager.GetPool().allocByteCount()).toBe(
        pool.allocByteCount()
      )
      expect(seal.MemoryManager.GetPool(1n).allocByteCount()).toBe(
        seal.MemoryPoolHandle.Global().allocByteCount()
      )
      expect(seal.MemoryManager.GetPool(2n).allocByteCount()).toBe(0)
    } finally {
      seal.MemoryManager.SwitchProfile(previous)
    }
    expect(seal.MemoryManager.GetPool().allocByteCount()).toBe(
      seal.MemoryPoolHandle.Global().allocByteCount()
    )
  })
  test('It should return and restore the previous fixed profile', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const profile = new seal.MMProfFixed(pool)
    const original = seal.MemoryManager.SwitchProfile(profile)
    try {
      const previous = seal.MemoryManager.SwitchProfile(new seal.MMProfGlobal())
      expect(previous.isAliasOf(profile)).toBe(true)
      expect(previous.getPool(0n).allocByteCount()).toBe(0)
      seal.MemoryManager.SwitchProfile(previous)
      const plain = new seal.Plaintext(1024)
      expect(pool.allocByteCount()).toBeGreaterThan(0)
      expect(plain.pool().allocByteCount()).toBe(pool.allocByteCount())
    } finally {
      seal.MemoryManager.SwitchProfile(original)
    }
  })
  test('It should keep existing objects on their original pool after switching', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const previous = seal.MemoryManager.SwitchProfile(
      new seal.MMProfFixed(pool)
    )
    try {
      const plain = new seal.Plaintext(1024)
      const allocated = pool.allocByteCount()
      seal.MemoryManager.SwitchProfile(new seal.MMProfGlobal())
      plain.resize(2048)
      expect(pool.allocByteCount()).toBeGreaterThan(allocated)
      expect(plain.pool().allocByteCount()).toBe(pool.allocByteCount())
      expect(seal.MemoryManager.GetPool().allocByteCount()).toBe(
        seal.MemoryPoolHandle.Global().allocByteCount()
      )
    } finally {
      seal.MemoryManager.SwitchProfile(previous)
    }
  })
  test('It should allocate from a new pool with a new profile', () => {
    const previous = seal.MemoryManager.SwitchProfile(new seal.MMProfNew())
    try {
      const plain = new seal.Plaintext(1024)
      const plain2 = new seal.Plaintext(2048)
      expect(plain.pool().allocByteCount()).toBeGreaterThan(0)
      expect(plain2.pool().allocByteCount()).toBeGreaterThan(
        plain.pool().allocByteCount()
      )
      expect(seal.MemoryManager.GetPool().allocByteCount()).toBe(0)
    } finally {
      seal.MemoryManager.SwitchProfile(previous)
    }
  })
  test('It should allocate from the thread local pool with a thread local profile', () => {
    const previous = seal.MemoryManager.SwitchProfile(
      new seal.MMProfThreadLocal()
    )
    try {
      const plain = new seal.Plaintext(1024)
      expect(plain.pool().allocByteCount()).toBeGreaterThan(0)
      expect(plain.pool().allocByteCount()).toBe(
        seal.MemoryPoolHandle.ThreadLocal().allocByteCount()
      )
      expect(seal.MemoryManager.GetPool().allocByteCount()).toBe(
        seal.MemoryPoolHandle.ThreadLocal().allocByteCount()
      )
    } finally {
      seal.MemoryManager.SwitchProfile(previous)
    }
  })
  test('It should return to the global pool with a global profile', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const previous = seal.MemoryManager.SwitchProfile(
      new seal.MMProfFixed(pool)
    )
    try {
      seal.MemoryManager.SwitchProfile(new seal.MMProfGlobal())
      const plain = new seal.Plaintext(1024)
      expect(plain.pool().allocByteCount()).toBeGreaterThan(0)
      expect(plain.pool().allocByteCount()).toBe(
        seal.MemoryPoolHandle.Global().allocByteCount()
      )
      expect(pool.allocByteCount()).toBe(0)
    } finally {
      seal.MemoryManager.SwitchProfile(previous)
    }
  })
  test('It should keep active and restored profiles after deleting their handles', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const profile = new seal.MMProfFixed(pool)
    const original = seal.MemoryManager.SwitchProfile(profile)
    try {
      profile.delete()
      expect(profile.isDeleted()).toBe(true)
      const plain = new seal.Plaintext(1024)
      expect(pool.allocByteCount()).toBeGreaterThan(0)
      expect(plain.pool().allocByteCount()).toBe(pool.allocByteCount())
      const previous = seal.MemoryManager.SwitchProfile(new seal.MMProfGlobal())
      seal.MemoryManager.SwitchProfile(previous)
      previous.delete()
      expect(previous.isDeleted()).toBe(true)
      const plain2 = new seal.Plaintext(2048)
      expect(plain2.pool().allocByteCount()).toBe(pool.allocByteCount())
    } finally {
      seal.MemoryManager.SwitchProfile(original)
    }
  })
  test('It should fail to switch to a null profile without changing the current profile', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const previous = seal.MemoryManager.SwitchProfile(
      new seal.MMProfFixed(pool)
    )
    try {
      try {
        seal.MemoryManager.SwitchProfile(null)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual([
          'std::invalid_argument',
          'mm_prof cannot be null'
        ])
      }
      const plain = new seal.Plaintext(1024)
      expect(pool.allocByteCount()).toBeGreaterThan(0)
      expect(plain.pool().allocByteCount()).toBe(pool.allocByteCount())
    } finally {
      seal.MemoryManager.SwitchProfile(previous)
    }
  })
})

describe('MMProf', () => {
  test('It should get the global memory pool from a global profile', () => {
    const profile = new seal.MMProfGlobal()
    const pool = profile.getPool(0n)
    const plain = seal.Plaintext.withPool(pool)
    plain.resize(1024)
    expect(pool.isInitialized()).toBe(true)
    expect(pool.allocByteCount()).toBe(
      seal.MemoryPoolHandle.Global().allocByteCount()
    )
  })
  test('It should get a new memory pool from a new profile', () => {
    const profile = new seal.MMProfNew()
    const pool = profile.getPool(0n)
    const plain = seal.Plaintext.withPool(pool)
    plain.resize(1024)
    const pool2 = profile.getPool(0n)
    expect(pool.allocByteCount()).toBeGreaterThan(0)
    expect(pool2.isInitialized()).toBe(true)
    expect(pool2.allocByteCount()).toBe(0)
  })
  test('It should reuse the memory pool from a fixed profile', () => {
    const pool = seal.MemoryPoolHandle.New(false)
    const profile = new seal.MMProfFixed(pool)
    const pool2 = profile.getPool(0n)
    const plain = seal.Plaintext.withPool(pool2)
    plain.resize(1024)
    expect(pool.allocByteCount()).toBeGreaterThan(0)
    expect(pool.allocByteCount()).toBe(pool2.allocByteCount())
  })
  test('It should fail to construct a fixed profile with an uninitialized pool', () => {
    const pool = new seal.MemoryPoolHandle()
    try {
      new seal.MMProfFixed(pool)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'pool is uninitialized'
      ])
    }
  })
  test('It should get the thread local memory pool from a thread local profile', () => {
    const profile = new seal.MMProfThreadLocal()
    const pool = profile.getPool(0n)
    const plain = seal.Plaintext.withPool(pool)
    plain.resize(1024)
    expect(pool.isInitialized()).toBe(true)
    expect(pool.allocByteCount()).toBe(
      seal.MemoryPoolHandle.ThreadLocal().allocByteCount()
    )
  })
})
