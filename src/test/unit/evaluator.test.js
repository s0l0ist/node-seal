import { Seal, getLibrary } from '../../target/wasm'
import { Evaluator } from '../../components'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let encoder = null
let publicKey = null
let secretKey = null
let relinKeys = null
let galoisKeys = null
let encryptor = null
let decryptor = null

let ckksParms = null
let ckksContext = null
let ckksKeyGenerator = null
let ckksEncoder = null
let ckksPublicKey = null
let ckksSecretKey = null
let ckksRelinKeys = null
let ckksGaloisKeys = null
let ckksEncryptor = null
let ckksDecryptor = null

let invalidCkksPlain = null
let invalidCkksCipher = null

let EvaluatorObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  EvaluatorObject = Evaluator(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGenerator = Morfix.KeyGenerator(context)
  encoder = Morfix.BatchEncoder(context)
  publicKey = keyGenerator.getPublicKey()
  secretKey = keyGenerator.getSecretKey()
  relinKeys = keyGenerator.genRelinKeysLocal()
  galoisKeys = keyGenerator.genGaloisKeysLocal(
    Int32Array.from([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
  )
  encryptor = Morfix.Encryptor(context, publicKey)
  decryptor = Morfix.Decryptor(context, secretKey)

  ckksParms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  ckksParms.setPolyModulusDegree(4096)
  ckksParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = Morfix.Context(ckksParms, true, Morfix.SecurityLevel.tc128)
  ckksKeyGenerator = Morfix.KeyGenerator(ckksContext)
  ckksEncoder = Morfix.CKKSEncoder(ckksContext)
  ckksPublicKey = ckksKeyGenerator.getPublicKey()
  ckksSecretKey = ckksKeyGenerator.getSecretKey()
  ckksRelinKeys = ckksKeyGenerator.genRelinKeysLocal()
  ckksGaloisKeys = ckksKeyGenerator.genGaloisKeysLocal()
  ckksEncryptor = Morfix.Encryptor(ckksContext, ckksPublicKey)
  ckksDecryptor = Morfix.Decryptor(ckksContext, ckksSecretKey)

  const arr2 = Float64Array.from({ length: ckksEncoder.slotCount / 2 }).map(
    (x, i) => 5
  )
  invalidCkksPlain = ckksEncoder.encode(arr2, Math.pow(2, 20))
  invalidCkksCipher = ckksEncryptor.encrypt(invalidCkksPlain)
})

describe('Evaluator', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('Evaluator')
    expect(EvaluatorObject).toBeDefined()
    expect(typeof EvaluatorObject.constructor).toBe('function')
    expect(EvaluatorObject).toBeInstanceOf(Object)
    expect(EvaluatorObject.constructor).toBe(Function)
    expect(EvaluatorObject.constructor.name).toBe('Function')
  })

  test('It should construct an instance', () => {
    const Constructor = jest.fn(EvaluatorObject)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const newParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    newParms.setPolyModulusDegree(4096)
    newParms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    const newContext = Morfix.Context(
      newParms,
      true,
      Morfix.SecurityLevel.tc128
    )
    const Constructor = jest.fn(EvaluatorObject)
    expect(() => Constructor(newContext)).toThrow()
    expect(Constructor).toBeCalledWith(newContext)
  })
  test('It should have properties', () => {
    const item = EvaluatorObject(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('negate')
    expect(item).toHaveProperty('add')
    expect(item).toHaveProperty('sub')
    expect(item).toHaveProperty('multiply')
    expect(item).toHaveProperty('square')
    expect(item).toHaveProperty('relinearize')
    expect(item).toHaveProperty('cipherModSwitchToNext')
    expect(item).toHaveProperty('cipherModSwitchTo')
    expect(item).toHaveProperty('plainModSwitchToNext')
    expect(item).toHaveProperty('plainModSwitchTo')
    expect(item).toHaveProperty('rescaleToNext')
    expect(item).toHaveProperty('rescaleTo')
    expect(item).toHaveProperty('exponentiate')
    expect(item).toHaveProperty('addPlain')
    expect(item).toHaveProperty('subPlain')
    expect(item).toHaveProperty('multiplyPlain')
    expect(item).toHaveProperty('plainTransformToNtt')
    expect(item).toHaveProperty('cipherTransformToNtt')
    expect(item).toHaveProperty('cipherTransformFromNtt')
    expect(item).toHaveProperty('applyGalois')
    expect(item).toHaveProperty('rotateRows')
    expect(item).toHaveProperty('rotateColumns')
    expect(item).toHaveProperty('rotateVector')
    expect(item).toHaveProperty('complexConjugate')
    expect(item).toHaveProperty('sumElements')
    expect(item).toHaveProperty('dotProduct')
    expect(item).toHaveProperty('dotProductPlain')
  })
  test('It should have an instance', () => {
    const item = EvaluatorObject(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = EvaluatorObject(context)
    const newItem = EvaluatorObject(context)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = EvaluatorObject(context)
    const newItem = EvaluatorObject(context)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = EvaluatorObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.add()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = EvaluatorObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.add()).toThrow(TypeError)
  })
  // Negate
  test('It should fail to negate a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    expect(() => item.negate(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should negate a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should negate a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should negate a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
  })
  test('It should negate a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should negate a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  test('It should negate a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  // Add
  test('It should fail to add ciphers', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    expect(() => item.add(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should add a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  test('It should add a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  // Sub
  test('It should fail to sub ciphers', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    expect(() => item.sub(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should sub a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const arr2 = Int32Array.from({ length: encoder.slotCount }).map(
      (x, i) => -2 * i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = encryptor.encrypt(plain2)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const arr2 = Int32Array.from({ length: encoder.slotCount }).map(
      (x, i) => -2 * i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = encryptor.encrypt(plain2)
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const arr2 = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = encryptor.encrypt(plain2)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const arr2 = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = encryptor.encrypt(plain2)
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const arr2 = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipher2 = ckksEncryptor.encrypt(plain2)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  test('It should sub a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const arr2 = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipher2 = ckksEncryptor.encrypt(plain2)
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  // Multiply
  test('It should fail to multiply ciphers', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    expect(() =>
      item.multiply(invalidCkksCipher, cipherDest, invalidCkksCipher)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      cipherDest,
      invalidCkksCipher
    )
  })
  test('It should multiply a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)

    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // Square
  test('It should fail to square ciphers', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    expect(() => item.square(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should square a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should square a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // Relinearize
  test('It should fail to relinearize a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'relinearize')
    expect(() =>
      item.relinearize(invalidCkksCipher, relinKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, relinKeys, cipherDest)
  })
  test('It should relinearize a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'relinearize')
    item.square(cipher, cipherDest)
    item.relinearize(cipherDest, relinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, relinKeys, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherResult = item.square(cipher)
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(cipherResult, relinKeys)
    expect(spyOn).toHaveBeenCalledWith(cipherResult, relinKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    item.square(cipher, cipherDest)
    const spyOn = jest.spyOn(item, 'relinearize')
    item.relinearize(cipherDest, relinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, relinKeys, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherResult = item.square(cipher)
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(cipherResult, relinKeys)
    expect(spyOn).toHaveBeenCalledWith(cipherResult, relinKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    item.square(cipher, cipherDest)
    const spyOn = jest.spyOn(item, 'relinearize')
    item.relinearize(cipherDest, ckksRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, ckksRelinKeys, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should relinearize a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherResult = item.square(cipher)
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(cipherResult, ckksRelinKeys)
    expect(spyOn).toHaveBeenCalledWith(cipherResult, ckksRelinKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // CipherModSwitchToNext
  test('It should fail to cipherModSwitchToNext a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    expect(() =>
      item.cipherModSwitchToNext(invalidCkksCipher, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // cipherModSwitchTo
  test('It should fail to cipherModSwitchTo a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const parmsId = context.lastParmsId

    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    expect(() =>
      item.cipherModSwitchTo(invalidCkksCipher, parmsId, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, parmsId, cipherDest)
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const parmsId = context.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const parmsId = context.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const parmsId = context.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const parmsId = context.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // plainModSwitchToNext
  test('It should fail to plainModSwitchToNext a plain', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const plainDest = Morfix.PlainText()
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    expect(() =>
      item.plainModSwitchToNext(invalidCkksPlain, plainDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksPlain, plainDest)
  })
  test('It should plainModSwitchToNext a plain to a destination plain (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const plainDest = Morfix.PlainText()
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
  })
  test('It should plainModSwitchToNext a plain and return a plain result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
  })
  test('It should plainModSwitchToNext a plain to a destination plain (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const plainDest = Morfix.PlainText()
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
  })
  test('It should plainModSwitchToNext a plain and return a plain result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
  })
  test('It should plainModSwitchToNext a plain to a destination plain (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const plainDest = Morfix.PlainText()
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should plainModSwitchToNext a plain and return a plain result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // plainModSwitchTo
  test('It should fail to plainModSwitchTo a plain', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const plainDest = Morfix.PlainText()
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    expect(() =>
      item.plainModSwitchTo(invalidCkksPlain, parmsId, plainDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksPlain, parmsId, plainDest)
  })
  test('It should plainModSwitchTo a plain to a destination plain (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainModSwitchTo a plain and return a plain result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
  })
  test('It should plainModSwitchTo a plain to a destination plain (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const plainDest = Morfix.PlainText()
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plainDest)
  })
  test('It should plainModSwitchTo a plain and return a plain result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
  })
  test('It should plainModSwitchTo a plain to a destination plain (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const plainDest = Morfix.PlainText()
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plainDest)
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should plainModSwitchTo a plain and return a plain result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // rescaleToNext
  test('It should fail to rescaleToNext a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    expect(() => item.rescaleToNext(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should fail to rescaleToNext for bfv scheme', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    expect(() => item.rescaleToNext(cipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
  })

  test('It should rescaleToNext a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    item.rescaleToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const decrypted = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescaleToNext a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    const cipherDest = item.rescaleToNext(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // rescaleTo
  test('It should fail to rescaleTo for bfv scheme', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const parmsId = context.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    expect(() => item.rescaleTo(cipher, parmsId, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
  })

  test('It should rescaleTo a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const parmsId = ckksContext.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    item.rescaleTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const decrypted = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescaleTo a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35))
    const cipher = ckksEncryptor.encrypt(plain)
    const parmsId = ckksContext.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    const cipherDest = item.rescaleTo(cipher, parmsId)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // Exponentiate
  test('It should fail to exponentiate a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    expect(() =>
      item.exponentiate(invalidCkksCipher, 2, relinKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      2,
      relinKeys,
      cipherDest
    )
  })
  test('It should exponentiate a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    item.exponentiate(cipher, 2, relinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, relinKeys, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'exponentiate')
    const cipherDest = item.exponentiate(cipher, 2, relinKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, relinKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    item.exponentiate(cipher, 2, relinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, relinKeys, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'exponentiate')
    const cipherDest = item.exponentiate(cipher, 2, relinKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, relinKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should fail to exponentiate for ckks scheme', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    expect(() =>
      item.exponentiate(cipher, 2, ckksRelinKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, ckksRelinKeys, cipherDest)
  })
  // Add plain
  test('It should fail to add a plain to a cipher', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    expect(() => item.addPlain(cipher, invalidCkksPlain, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, invalidCkksPlain, cipherDest)
  })
  test('It should add a plain to a cipher and store in a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  test('It should add a plain to a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  // Sub plain
  test('It should fail to sub a plain from a cipher', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    expect(() => item.subPlain(cipher, invalidCkksPlain, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, invalidCkksPlain, cipherDest)
  })
  test('It should sub a plain from a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const arr2 = Int32Array.from({ length: encoder.slotCount }).map(
      (x, i) => -2 * i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a plain from a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const arr2 = Int32Array.from({ length: encoder.slotCount }).map(
      (x, i) => -2 * i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a plain from a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const arr2 = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a plain from a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const arr2 = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => i
    )
    const plain = encoder.encode(arr)
    const plain2 = encoder.encode(arr2)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a plain from a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const arr2 = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  test('It should sub a plain from a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const arr2 = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  // Multiply plain
  test('It should fail to multiply a cipher by a plain', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    expect(() =>
      item.multiplyPlain(cipher, invalidCkksPlain, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, invalidCkksPlain, cipherDest)
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher by a plain and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const result = ckksDecryptor.decrypt(cipherDest)
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // plainTransformToNtt
  test('It should fail to plainTransformToNtt a plain', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const plainDest = Morfix.PlainText()
    const parmsId = context.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    expect(() =>
      item.plainTransformToNtt(invalidCkksPlain, parmsId, plainDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksPlain, parmsId, plainDest)
  })
  test('It should plainTransformToNtt a plain to a destination plain (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    item.plainTransformToNtt(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainTransformToNtt a plain and return a plain result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    const plainDest = item.plainTransformToNtt(plain, parmsId)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
  })
  test('It should plainTransformToNtt a plain to a destination plain (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    item.plainTransformToNtt(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainTransformToNtt a plain and return a plain result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const parmsId = context.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    const plainDest = item.plainTransformToNtt(plain, parmsId)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Plaintext')
  })
  test('It should fail to plainTransformToNtt on ckks scheme', () => {
    const item = EvaluatorObject(context)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    expect(() => item.plainTransformToNtt(plain, plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain, plain)
  })
  // cipherTransformToNtt
  test('It should fail to cipherTransformToNtt a plain', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    expect(() => item.cipherTransformToNtt(invalidCkksCipher, cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipher)
  })
  test('It should cipherTransformToNtt a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    item.cipherTransformToNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformToNtt a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    const plainDest = item.cipherTransformToNtt(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should cipherTransformToNtt a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    item.cipherTransformToNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformToNtt a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    const plainDest = item.cipherTransformToNtt(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(plainDest).toBeDefined()
    expect(typeof plainDest.constructor).toBe('function')
    expect(plainDest).toBeInstanceOf(Object)
    expect(plainDest.constructor).toBe(Object)
    expect(plainDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should fail to cipherTransformToNtt on ckks scheme', () => {
    const item = EvaluatorObject(context)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    expect(() => item.cipherTransformToNtt(cipher, cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  // cipherTransformFromNtt
  test('It should cipherTransformFromNtt a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    item.cipherTransformFromNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformFromNtt a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => -5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    const cipherDest = item.cipherTransformFromNtt(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should cipherTransformFromNtt a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    item.cipherTransformFromNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformFromNtt a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    const cipherDest = item.cipherTransformFromNtt(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should fail to cipherTransformFromNtt on ckks scheme', () => {
    const item = EvaluatorObject(context)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 10
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    expect(() => item.cipherTransformFromNtt(cipher, cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })

  // applyGalois
  test('It should fail to applyGalois on a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    expect(() =>
      item.applyGalois(invalidCkksCipher, galElt, galoisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      galElt,
      galoisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, galoisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, galoisKeys, cipherDest)
  })
  test('It should applyGalois on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(cipher, galElt, galoisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, galoisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should applyGalois on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, galoisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, galoisKeys, cipherDest)
  })
  test('It should applyGalois on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(cipher, galElt, galoisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, galoisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should applyGalois on a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, ckksGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galElt,
      ckksGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const galElt = 2 * parms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(cipher, galElt, ckksGaloisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, ckksGaloisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  // rotateRows
  test('It should rotateRows on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    item.rotateRows(cipher, 5, galoisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, galoisKeys, cipherDest)
  })
  test('It should rotateRows on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'rotateRows')
    const cipherDest = item.rotateRows(cipher, 5, galoisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, galoisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should rotateRows on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    item.rotateRows(cipher, 5, galoisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, galoisKeys, cipherDest)
  })
  test('It should rotateRows on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'rotateRows')
    const cipherDest = item.rotateRows(cipher, 5, galoisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, galoisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should fail to rotateRows when using ckks', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    expect(() =>
      item.rotateRows(cipher, 5, ckksGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, ckksGaloisKeys, cipherDest)
  })
  // rotateColumns
  test('It should rotateColumns on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    item.rotateColumns(cipher, galoisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys, cipherDest)
  })
  test('It should rotateColumns on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'rotateColumns')
    const cipherDest = item.rotateColumns(cipher, galoisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should rotateColumns on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    item.rotateColumns(cipher, galoisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys, cipherDest)
  })
  test('It should rotateColumns on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'rotateColumns')
    const cipherDest = item.rotateColumns(cipher, galoisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  test('It should fail to rotateColumns when using ckks', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    expect(() =>
      item.rotateColumns(cipher, ckksGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys, cipherDest)
  })
  // rotateVector
  test('It should fail to rotateVector when using bfv', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateVector')
    expect(() => item.rotateVector(cipher, 5, galoisKeys, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, galoisKeys, cipherDest)
  })
  test('It should rotateVector on a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'rotateVector')
    item.rotateVector(cipher, 5, ckksGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, ckksGaloisKeys, cipherDest)
  })
  test('It should rotateVector on a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'rotateVector')
    const cipherDest = item.rotateVector(cipher, 5, ckksGaloisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, ckksGaloisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  // complexConjugate
  test('It should fail to complexConjugate when using bfv', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => i)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'complexConjugate')
    expect(() =>
      item.complexConjugate(cipher, galoisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys, cipherDest)
  })
  test('It should complexConjugate on a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'complexConjugate')
    item.complexConjugate(cipher, ckksGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys, cipherDest)
  })
  test('It should complexConjugate on a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'complexConjugate')
    const cipherDest = item.complexConjugate(cipher, ckksGaloisKeys)
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  // sumElements
  test('It should fail to sumElements on a cipher', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    expect(() =>
      item.sumElements(invalidCkksCipher, galoisKeys, parms.scheme, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
  })
  test('It should sumElements on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, galoisKeys, parms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(cipher, galoisKeys, parms.scheme)
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys, parms.scheme)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, galoisKeys, parms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted, false)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(cipher, galoisKeys, parms.scheme)
    expect(spyOn).toHaveBeenCalledWith(cipher, galoisKeys, parms.scheme)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted, false)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 27))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, ckksGaloisKeys, ckksParms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      ckksGaloisKeys,
      ckksParms.scheme,
      cipherDest
    )
  })
  test('It should sumElements on a cipher and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 27))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(
      cipher,
      ckksGaloisKeys,
      ckksParms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys, ckksParms.scheme)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  // dotProduct
  test('It should fail to dotProduct two ciphers', () => {
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    expect(() =>
      item.dotProduct(
        invalidCkksCipher,
        invalidCkksCipher,
        relinKeys,
        galoisKeys,
        parms.scheme,
        cipherDest
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      invalidCkksCipher,
      relinKeys,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = cipher.clone()
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme
    )
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = cipher.clone()
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      parms.scheme
    )
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipher2 = cipher.clone()
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksParms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksParms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksParms.scheme
    )
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
  // dotProductPlain
  test('It should fail to dotProductPlain two ciphers', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const item = EvaluatorObject(context)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    expect(() =>
      item.dotProductPlain(
        invalidCkksCipher,
        plain,
        galoisKeys,
        parms.scheme,
        cipherDest
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      plain,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(cipher, plain, galoisKeys, parms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (bfv) (int32)', () => {
    const item = EvaluatorObject(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      galoisKeys,
      parms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, galoisKeys, parms.scheme)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(cipher, plain, galoisKeys, parms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      galoisKeys,
      parms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (bfv) (uint32)', () => {
    const item = EvaluatorObject(context)
    const arr = Uint32Array.from({ length: encoder.slotCount }).map((x, i) => 5)
    const plain = encoder.encode(arr)
    const cipher = encryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      galoisKeys,
      parms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, galoisKeys, parms.scheme)
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
    const decrypted = decryptor.decrypt(cipherDest)
    const decoded = encoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const cipherDest = Morfix.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksParms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (ckks)', () => {
    const item = EvaluatorObject(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 5
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20))
    const cipher = ckksEncryptor.encrypt(plain)
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksParms.scheme
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksParms.scheme
    )
    expect(cipherDest).toBeDefined()
    expect(typeof cipherDest.constructor).toBe('function')
    expect(cipherDest).toBeInstanceOf(Object)
    expect(cipherDest.constructor).toBe(Object)
    expect(cipherDest.instance.constructor.name).toBe('Ciphertext')
  })
})
