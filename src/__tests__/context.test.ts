import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type EncryptionParameters,
  type MainModule,
  type SEALContext
} from '../index_throws'

let seal: MainModule
let bfvEncParms: EncryptionParameters
let bgvEncParms: EncryptionParameters
let ckksEncParms: EncryptionParameters
let bfvContext: SEALContext
let bgvContext: SEALContext
let ckksContext: SEALContext
beforeAll(async () => {
  seal = await MainModuleFactory()

  bfvEncParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
  bfvEncParms.setPolyModulusDegree(4096)
  bfvEncParms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
  )
  bfvEncParms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  bfvContext = new seal.SEALContext(bfvEncParms, true, seal.SecLevelType.tc128)

  bgvEncParms = new seal.EncryptionParameters(seal.SchemeType.bgv)
  bgvEncParms.setPolyModulusDegree(4096)
  bgvEncParms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
  )
  bgvEncParms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  bgvContext = new seal.SEALContext(bgvEncParms, true, seal.SecLevelType.tc128)

  ckksEncParms = new seal.EncryptionParameters(seal.SchemeType.ckks)
  ckksEncParms.setPolyModulusDegree(4096)
  ckksEncParms.setCoeffModulus(
    seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = new seal.SEALContext(
    ckksEncParms,
    true,
    seal.SecLevelType.tc128
  )
})

