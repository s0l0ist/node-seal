import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { PlainText } from '../../components'

let Morfix,
  parms,
  context,
  encoder,
  evaluator,
  ckksParms,
  ckksContext,
  ckksEncoder,
  PlainTextObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  PlainTextObject = PlainText(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = Morfix.BatchEncoder(context)
  evaluator = Morfix.Evaluator(context)

  ckksParms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  ckksParms.setPolyModulusDegree(4096)
  ckksParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = Morfix.Context(ckksParms, true, Morfix.SecurityLevel.tc128)
  ckksEncoder = Morfix.CKKSEncoder(ckksContext)
})

describe('PlainText', () => {
  test('It should be a factory', () => {
    expect(PlainTextObject).toBeDefined()
    expect(typeof PlainTextObject.constructor).toBe('function')
    expect(PlainTextObject).toBeInstanceOf(Object)
    expect(PlainTextObject.constructor).toBe(Function)
    expect(PlainTextObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(PlainTextObject)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should construct an instance with a coeffCount', () => {
    const Constructor = jest.fn(PlainTextObject)
    Constructor({ coeffCount: 2 })
    expect(Constructor).toBeCalledWith({ coeffCount: 2 })
  })
  test('It should construct an instance with a coeffCount, capacity', () => {
    const Constructor = jest.fn(PlainTextObject)
    Constructor({ capacity: 2, coeffCount: 2 })
    expect(Constructor).toBeCalledWith({ capacity: 2, coeffCount: 2 })
  })
  test('It should fail to construct an instance from invalid parameters', () => {
    const Constructor = jest.fn(PlainTextObject)
    expect(() => Constructor({ coeffCount: -1, capacity: 2 })).toThrow()
    expect(Constructor).toBeCalledWith({
      coeffCount: -1,
      capacity: 2
    })
  })
  test('It should fail to construct an instance from bad parameters', () => {
    const Constructor = jest.fn(PlainTextObject)
    const parmsId = context.firstParmsId
    expect(() => Constructor({ capacity: 2 })).toThrow()
    expect(Constructor).toBeCalledWith({ capacity: 2 })
  })
  test('It should have properties', () => {
    const plainText = PlainTextObject()
    // Test properties
    expect(plainText).toHaveProperty('instance')
    expect(plainText).toHaveProperty('unsafeInject')
    expect(plainText).toHaveProperty('delete')
    expect(plainText).toHaveProperty('reserve')
    expect(plainText).toHaveProperty('shrinkToFit')
    expect(plainText).toHaveProperty('release')
    expect(plainText).toHaveProperty('resize')
    expect(plainText).toHaveProperty('setZero')
    expect(plainText).toHaveProperty('isZero')
    expect(plainText).toHaveProperty('capacity')
    expect(plainText).toHaveProperty('coeffCount')
    expect(plainText).toHaveProperty('significantCoeffCount')
    expect(plainText).toHaveProperty('nonzeroCoeffCount')
    expect(plainText).toHaveProperty('toPolynomial')
    expect(plainText).toHaveProperty('isNttForm')
    expect(plainText).toHaveProperty('scale')
    expect(plainText).toHaveProperty('pool')
    expect(plainText).toHaveProperty('save')
    expect(plainText).toHaveProperty('copy')
    expect(plainText).toHaveProperty('clone')
    expect(plainText).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const plainText = PlainTextObject()
    expect(plainText.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const plainText = PlainTextObject()
    const newPlainText = PlainTextObject()
    newPlainText.delete()
    const spyOn = jest.spyOn(newPlainText, 'unsafeInject')
    newPlainText.unsafeInject(plainText.instance)
    expect(spyOn).toHaveBeenCalledWith(plainText.instance)
  })
  test('It should delete the old instance and inject', () => {
    const plainText = PlainTextObject()
    const newPlainText = PlainTextObject()
    const spyOn = jest.spyOn(newPlainText, 'unsafeInject')
    newPlainText.unsafeInject(plainText.instance)
    expect(spyOn).toHaveBeenCalledWith(plainText.instance)
  })
  test("It should delete it's instance", () => {
    const plainText = PlainTextObject()
    const spyOn = jest.spyOn(plainText, 'delete')
    plainText.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(plainText.instance).toBeNull()
  })
  test('It should skip deleting twice', () => {
    const plainText = PlainTextObject()
    plainText.delete()
    const spyOn = jest.spyOn(plainText, 'delete')
    plainText.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(plainText.instance).toBeNull()
  })
  test('It should reserve memory', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'reserve')
    plainText.reserve(encoder.slotCount * 2)
    expect(spyOn).toHaveBeenCalledWith(encoder.slotCount * 2)
  })
  test('It should fail to reserve memory', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'reserve')
    expect(() => plainText.reserve(-2)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(-2)
  })
  test('It should shrink', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    plainText.reserve(encoder.slotCount * 2)
    const spyOn = jest.spyOn(plainText, 'shrinkToFit')
    plainText.shrinkToFit()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should release allocated memory', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'release')
    plainText.release()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should resize', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'resize')
    plainText.resize(encoder.slotCount * 2)
    expect(spyOn).toHaveBeenCalledWith(encoder.slotCount * 2)
  })
  test('It should fail to resize', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'resize')
    expect(() => plainText.resize(-2)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(-2)
  })
  test('It should set to zero', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'setZero')
    plainText.setZero()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return if plaintext is zero', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(0)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    expect(typeof plainText.isZero).toBe('boolean')
  })
  test('It should return the capacity of the current allocation', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    expect(typeof plainText.capacity).toBe('number')
  })
  test('It should return the coeff count', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    expect(typeof plainText.coeffCount).toBe('number')
  })
  test('It should return the significant coeff count', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    expect(typeof plainText.significantCoeffCount).toBe('number')
  })
  test('It should return the non-zero coeff count', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    expect(typeof plainText.nonzeroCoeffCount).toBe('number')
  })
  test('It should return the polynomial string', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'toPolynomial')
    const str = plainText.toPolynomial()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should fail to return the polynomial string', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plainText = PlainTextObject()
    const parmsId = context.firstParmsId
    encoder.encode(arr, plainText)
    evaluator.plainTransformToNtt(plainText, parmsId, plainText)
    const spyOn = jest.spyOn(plainText, 'toPolynomial')
    expect(() => plainText.toPolynomial()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return if in NTT form', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    expect(typeof plainText.isNttForm).toBe('boolean')
  })
  test('It should return the scale (ckks)', () => {
    const arr = Float64Array.from(
      Array.from({ length: ckksEncoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    ckksEncoder.encode(arr, Math.pow(2, 20), plainText)
    expect(typeof plainText.scale).toBe('number')
  })
  test('It should return a parms id type', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const parms = plainText.parmsId
    const values = parms.values
    expect(Array.isArray(values)).toBe(true)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should return the currently used memory pool handle', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const pool = plainText.pool
    expect(pool.constructor.name).toBe('MemoryPoolHandle')
  })
  test('It should save to a string', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'save')
    const str = plainText.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should load from a string', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const str = plainText.save()
    plainText.delete()
    const newPlainText = PlainTextObject()
    const spyOn = jest.spyOn(newPlainText, 'load')
    newPlainText.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
  })
  test('It should fail to load from a string', () => {
    const plainText = PlainTextObject()
    const spyOn = jest.spyOn(plainText, 'load')
    expect(() =>
      plainText.load(
        context,
        'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
    )
  })
  test('It should copy another instance', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const newPlainText = PlainTextObject()
    const spyOn = jest.spyOn(newPlainText, 'copy')
    newPlainText.copy(plainText)
    expect(spyOn).toHaveBeenCalledWith(plainText)
    expect(newPlainText.save()).toEqual(plainText.save())
  })
  test('It should fail to copy another instance', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plain = encoder.encode(arr)
    const newPlain = PlainTextObject()
    plain.delete()
    const spyOn = jest.spyOn(newPlain, 'copy')
    expect(() => newPlain.copy(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should clone itself', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'clone')
    const newPlainText = plainText.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newPlainText).toBeDefined()
    expect(typeof newPlainText.constructor).toBe('function')
    expect(newPlainText).toBeInstanceOf(Object)
    expect(newPlainText.constructor).toBe(Object)
    expect(newPlainText.instance.constructor.name).toBe('Plaintext')
    expect(newPlainText.save()).toEqual(plainText.save())
  })
  test('It should fail to clone itself', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    plainText.delete()
    const spyOn = jest.spyOn(plainText, 'clone')
    expect(() => plainText.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const str = plainText.save()
    const newPlainText = PlainTextObject()
    const spyOn = jest.spyOn(newPlainText, 'move')
    newPlainText.move(plainText)
    expect(spyOn).toHaveBeenCalledWith(plainText)
    expect(plainText.instance).toBeNull()
    expect(() => plainText.isZero).toThrow(TypeError)
    expect(newPlainText.save()).toEqual(str)
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).fill(5)
    )
    const plainText = PlainTextObject()
    encoder.encode(arr, plainText)
    const newPlainText = PlainTextObject()
    plainText.delete()
    const spyOn = jest.spyOn(newPlainText, 'move')
    expect(() => newPlainText.move(plainText)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainText)
  })
})
