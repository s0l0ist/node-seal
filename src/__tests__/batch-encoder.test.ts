import SEAL from '../index_js_node'
import { SEALLibrary } from '../implementation/seal'

let Morfix: SEALLibrary
beforeAll(async () => {
  Morfix = await SEAL()
})

let Morfix,
  parms,
  context,
  BatchEncoderObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  BatchEncoderObject = BatchEncoder(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
})

describe('BatchEncoder', () => {
  test('It should be a factory', () => {
    expect(BatchEncoderObject).toBeDefined()
    expect(typeof BatchEncoderObject.constructor).toBe('function')
    expect(BatchEncoderObject).toBeInstanceOf(Object)
    expect(BatchEncoderObject.constructor).toBe(Function)
    expect(BatchEncoderObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(BatchEncoderObject)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(BatchEncoderObject)
    expect(() => Constructor('fail')).toThrow()
    expect(Constructor).toBeCalledWith('fail')
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
  test('It should have an instance', () => {
    const item = BatchEncoderObject(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = BatchEncoderObject(context)
    const newItem = BatchEncoderObject(context)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(newItem.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = BatchEncoderObject(context)
    const newItem = BatchEncoderObject(context)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(newItem.instance)
  })
  test("It should delete it's instance", () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should skip deleting twice', () => {
    const item = BatchEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should encode an int32 array to a plaintext destination', () => {
    const item = BatchEncoderObject(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => -i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an int32 array and return a plaintext', () => {
    const item = BatchEncoderObject(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => -i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should encode an int64 array to a plaintext destination', () => {
    const item = BatchEncoderObject(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => BigInt(-i))
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an int64 array and return a plaintext', () => {
    const item = BatchEncoderObject(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => BigInt(-i))
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should encode an uint32 array to a plaintext destination', () => {
    const item = BatchEncoderObject(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an uint32 array and return a plaintext', () => {
    const item = BatchEncoderObject(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
    expect(typeof plain.constructor).toBe('function')
    expect(plain).toBeInstanceOf(Object)
    expect(plain.constructor).toBe(Object)
    expect(plain.instance.constructor.name).toBe('Plaintext')
  })
  test('It should encode an uint64 array to a plaintext destination', () => {
    const item = BatchEncoderObject(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => BigInt(i))
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an uint64 array and return a plaintext', () => {
    const item = BatchEncoderObject(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => BigInt(i))
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should fail on unsupported array type', () => {
    const item = BatchEncoderObject(context)
    const arr = Float64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    expect(() => item.encode(arr)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr)
  })
  test('It should fail on encoding bad data', () => {
    const item = BatchEncoderObject(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount * 2 }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    expect(() => item.encode(arr)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr)
  })
  test('It should decode an int32 array', () => {
    const item = BatchEncoderObject(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => -i)
    )
    const plain = Morfix.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decode')
    const decoded = item.decode(plain, true)
    expect(spyOn).toHaveBeenCalledWith(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an int64 array', () => {
    const item = BatchEncoderObject(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => BigInt(-i))
    )
    const plain = Morfix.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    const decoded = item.decodeBigInt(plain, true)
    expect(spyOn).toHaveBeenCalledWith(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an uint32 array', () => {
    const item = BatchEncoderObject(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decode')
    const decoded = item.decode(plain, false)
    expect(spyOn).toHaveBeenCalledWith(plain, false)
    expect(decoded).toEqual(arr)
  })
  test('It should decode a uint64 array', () => {
    const item = BatchEncoderObject(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount }).map((x, i) => BigInt(i))
    )
    const plain = Morfix.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    const decoded = item.decodeBigInt(plain, false)
    expect(spyOn).toHaveBeenCalledWith(plain, false)
    expect(decoded).toEqual(arr)
  })
  test('It should fail to decode unsigned', () => {
    const item = BatchEncoderObject(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount * 2 }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'decode')
    expect(() => item.decode(arr, false)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, false)
  })
  test('It should fail to decode signed', () => {
    const item = BatchEncoderObject(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount * 2 }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'decode')
    expect(() => item.decode(arr, true)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, true)
  })
  test('It should fail to decodeBigInt unsigned', () => {
    const item = BatchEncoderObject(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount * 2 }).map((x, i) => BigInt(i))
    )
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    expect(() => item.decodeBigInt(arr, false)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, false)
  })
  test('It should fail to decodeBigInt signed', () => {
    const item = BatchEncoderObject(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount * 2 }).map((x, i) => BigInt(i))
    )
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    expect(() => item.decodeBigInt(arr, true)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, true)
  })
  test('It fail to decode with no args', () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'decode')
    expect(() => item.decode()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It fail to decodeBigInt with no args', () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    expect(() => item.decodeBigInt()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
})
