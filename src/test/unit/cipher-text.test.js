import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { CipherText } from '../../components'

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
let CipherTextObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  CipherTextObject = CipherText(lib)(Morfix)

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
    expect(CipherTextObject).toBeDefined()
    expect(typeof CipherTextObject.constructor).toBe('function')
    expect(CipherTextObject).toBeInstanceOf(Object)
    expect(CipherTextObject.constructor).toBe(Function)
    expect(CipherTextObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const cipher = CipherTextObject()
    // Test properties
    expect(cipher).toHaveProperty('instance')
    expect(cipher).toHaveProperty('inject')
    expect(cipher).toHaveProperty('delete')
    expect(cipher).toHaveProperty('reserve')
    expect(cipher).toHaveProperty('resize')
    expect(cipher).toHaveProperty('release')
    expect(cipher).toHaveProperty('coeffModCount')
    expect(cipher).toHaveProperty('polyModulusDegree')
    expect(cipher).toHaveProperty('size')
    expect(cipher).toHaveProperty('sizeCapacity')
    expect(cipher).toHaveProperty('isTransparent')
    expect(cipher).toHaveProperty('isNttForm')
    expect(cipher).toHaveProperty('parmsId')
    expect(cipher).toHaveProperty('scale')
    expect(cipher).toHaveProperty('pool')
    expect(cipher).toHaveProperty('save')
    expect(cipher).toHaveProperty('load')
    expect(cipher).toHaveProperty('copy')
    expect(cipher).toHaveProperty('clone')
    expect(cipher).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const cipher = CipherTextObject()
    expect(cipher.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const cipher = CipherTextObject()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'inject')
    newCipher.inject(cipher.instance)
    expect(spyOn).toHaveBeenCalledWith(cipher.instance)
  })
  test("It should delete it's instance", () => {
    const cipher = CipherTextObject()
    const spyOn = jest.spyOn(cipher, 'delete')
    cipher.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(cipher.instance).toBeNull()
    expect(() => cipher.size).toThrow(TypeError)
  })
  test('It should reserve memory', () => {
    const cipher = CipherTextObject()
    const spyOn = jest.spyOn(cipher, 'reserve')
    cipher.reserve(context, 2)
    expect(spyOn).toHaveBeenCalledWith(context, 2)
    expect(cipher.sizeCapacity).toEqual(2)
  })
  test('It should resize', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'resize')
    cipher.resize(5)
    expect(spyOn).toHaveBeenCalledWith(5)
    expect(cipher.size).toEqual(5)
  })
  test('It should release allocated memory', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'release')
    cipher.release()
    expect(spyOn).toHaveBeenCalledWith()
    expect(cipher.sizeCapacity).toEqual(0)
  })
  test('It should return the coeff mod count', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(cipher.coeffModCount).toEqual(2)
  })
  test('It should return the poly modulus degree (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(cipher.polyModulusDegree).toEqual(parms.polyModulusDegree)
  })
  test('It should return the poly modulus degree (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    expect(cipher.polyModulusDegree).toEqual(ckksParms.polyModulusDegree)
  })

  test('It should return the size', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(cipher.size).toEqual(2)
  })
  test('It should return the size capacity', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(cipher.sizeCapacity).toEqual(2)
  })
  test('It should return false if the cipher is not transparent', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(cipher.isTransparent).toEqual(false)
  })
  test('It should return false if the cipher is not in NTT form (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(cipher.isNttForm).toEqual(false)
  })
  test('It should return true if the cipher is in NTT form (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    expect(cipher.isNttForm).toEqual(true)
  })
  test('It should return a parms id type', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const parms = cipher.parmsId
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
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    expect(cipher.scale).toEqual(Math.pow(2, 20))
  })
  test('It should return the currently used memory pool handle', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    const pool = cipher.pool
    expect(pool.constructor.name).toBe('MemoryPoolHandle')
  })
  test('It should save to a string (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'save')
    const str = cipher.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'save')
    const str = cipher.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should load from a string (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const str = cipher.save()
    cipher.delete()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'load')
    newCipher.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
    expect(newCipher.save()).toBe(str)
  })
  test('It should load from a string (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    const str = cipher.save()
    cipher.delete()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'load')
    newCipher.load(ckksContext, str)
    expect(spyOn).toHaveBeenCalledWith(ckksContext, str)
    expect(newCipher.save()).toBe(str)
  })
  test('It should copy another instance (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'copy')
    newCipher.copy(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(newCipher.save()).toEqual(cipher.save())
  })
  test('It should copy another instance (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'copy')
    newCipher.copy(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(newCipher.save()).toEqual(cipher.save())
  })
  test('It should clone itself (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'clone')
    const newCipher = cipher.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newCipher).toBeDefined()
    expect(typeof newCipher.constructor).toBe('function')
    expect(newCipher).toBeInstanceOf(Object)
    expect(newCipher.constructor).toBe(Object)
    expect(newCipher.instance.constructor.name).toBe('Ciphertext')
    expect(newCipher.save()).toEqual(cipher.save())
  })
  test('It should clone itself (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'clone')
    const newCipher = cipher.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newCipher).toBeDefined()
    expect(typeof newCipher.constructor).toBe('function')
    expect(newCipher).toBeInstanceOf(Object)
    expect(newCipher.constructor).toBe(Object)
    expect(newCipher.instance.constructor.name).toBe('Ciphertext')
    expect(newCipher.save()).toEqual(cipher.save())
  })
  test('It should move another instance into itself and delete the old (bfv)', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const str = cipher.save()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'move')
    newCipher.move(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipher.instance).toBeNull()
    expect(() => cipher.size).toThrow(TypeError)
    expect(newCipher.save()).toEqual(str)
  })
  test('It should move another instance into itself and delete the old (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    const str = cipher.save()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'move')
    newCipher.move(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipher.instance).toBeNull()
    expect(() => cipher.size).toThrow(TypeError)
    expect(newCipher.save()).toEqual(str)
  })
})
