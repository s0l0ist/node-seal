import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('ParmsIdType', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('ParmsIdType')
    expect(Morfix.ParmsIdType).not.toBeUndefined()
    expect(typeof Morfix.ParmsIdType.constructor).toBe('function')
    expect(Morfix.ParmsIdType).toBeInstanceOf(Object)
    expect(Morfix.ParmsIdType.constructor).toBe(Function)
    expect(Morfix.ParmsIdType.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.ParmsIdType()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('inject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('values')
  })
  test('It should have an instance', () => {
    const item = Morfix.ParmsIdType()
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.ParmsIdType()
    const newItem = Morfix.ParmsIdType()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.ParmsIdType()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.values).toThrow(TypeError)
  })
  test('It should return values', () => {
    const parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    parms.setPolyModulusDegree(4096)
    parms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
    const context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const item = context.firstParmsId
    const values = item.values
    expect(Array.isArray(values)).toBe(true)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(values).toEqual([
      1873000747715295028n,
      11215186030905010692n,
      3414445251667737935n,
      182315704735341130n
    ])
  })
  test('It should construct from no args', () => {
    const spyOn = jest.spyOn(Morfix, 'ParmsIdType')
    const item = Morfix.ParmsIdType()
    expect(spyOn).toHaveBeenCalledWith()
    expect(item).not.toBeUndefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('ParmsIdType')
    const values = item.values
    expect(Array.isArray(values)).toBe(true)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(values).toEqual([0n, 0n, 0n, 0n])
  })
})
