import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { BatchEncoder } from '../../components'

let Morfix = null
let parms = null
let context = null
let encoder = null
let BatchEncoderObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  BatchEncoderObject = BatchEncoder(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = BatchEncoderObject(context)
})

describe('BatchEncoder', () => {
  test('It should be a factory', () => {
    expect(BatchEncoderObject).toBeDefined()
    expect(typeof BatchEncoderObject.constructor).toBe('function')
    expect(BatchEncoderObject).toBeInstanceOf(Object)
    expect(BatchEncoderObject.constructor).toBe(Function)
    expect(BatchEncoderObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = BatchEncoderObject(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encode')
    expect(item).toHaveProperty('decode')
    expect(item).toHaveProperty('slotCount')
  })
  test('It should have an instance (bfv)', () => {
    const item = BatchEncoderObject(context)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should encode an int32 array (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encode')
    encoder.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
    const decoded = encoder.decode(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should encode an uint32 array (bfv)', () => {
    const arr = Uint32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encode')
    encoder.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
    const decoded = encoder.decode(plain, false)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an int32 array (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    )
    const plain = Morfix.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(encoder, 'decode')
    const decoded = encoder.decode(plain, true)
    expect(spyOn).toHaveBeenCalledWith(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an uint32 array (bfv)', () => {
    const arr = Uint32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(encoder, 'decode')
    const decoded = encoder.decode(plain, false)
    expect(spyOn).toHaveBeenCalledWith(plain, false)
    expect(decoded).toEqual(arr)
  })
})