describe('Context, ContextData, EncryptionParameterQualifiers', () => {
  test('It should have parameters set (bfv)', () => {
    expect(bfvContext.parametersSet()).toBe(true)
  })
  test('It should copy (bfv)', () => {
    const copy = bfvContext.copy()
    expect(copy.toHuman()).toBe(bfvContext.toHuman())
  })
  test('It should delete (bfv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    encParms.setPolyModulusDegree(1024)
    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(1024, seal.SecLevelType.tc128)
    )
    encParms.setPlainModulus(seal.PlainModulus.Batching(1024, 20))
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )
    context.delete()
    expect(context.isDeleted()).toBe(true)
  })
  test('It should use key switching (bfv)', () => {
    expect(bfvContext.usingKeyswitching()).toBe(true)
  })
  test('It should get contextData (bfv)', () => {
    const parmsId = new seal.ParmsIdType()
    const contextData = bfvContext.getContextData(parmsId)
    expect(contextData.totalCoeffModulusBitCount()).toBe(0)
  })
  test('It should get firstParmsId (bfv)', () => {
    expect(bfvContext.firstParmsId().values()).toEqual(
      BigUint64Array.from([
        1873000747715295028n,
        11215186030905010692n,
        3414445251667737935n,
        182315704735341130n
      ])
    )
  })
  test('It should get lastParmsId (bfv)', () => {
    expect(bfvContext.lastParmsId().values()).toEqual(
      BigUint64Array.from([
        11429859456180146811n,
        6196561566494887094n,
        5221243576142229105n,
        1012306229078676531n
      ])
    )
  })
  test('It should get keyParmsId (bfv)', () => {
    expect(bfvContext.keyParmsId().values()).toEqual(
      BigUint64Array.from([
        15359885167903699025n,
        13859760541767178383n,
        7059071203920448784n,
        13833089372777612512n
      ])
    )
  })
  test('It should return the last context data (bfv)', () => {
    const contextData = bfvContext.lastContextData()
    expect(contextData.prevContextData().chainIndex()).toBe(1)
    expect(contextData.nextContextData().chainIndex()).toBe(0)
    expect(contextData.chainIndex()).toBe(0)
    expect(contextData.totalCoeffModulusBitCount()).toBe(36)
    const encParms = contextData.parms()
    expect(encParms.scheme().value).toBe(seal.SchemeType.bfv.value)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(contextData.parmsId().values()).toEqual(
      BigUint64Array.from([
        11429859456180146811n,
        6196561566494887094n,
        5221243576142229105n,
        1012306229078676531n
      ])
    )
    const qualifiers = contextData.qualifiers()
    expect(qualifiers.securityLevel).toBe(seal.SecLevelType.tc128)
    expect(qualifiers.usingFFT).toBe(true)
    expect(qualifiers.usingNTT).toBe(true)
    expect(qualifiers.usingBatching).toBe(true)
    expect(qualifiers.usingFastPlainLift).toBe(true)
    expect(qualifiers.usingDescendingModulusChain).toBe(true)
    expect(qualifiers.parametersSet()).toBe(true)
  })

  test('It should have parameters set (bgv)', () => {
    expect(bgvContext.parametersSet()).toBe(true)
  })
  test('It should copy (bgv)', () => {
    const copy = bgvContext.copy()
    expect(copy.toHuman()).toBe(bgvContext.toHuman())
  })
  test('It should delete (bgv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bgv)
    encParms.setPolyModulusDegree(1024)
    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(1024, seal.SecLevelType.tc128)
    )
    encParms.setPlainModulus(seal.PlainModulus.Batching(1024, 20))
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )
    context.delete()
    expect(context.isDeleted()).toBe(true)
  })
  test('It should use key switching (bgv)', () => {
    expect(bgvContext.usingKeyswitching()).toBe(true)
  })
  test('It should get contextData (bgv)', () => {
    const parmsId = new seal.ParmsIdType()
    const contextData = bgvContext.getContextData(parmsId)
    expect(contextData.totalCoeffModulusBitCount()).toBe(0)
  })
  test('It should get firstParmsId (bgv)', () => {
    expect(bgvContext.firstParmsId().values()).toEqual(
      BigUint64Array.from([
        17112417915347456309n,
        11025187185903529436n,
        1716350755431595045n,
        11738953022021559999n
      ])
    )
  })
  test('It should get lastParmsId (bfv)', () => {
    expect(bgvContext.lastParmsId().values()).toEqual(
      BigUint64Array.from([
        1049956709168777796n,
        17936793999995132093n,
        14509052796118885309n,
        1763373601098533076n
      ])
    )
  })
  test('It should get keyParmsId (bfv)', () => {
    expect(bgvContext.keyParmsId().values()).toEqual(
      BigUint64Array.from([
        12368866349264881964n,
        5404625976289084550n,
        8638021829381928352n,
        5181846406309483200n
      ])
    )
  })
  test('It should return the last context data (bgv)', () => {
    const contextData = bgvContext.lastContextData()
    expect(contextData.prevContextData().chainIndex()).toBe(1)
    expect(contextData.nextContextData().chainIndex()).toBe(0)
    expect(contextData.chainIndex()).toBe(0)
    expect(contextData.totalCoeffModulusBitCount()).toBe(36)
    const encParms = contextData.parms()
    expect(encParms.scheme().value).toBe(seal.SchemeType.bgv.value)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(contextData.parmsId().values()).toEqual(
      BigUint64Array.from([
        1049956709168777796n,
        17936793999995132093n,
        14509052796118885309n,
        1763373601098533076n
      ])
    )
    const qualifiers = contextData.qualifiers()
    expect(qualifiers.securityLevel).toBe(seal.SecLevelType.tc128)
    expect(qualifiers.usingFFT).toBe(true)
    expect(qualifiers.usingNTT).toBe(true)
    expect(qualifiers.usingBatching).toBe(true)
    expect(qualifiers.usingFastPlainLift).toBe(true)
    expect(qualifiers.usingDescendingModulusChain).toBe(true)
    expect(qualifiers.parametersSet()).toBe(true)
  })

  test('It should have parameters set (ckks)', () => {
    expect(ckksContext.parametersSet()).toBe(true)
  })
  test('It should copy (ckks)', () => {
    const copy = ckksContext.copy()
    expect(copy.toHuman()).toBe(ckksContext.toHuman())
  })
  test('It should delete (ckks)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.ckks)
    encParms.setPolyModulusDegree(1024)
    encParms.setCoeffModulus(
      seal.CoeffModulus.Create(1024, Int32Array.from([27]))
    )
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )
    context.delete()
    expect(context.isDeleted()).toBe(true)
  })
  test('It should use key switching (ckks)', () => {
    expect(bgvContext.usingKeyswitching()).toBe(true)
  })
  test('It should get contextData (ckks)', () => {
    const parmsId = new seal.ParmsIdType()
    const contextData = ckksContext.getContextData(parmsId)
    expect(contextData.totalCoeffModulusBitCount()).toBe(0)
  })
  test('It should get firstParmsId (ckks)', () => {
    expect(ckksContext.firstParmsId().values()).toEqual(
      BigUint64Array.from([
        4492399477521718661n,
        6678205974195002180n,
        858647691448819082n,
        8312085177746294202n
      ])
    )
  })
  test('It should get lastParmsId (ckks)', () => {
    expect(ckksContext.lastParmsId().values()).toEqual(
      BigUint64Array.from([
        12117522748539832123n,
        9700705267411383530n,
        14828566003801519575n,
        14524092301492622527n
      ])
    )
  })
  test('It should get keyParmsId (ckks)', () => {
    expect(ckksContext.keyParmsId().values()).toEqual(
      BigUint64Array.from([
        3615168670940953979n,
        5575273849342085974n,
        9303591971195578396n,
        13061002207864243590n
      ])
    )
  })
  test('It should return the last context data (ckks)', () => {
    const contextData = ckksContext.lastContextData()
    expect(contextData.prevContextData().chainIndex()).toBe(1)
    expect(contextData.nextContextData().chainIndex()).toBe(0)
    expect(contextData.chainIndex()).toBe(0)
    expect(contextData.totalCoeffModulusBitCount()).toBe(46)
    const encParms = contextData.parms()
    expect(encParms.scheme().value).toBe(seal.SchemeType.ckks.value)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(contextData.parmsId().values()).toEqual(
      BigUint64Array.from([
        12117522748539832123n,
        9700705267411383530n,
        14828566003801519575n,
        14524092301492622527n
      ])
    )
    const qualifiers = contextData.qualifiers()
    expect(qualifiers.securityLevel).toBe(seal.SecLevelType.tc128)
    expect(qualifiers.usingFFT).toBe(true)
    expect(qualifiers.usingNTT).toBe(true)
    expect(qualifiers.usingBatching).toBe(true)
    expect(qualifiers.usingFastPlainLift).toBe(false)
    expect(qualifiers.usingDescendingModulusChain).toBe(true)
    expect(qualifiers.parametersSet()).toBe(true)
  })

  test('It should return the first context data (bfv)', () => {
    const contextData = bfvContext.firstContextData()
    expect(contextData.prevContextData().chainIndex()).toBe(2)
    expect(contextData.nextContextData().chainIndex()).toBe(0)
    expect(contextData.chainIndex()).toBe(1)
    expect(contextData.totalCoeffModulusBitCount()).toBe(72)
    const encParms = contextData.parms()
    expect(encParms.scheme().value).toBe(seal.SchemeType.bfv.value)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(contextData.parmsId().values()).toEqual(
      BigUint64Array.from([
        1873000747715295028n,
        11215186030905010692n,
        3414445251667737935n,
        182315704735341130n
      ])
    )
    const qualifiers = contextData.qualifiers()
    expect(qualifiers.securityLevel).toBe(seal.SecLevelType.tc128)
    expect(qualifiers.usingFFT).toBe(true)
    expect(qualifiers.usingNTT).toBe(true)
    expect(qualifiers.usingBatching).toBe(true)
    expect(qualifiers.usingFastPlainLift).toBe(true)
    expect(qualifiers.usingDescendingModulusChain).toBe(true)
    expect(qualifiers.parametersSet()).toBe(true)
  })
  test('It should return the first context data (bgv)', () => {
    const contextData = bgvContext.firstContextData()
    expect(contextData.prevContextData().chainIndex()).toBe(2)
    expect(contextData.nextContextData().chainIndex()).toBe(0)
    expect(contextData.chainIndex()).toBe(1)
    expect(contextData.totalCoeffModulusBitCount()).toBe(72)
    const encParms = contextData.parms()
    expect(encParms.scheme().value).toBe(seal.SchemeType.bgv.value)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(contextData.parmsId().values()).toEqual(
      BigUint64Array.from([
        17112417915347456309n,
        11025187185903529436n,
        1716350755431595045n,
        11738953022021559999n
      ])
    )
    const qualifiers = contextData.qualifiers()
    expect(qualifiers.securityLevel).toBe(seal.SecLevelType.tc128)
    expect(qualifiers.usingFFT).toBe(true)
    expect(qualifiers.usingNTT).toBe(true)
    expect(qualifiers.usingBatching).toBe(true)
    expect(qualifiers.usingFastPlainLift).toBe(true)
    expect(qualifiers.usingDescendingModulusChain).toBe(true)
    expect(qualifiers.parametersSet()).toBe(true)
  })
  test('It should return the first context data (ckks)', () => {
    const contextData = ckksContext.firstContextData()
    expect(contextData.prevContextData().chainIndex()).toBe(2)
    expect(contextData.nextContextData().chainIndex()).toBe(0)
    expect(contextData.chainIndex()).toBe(1)
    expect(contextData.totalCoeffModulusBitCount()).toBe(62)
    const encParms = contextData.parms()
    expect(encParms.scheme().value).toBe(seal.SchemeType.ckks.value)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(contextData.parmsId().values()).toEqual(
      BigUint64Array.from([
        4492399477521718661n,
        6678205974195002180n,
        858647691448819082n,
        8312085177746294202n
      ])
    )
    const qualifiers = contextData.qualifiers()
    expect(qualifiers.securityLevel).toBe(seal.SecLevelType.tc128)
    expect(qualifiers.usingFFT).toBe(true)
    expect(qualifiers.usingNTT).toBe(true)
    expect(qualifiers.usingBatching).toBe(true)
    expect(qualifiers.usingFastPlainLift).toBe(false)
    expect(qualifiers.usingDescendingModulusChain).toBe(true)
    expect(qualifiers.parametersSet()).toBe(true)
  })
})
