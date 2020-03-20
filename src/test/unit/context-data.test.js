import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null

let ckksParms = null
let ckksContext = null
beforeAll(async () => {
  Morfix = await Seal
  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  ckksParms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  ckksParms.setPolyModulusDegree(4096)
  ckksParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
})

describe('ContextData', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('ContextData')
    expect(Morfix.ContextData).not.toBeUndefined()
    expect(typeof Morfix.ContextData.constructor).toBe('function')
    expect(Morfix.ContextData).toBeInstanceOf(Object)
    expect(Morfix.ContextData.constructor).toBe(Function)
    expect(Morfix.ContextData.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = context.firstContextData
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('parms')
    expect(item).toHaveProperty('parmsId')
    expect(item).toHaveProperty('qualifiers')
    expect(item).toHaveProperty('totalCoeffModulusBitCount')
    expect(item).toHaveProperty('prevContextData')
    expect(item).toHaveProperty('nextContextData')
    expect(item).toHaveProperty('chainIndex')
  })
  test('It should have an instance (bfv)', () => {
    const item = context.firstContextData
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (ckks)', () => {
    const item = ckksContext.firstContextData
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = context.firstContextData
    const newItem = ckksContext.firstContextData
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.totalCoeffModulusBitCount).toEqual(72)
  })
  test("It should delete it's instance", () => {
    const item = context.firstContextData
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.totalCoeffModulusBitCount).toThrow(TypeError)
  })
  test('It should return a the previous context data', () => {
    const item = context.firstContextData
    const prev = item.prevContextData
    expect(prev.instance).not.toBeFalsy()
    expect(prev.totalCoeffModulusBitCount).toEqual(109)
  })
  test('It should return a the next context data', () => {
    const item = context.firstContextData
    const prev = item.nextContextData
    expect(prev.instance).not.toBeFalsy()
    expect(prev.totalCoeffModulusBitCount).toEqual(36)
  })
  test('It should return the chain index', () => {
    const item = context.firstContextData
    expect(item.chainIndex).toEqual(1)
  })
})
