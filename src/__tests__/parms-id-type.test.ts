import { Context } from '../implementation/context'
import { EncryptionParameters } from '../implementation/encryption-parameters'
import { SEALLibrary } from '../implementation/seal'
import SEAL from '../throws_wasm_node_umd'
let seal: SEALLibrary
let parms: EncryptionParameters
let context: Context
beforeAll(async () => {
  seal = await SEAL()
  parms = seal.EncryptionParameters(seal.SchemeType.bfv)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
  )
  parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  context = seal.Context(parms, true, seal.SecurityLevel.tc128)
})

describe('ParmsIdType', () => {
  test('It should be a factory', () => {
    expect(seal.ParmsIdType).toBeDefined()
    expect(typeof seal.ParmsIdType.constructor).toBe('function')
    expect(seal.ParmsIdType).toBeInstanceOf(Object)
    expect(seal.ParmsIdType.constructor).toBe(Function)
    expect(seal.ParmsIdType.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.ParmsIdType)
    Constructor()
    expect(Constructor).toHaveBeenCalledWith()
  })
  test('It should construct from an existing an instance', () => {
    const Constructor = jest.fn(seal.ParmsIdType)
    Constructor()
    expect(Constructor).toHaveBeenCalledWith()
  })
  test('It should have properties', () => {
    const parmsId = context.firstParmsId
    // Test properties
    expect(parmsId).toHaveProperty('instance')
    expect(parmsId).toHaveProperty('inject')
    expect(parmsId).toHaveProperty('delete')
    expect(parmsId).toHaveProperty('values')
  })
  test('It should not have an instance', () => {
    const parmsId = seal.ParmsIdType()
    expect(parmsId.instance).toBeUndefined()
  })
  test('It should inject', () => {
    const parmsId = context.firstParmsId
    const newParmsId = seal.ParmsIdType()
    newParmsId.delete()
    const spyOn = jest.spyOn(newParmsId, 'inject')
    newParmsId.inject(parmsId.instance)
    expect(spyOn).toHaveBeenCalledWith(parmsId.instance)
  })
  test('It should delete the old instance and inject', () => {
    const parmsId = context.firstParmsId
    const parmsId2 = context.firstParmsId
    const newParmsId = seal.ParmsIdType()
    newParmsId.inject(parmsId2.instance)
    const spyOn = jest.spyOn(newParmsId, 'inject')
    newParmsId.inject(parmsId.instance)
    expect(spyOn).toHaveBeenCalledWith(parmsId.instance)
  })
  test("It should delete it's instance", () => {
    const parmsId = context.firstParmsId
    const spyOn = jest.spyOn(parmsId, 'delete')
    parmsId.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(parmsId.instance).toBeUndefined()
    expect(() => parmsId.values).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const parmsId = context.firstParmsId
    parmsId.delete()
    const spyOn = jest.spyOn(parmsId, 'delete')
    parmsId.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(parmsId.instance).toBeUndefined()
  })
  test('It should return values', () => {
    const parmsId = context.firstParmsId
    const values = parmsId.values
    expect(values.constructor).toBe(BigUint64Array)
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('1873000747715295028'),
        BigInt('11215186030905010692'),
        BigInt('3414445251667737935'),
        BigInt('182315704735341130')
      ])
    )
  })
})
