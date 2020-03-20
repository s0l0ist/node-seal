import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null
let encoder = null

beforeAll(async () => {
  Morfix = await Seal
  parms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = Morfix.CKKSEncoder(context)
})

describe('CKKSEncoder', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('CKKSEncoder')
    expect(Morfix.CKKSEncoder).not.toBeUndefined()
    expect(typeof Morfix.CKKSEncoder.constructor).toBe('function')
    expect(Morfix.CKKSEncoder).toBeInstanceOf(Object)
    expect(Morfix.CKKSEncoder.constructor).toBe(Function)
    expect(Morfix.CKKSEncoder.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.CKKSEncoder(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encode')
    expect(item).toHaveProperty('decode')
    expect(item).toHaveProperty('slotCount')
  })
  test('It should have an instance (bfv)', () => {
    const item = Morfix.CKKSEncoder(context)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.CKKSEncoder(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.CKKSEncoder(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should encode an float64 array (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encode')
    encoder.encode(arr, Math.pow(2, 16), plain)
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 16), plain)
    const decoded = encoder.decode(plain)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should decode an float64 array (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    encoder.encode(arr, Math.pow(2, 20), plain)
    const spyOn = jest.spyOn(encoder, 'decode')
    const decoded = encoder.decode(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
})
