import { Seal, getLibrary } from '../../target/wasm'
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
  Morfix = await Seal()
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
  test('It should construct an instance', () => {
    const Constructor = jest.fn(CipherTextObject)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should construct an instance with a context', () => {
    const Constructor = jest.fn(CipherTextObject)
    Constructor({ context })
    expect(Constructor).toBeCalledWith({ context })
  })
  test('It should construct an instance with a context, parmsId', () => {
    const Constructor = jest.fn(CipherTextObject)
    const parmsId = context.firstParmsId
    Constructor({ context, parmsId })
    expect(Constructor).toBeCalledWith({
      context,
      parmsId
    })
  })
  test('It should construct an instance with a context, parmsId, sizeCapacity', () => {
    const Constructor = jest.fn(CipherTextObject)
    const parmsId = context.firstParmsId
    Constructor({ context, parmsId, sizeCapacity: 2 })
    expect(Constructor).toBeCalledWith({
      context,
      parmsId,
      sizeCapacity: 2
    })
  })
  test('It should fail to construct an instance from invalid parameters', () => {
    const Constructor = jest.fn(CipherTextObject)
    expect(() => Constructor({ context, sizeCapacity: 2 })).toThrow()
    expect(Constructor).toBeCalledWith({
      context,
      sizeCapacity: 2
    })
  })
  test('It should fail to construct an instance from bad parameters', () => {
    const Constructor = jest.fn(CipherTextObject)
    const parmsId = context.firstParmsId
    expect(() => Constructor({ context, parmsId, sizeCapacity: -2 })).toThrow()
    expect(Constructor).toBeCalledWith({
      context,
      parmsId,
      sizeCapacity: -2
    })
  })
  test('It should have properties', () => {
    const cipher = CipherTextObject()
    // Test properties
    expect(cipher).toHaveProperty('instance')
    expect(cipher).toHaveProperty('unsafeInject')
    expect(cipher).toHaveProperty('delete')
    expect(cipher).toHaveProperty('reserve')
    expect(cipher).toHaveProperty('resize')
    expect(cipher).toHaveProperty('release')
    expect(cipher).toHaveProperty('coeffModulusSize')
    expect(cipher).toHaveProperty('polyModulusDegree')
    expect(cipher).toHaveProperty('size')
    expect(cipher).toHaveProperty('sizeCapacity')
    expect(cipher).toHaveProperty('isTransparent')
    expect(cipher).toHaveProperty('isNttForm')
    expect(cipher).toHaveProperty('parmsId')
    expect(cipher).toHaveProperty('scale')
    expect(cipher).toHaveProperty('pool')
    expect(cipher).toHaveProperty('save')
    expect(cipher).toHaveProperty('saveArray')
    expect(cipher).toHaveProperty('load')
    expect(cipher).toHaveProperty('loadArray')
    expect(cipher).toHaveProperty('copy')
    expect(cipher).toHaveProperty('clone')
    expect(cipher).toHaveProperty('move')
  })

  test('It should have an instance', () => {
    const cipher = CipherTextObject()
    expect(cipher.instance).toBeDefined()
  })
  test('It should inject', () => {
    const cipher = CipherTextObject()
    const newCipher = CipherTextObject()
    newCipher.delete()
    const spyOn = jest.spyOn(newCipher, 'unsafeInject')
    newCipher.unsafeInject(cipher.instance)
    expect(spyOn).toHaveBeenCalledWith(cipher.instance)
  })
  test('It should delete the old instance and inject', () => {
    const cipher = CipherTextObject()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'unsafeInject')
    newCipher.unsafeInject(cipher.instance)
    expect(spyOn).toHaveBeenCalledWith(cipher.instance)
  })
  test("It should delete it's instance", () => {
    const cipher = CipherTextObject()
    const spyOn = jest.spyOn(cipher, 'delete')
    cipher.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(cipher.instance).toBeNull()
  })
  test('It should skip deleting twice', () => {
    const cipher = CipherTextObject()
    cipher.delete()
    const spyOn = jest.spyOn(cipher, 'delete')
    cipher.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(cipher.instance).toBeNull()
  })
  test('It should reserve memory', () => {
    const cipher = CipherTextObject()
    const spyOn = jest.spyOn(cipher, 'reserve')
    cipher.reserve(context, 2)
    expect(spyOn).toHaveBeenCalledWith(context, 2)
  })
  test('It should fail to reserve memory', () => {
    const cipher = CipherTextObject()
    const spyOn = jest.spyOn(cipher, 'reserve')
    expect(() => cipher.reserve(context, 50000)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(context, 50000)
  })
  test('It should resize', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'resize')
    cipher.resize(5)
    expect(spyOn).toHaveBeenCalledWith(5)
  })
  test('It should fail to resize', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'resize')
    expect(() => cipher.resize(1)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(1)
  })
  test('It should release allocated memory', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'release')
    cipher.release()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return the coeff mod size', () => {
    const cipher = CipherTextObject()
    cipher.reserve(context, 2)
    expect(typeof cipher.coeffModulusSize).toBe('number')
  })
  test('It should return the poly modulus degree', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(typeof cipher.polyModulusDegree).toBe('number')
  })
  test('It should return the size', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(typeof cipher.size).toBe('number')
  })
  test('It should return the size capacity', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(typeof cipher.sizeCapacity).toBe('number')
  })
  test('It should return if the cipher is transparent', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(typeof cipher.isTransparent).toBe('boolean')
  })
  test('It should return if the cipher is not in NTT form', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    expect(typeof cipher.isNttForm).toBe('boolean')
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
  })
  test('It should return the scale', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    ckksEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.scale).toBe('number')
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
  test('It should save to a string', () => {
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
  test('It should save to an array', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'saveArray')
    const array = cipher.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
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
  test('It should load from a typed array', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const array = cipher.saveArray(Morfix.ComprModeType.deflate)
    cipher.delete()
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'loadArray')
    newCipher.loadArray(context, array)
    expect(spyOn).toHaveBeenCalledWith(context, array)
    expect(newCipher.saveArray()).toEqual(array)
  })
  test('It should fail to load from a string', () => {
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'load')
    expect(() =>
      newCipher.load(
        context,
        'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
    )
  })
  test('It should fail to load from a Uint8Array', () => {
    const newCipher = CipherTextObject()
    const spyOn = jest.spyOn(newCipher, 'loadArray')
    expect(() =>
      newCipher.loadArray(
        context,
        Uint8Array.from([
          94,
          161,
          16,
          3,
          5,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          120,
          156,
          99,
          96,
          160,
          8,
          124,
          176,
          143,
          91,
          40,
          192,
          204,
          10,
          100,
          73,
          160,
          201,
          0,
          0,
          57,
          170,
          2,
          95
        ])
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      Uint8Array.from([
        94,
        161,
        16,
        3,
        5,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        120,
        156,
        99,
        96,
        160,
        8,
        124,
        176,
        143,
        91,
        40,
        192,
        204,
        10,
        100,
        73,
        160,
        201,
        0,
        0,
        57,
        170,
        2,
        95
      ])
    )
  })
  test('It should copy another instance', () => {
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
  test('It should fail to copy another instance', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const newCipher = CipherTextObject()
    cipher.delete()
    const spyOn = jest.spyOn(newCipher, 'copy')
    expect(() => newCipher.copy(cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher)
  })
  test('It should clone itself', () => {
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
  test('It should fail to clone itself', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    cipher.delete()
    const spyOn = jest.spyOn(cipher, 'clone')
    expect(() => cipher.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
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
  test('It should fail to move another instance into itself and delete the old', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const cipher = CipherTextObject()
    const plain = encoder.encode(arr)
    encryptor.encrypt(plain, cipher)
    const newCipher = CipherTextObject()
    cipher.delete()
    const spyOn = jest.spyOn(newCipher, 'move')
    expect(() => newCipher.move(cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher)
  })
})
