import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('PlainModulus', () => {
  test('It should be a static instance', () => {
    expect(Morfix).toHaveProperty('PlainModulus')
    expect(Morfix.PlainModulus).not.toBeUndefined()
    expect(typeof Morfix.PlainModulus.constructor).toBe('function')
    expect(Morfix.PlainModulus).toBeInstanceOf(Object)
    expect(Morfix.PlainModulus.constructor).toBe(Object)
    expect(Morfix.PlainModulus.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    // Test properties
    expect(Morfix.PlainModulus).toHaveProperty('Batching')
    expect(Morfix.PlainModulus).toHaveProperty('BatchingVector')
  })

  test('It should a return a SmallModulus', () => {
    const spyOn = jest.spyOn(Morfix.PlainModulus, 'Batching')
    const smallModulus = Morfix.PlainModulus.Batching(4096, 20)
    expect(spyOn).toHaveBeenCalledWith(4096, 20)
    expect(smallModulus).not.toBeUndefined()
    expect(typeof smallModulus.constructor).toBe('function')
    expect(smallModulus).toBeInstanceOf(Object)
    expect(smallModulus.constructor).toBe(Object)
    expect(smallModulus.constructor.name).toBe('Object')
    expect(smallModulus.instance.constructor.name).toBe('SmallModulus')
    expect(smallModulus.value).toBe(BigInt(1032193))
  })
  test('It should a create a Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(Morfix.PlainModulus, 'BatchingVector')
    const vectSmallModulus = Morfix.PlainModulus.BatchingVector(
      4096,
      Int32Array.from([20, 20, 20])
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([20, 20, 20]))
    expect(vectSmallModulus).not.toBeUndefined()
    expect(typeof vectSmallModulus.constructor).toBe('function')
    expect(vectSmallModulus).toBeInstanceOf(Object)
    expect(vectSmallModulus.constructor.name).toBe('std$$vector$SmallModulus$')
    expect(vectSmallModulus.values()).toBe('925697,974849,1032193')
  })
})
