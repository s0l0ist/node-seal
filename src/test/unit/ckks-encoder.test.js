import { Seal, getLibrary } from '../../target/wasm/main'
import { CKKSEncoder } from '../../components'

let Morfix,
  parms,
  context,
  encoder,
  CKKSEncoderObject = null

let batchParms,
  batchContext,
  batchEncoder = null

beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  CKKSEncoderObject = CKKSEncoder(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = CKKSEncoderObject(context)

  batchParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  batchParms.setPolyModulusDegree(4096)
  batchParms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  batchParms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  batchContext = Morfix.Context(batchParms, true, Morfix.SecurityLevel.tc128)
  batchEncoder = Morfix.BatchEncoder(batchContext)
})

describe('CKKSEncoder', () => {
  test('It should be a factory', () => {
    expect(CKKSEncoderObject).toBeDefined()
    expect(typeof CKKSEncoderObject.constructor).toBe('function')
    expect(CKKSEncoderObject).toBeInstanceOf(Object)
    expect(CKKSEncoderObject.constructor).toBe(Function)
    expect(CKKSEncoderObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(CKKSEncoderObject)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(CKKSEncoderObject)
    expect(() => Constructor('fail')).toThrow()
    expect(Constructor).toBeCalledWith('fail')
  })
  test('It should have properties', () => {
    const item = CKKSEncoderObject(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encode')
    expect(item).toHaveProperty('decode')
    expect(item).toHaveProperty('slotCount')
  })
  test('It should have an instance (bfv)', () => {
    const item = CKKSEncoderObject(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = CKKSEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test('It should delete the old instance and inject', () => {
    const item = CKKSEncoderObject(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = CKKSEncoderObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = CKKSEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should encode an float64 array to a plain destination', () => {
    const arr = Float64Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encode')
    encoder.encode(arr, Math.pow(2, 20), plain)
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 20), plain)
  })
  test('It should encode an float64 array and return plaintext', () => {
    const arr = Float64Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(encoder, 'encode')
    const plain = encoder.encode(arr, Math.pow(2, 20))
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 20))
    expect(plain).toBeDefined()
    expect(typeof plain.constructor).toBe('function')
    expect(plain).toBeInstanceOf(Object)
    expect(plain.constructor).toBe(Object)
    expect(plain.instance.constructor.name).toBe('Plaintext')
  })
  test('It should fail to encode an invalid array type', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(encoder, 'encode')
    expect(() => encoder.encode(arr, Math.pow(2, 20))).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 20))
  })
  test('It should decode an float64 array', () => {
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
  test('It should fail to decode an float64 array', () => {
    const arr = Int32Array.from(
      Array.from({ length: batchEncoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    batchEncoder.encode(arr, plain)
    const spyOn = jest.spyOn(encoder, 'decode')
    expect(() => encoder.decode(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
})
