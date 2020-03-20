import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null
let encoder = null
let keyGen = null
let publicKey = null
let encryptor = null

let ckksParms = null
let ckksContext = null
let ckksEncoder = null
let ckksKeyGen = null
let ckksPublicKey = null
let ckksEncryptor = null

beforeAll(async () => {
  Morfix = await Seal
  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = Morfix.BatchEncoder(context)
  keyGen = Morfix.KeyGenerator(context)
  publicKey = keyGen.getPublicKey()
  encryptor = Morfix.Encryptor(context, publicKey)

  ckksParms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  ckksParms.setPolyModulusDegree(4096)
  ckksParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = Morfix.Context(ckksParms, true, Morfix.SecurityLevel.tc128)
  ckksEncoder = Morfix.CKKSEncoder(ckksContext)
  ckksKeyGen = Morfix.KeyGenerator(ckksContext)
  ckksPublicKey = ckksKeyGen.getPublicKey()
  ckksEncryptor = Morfix.Encryptor(ckksContext, ckksPublicKey)
})

describe('CipherText', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('CipherText')
    expect(Morfix.CipherText).toBeDefined()
    expect(typeof Morfix.CipherText.constructor).toBe('function')
    expect(Morfix.CipherText).toBeInstanceOf(Object)
    expect(Morfix.CipherText.constructor).toBe(Function)
    expect(Morfix.CipherText.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.CipherText()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('inject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('reserve')
    expect(item).toHaveProperty('resize')
    expect(item).toHaveProperty('release')
    expect(item).toHaveProperty('coeffModCount')
    expect(item).toHaveProperty('polyModulusDegree')
    expect(item).toHaveProperty('size')
    expect(item).toHaveProperty('sizeCapacity')
    expect(item).toHaveProperty('isTransparent')
    expect(item).toHaveProperty('isNttForm')
    expect(item).toHaveProperty('parmsId')
    expect(item).toHaveProperty('scale')
    expect(item).toHaveProperty('pool')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('load')
    expect(item).toHaveProperty('copy')
    expect(item).toHaveProperty('clone')
    expect(item).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const item = Morfix.CipherText()
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.CipherText()
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.size).toThrow(TypeError)
  })
  test('It should reserve memory', () => {
    const item = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'reserve')
    item.reserve(context, 2)
    expect(spyOn).toHaveBeenCalledWith(context, 2)
    expect(item.sizeCapacity).toEqual(2)
  })
  test('It should resize', () => {
    const item = Morfix.CipherText()
    item.reserve(context, 2)
    expect(item.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(item, 'resize')
    item.resize(5)
    expect(spyOn).toHaveBeenCalledWith(5)
    expect(item.size).toEqual(5)
  })
  test('It should release allocated memory', () => {
    const item = Morfix.CipherText()
    item.reserve(context, 2)
    expect(item.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(item, 'release')
    item.release()
    expect(spyOn).toHaveBeenCalledWith()
    expect(item.sizeCapacity).toEqual(0)
  })
  test('It should return the coeff mod count', () => {
    const item = Morfix.CipherText()
    item.reserve(context, 2)
    expect(item.coeffModCount).toEqual(2)
  })
  test('It should return the poly modulus degree (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    expect(item.polyModulusDegree).toEqual(parms.polyModulusDegree)
  })
  test('It should return the poly modulus degree (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    expect(item.polyModulusDegree).toEqual(ckksParms.polyModulusDegree)
  })

  test('It should return the size', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    expect(item.size).toEqual(2)
  })
  test('It should return the size capacity', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    expect(item.sizeCapacity).toEqual(2)
  })
  test('It should return false if the cipher is not transparent', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    expect(item.isTransparent).toEqual(false)
  })
  test('It should return false if the cipher is not in NTT form (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    expect(item.isNttForm).toEqual(false)
  })
  test('It should return true if the cipher is in NTT form (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    expect(item.isNttForm).toEqual(true)
  })
  test('It should return a parms id type', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    const parms = item.parmsId
    const values = parms.values
    expect(Array.isArray(values)).toBe(true)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(parms.values).toEqual([
      1873000747715295028n,
      11215186030905010692n,
      3414445251667737935n,
      182315704735341130n
    ])
  })
  test('It should return the scale (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    expect(item.scale).toEqual(Math.pow(2, 20))
  })
  test('It should return the currently used memory pool handle', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    const pool = item.pool
    expect(pool.constructor.name).toBe('MemoryPoolHandle')
  })
  test('It should save to a string (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should load from a string (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    const str = item.save()
    item.delete()
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
    expect(newItem.save()).toBe(str)
  })
  test('It should load from a string (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    const str = item.save()
    item.delete()
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(ckksContext, str)
    expect(spyOn).toHaveBeenCalledWith(ckksContext, str)
    expect(newItem.save()).toBe(str)
  })
  test('It should copy another instance (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(newItem.save()).toEqual(item.save())
  })
  test('It should copy another instance (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(newItem.save()).toEqual(item.save())
  })
  test('It should clone itself (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    const spyOn = jest.spyOn(item, 'clone')
    const newItem = item.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newItem).toBeDefined()
    expect(typeof newItem.constructor).toBe('function')
    expect(newItem).toBeInstanceOf(Object)
    expect(newItem.constructor).toBe(Object)
    expect(newItem.instance.constructor.name).toBe('Ciphertext')
    expect(newItem.save()).toEqual(item.save())
  })
  test('It should clone itself (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    const spyOn = jest.spyOn(item, 'clone')
    const newItem = item.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newItem).toBeDefined()
    expect(typeof newItem.constructor).toBe('function')
    expect(newItem).toBeInstanceOf(Object)
    expect(newItem.constructor).toBe(Object)
    expect(newItem.instance.constructor.name).toBe('Ciphertext')
    expect(newItem.save()).toEqual(item.save())
  })
  test('It should move another instance into itself and delete the old (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, item)
    const str = item.save()
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeNull()
    expect(() => item.size).toThrow(TypeError)
    expect(newItem.save()).toEqual(str)
  })
  test('It should move another instance into itself and delete the old (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const item = Morfix.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, item)
    const str = item.save()
    const newItem = Morfix.CipherText()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeNull()
    expect(() => item.size).toThrow(TypeError)
    expect(newItem.save()).toEqual(str)
  })
})
