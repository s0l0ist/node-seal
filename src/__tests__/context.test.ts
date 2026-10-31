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
  test('It should report valid parameters (bfv)', () => {
    expect(bfvContext.parameterErrorName()).toBe('success')
    expect(bfvContext.parameterErrorMessage()).toBe('valid')
    const qualifiers = bfvContext.firstContextData().qualifiers()
    expect(qualifiers.parameterErrorName()).toBe('success')
    expect(qualifiers.parameterErrorMessage()).toBe('valid')
  })
  test('It should report invalid parameters (bfv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )
    expect(context.parametersSet()).toBe(false)
    expect(context.parameterErrorName()).toBe('invalid_coeff_modulus_size')
    expect(context.parameterErrorMessage()).toBe(
      "coeff_modulus's primes' count is not bounded by SEAL_COEFF_MOD_COUNT_MIN(MAX)"
    )
    const qualifiers = context.keyContextData().qualifiers()
    expect(qualifiers.parameterErrorName()).toBe(context.parameterErrorName())
    expect(qualifiers.parameterErrorMessage()).toBe(
      context.parameterErrorMessage()
    )
  })
  test('It should return the key context data (bfv)', () => {
    const contextData = bfvContext.keyContextData()
    expect(contextData.parmsId().values()).toEqual(
      bfvContext.keyParmsId().values()
    )
    expect(contextData.totalCoeffModulusBitCount()).toBe(109)
    expect(contextData.nextContextData().parmsId().values()).toEqual(
      bfvContext.firstParmsId().values()
    )
  })
  test('It should return the total coefficient modulus at each level', () => {
    for (const context of [bfvContext, bgvContext, ckksContext]) {
      for (const contextData of [
        context.keyContextData(),
        context.firstContextData(),
        context.lastContextData()
      ]) {
        const primes: bigint[] = seal.jsArrayFromVecModulus(
          contextData.parms().coeffModulus()
        )
        const words = contextData.totalCoeffModulus()
        let total = 0n
        for (let i = 0; i < words.length; i++) {
          total += words[i] << BigInt(64 * i)
        }

        expect(words).toBeInstanceOf(BigUint64Array)
        expect(words.length).toBe(primes.length)
        expect(total).toBe(
          primes.reduce((product, prime) => product * prime, 1n)
        )
        expect(total.toString(2).length).toBe(
          contextData.totalCoeffModulusBitCount()
        )
      }
    }
  })
  test('It should return plaintext scaling constants (bfv / bgv)', () => {
    for (const context of [bfvContext, bgvContext]) {
      const contextData = context.keyContextData()
      const primes: bigint[] = seal.jsArrayFromVecModulus(
        contextData.parms().coeffModulus()
      )
      const q = primes.reduce((product, prime) => product * prime, 1n)
      const t = contextData.parms().plainModulus().value()
      const delta = q / t

      expect(contextData.coeffDivPlainModulus()).toEqual(
        primes.map(prime => {
          const operand = delta % prime
          return { operand, quotient: (operand << 64n) / prime }
        })
      )
      expect(contextData.coeffModulusModPlainModulus()).toBe(q % t)
      expect(contextData.plainUpperHalfThreshold()).toBe((t + 1n) / 2n)
      expect(contextData.qualifiers().usingFastPlainLift).toBe(true)
      expect(contextData.plainUpperHalfIncrement()).toEqual(
        BigUint64Array.from(primes.map(prime => prime - t))
      )
      expect(contextData.upperHalfIncrement()).toEqual(
        BigUint64Array.from(primes.map(prime => (q % t) % prime))
      )
      expect(contextData.upperHalfThreshold()).toEqual(new BigUint64Array())
    }
  })
  test('It should return the full plaintext lifting correction without fast lifting (bfv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      seal.CoeffModulus.Create(4096, Int32Array.from([17, 17]))
    )
    encParms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
    const context = new seal.SEALContext(
      encParms,
      false,
      seal.SecLevelType.tc128
    )
    const contextData = context.keyContextData()
    const primes: bigint[] = seal.jsArrayFromVecModulus(encParms.coeffModulus())
    const q = primes.reduce((product, prime) => product * prime, 1n)
    const t = encParms.plainModulus().value()
    const increment = contextData.plainUpperHalfIncrement()

    expect(context.parametersSet()).toBe(true)
    expect(contextData.qualifiers().usingFastPlainLift).toBe(false)
    expect(increment).toEqual(BigUint64Array.from([q - t, 0n]))
  })
  test('It should return signed decoding constants (ckks)', () => {
    const contextData = ckksContext.keyContextData()
    const primes: bigint[] = seal.jsArrayFromVecModulus(
      contextData.parms().coeffModulus()
    )
    const q = primes.reduce((product, prime) => product * prime, 1n)
    const threshold = contextData.upperHalfThreshold()
    let total = 0n
    for (let i = 0; i < threshold.length; i++) {
      total += threshold[i] << BigInt(64 * i)
    }

    expect(total).toBe((q + 1n) / 2n)
    expect(contextData.plainUpperHalfThreshold()).toBe(1n << 63n)
    expect(contextData.plainUpperHalfIncrement()).toEqual(
      BigUint64Array.from(
        primes.map(prime => (prime - ((1n << 64n) % prime)) % prime)
      )
    )
    expect(contextData.coeffDivPlainModulus()).toEqual([])
    expect(contextData.upperHalfIncrement()).toEqual(new BigUint64Array())
    expect(contextData.coeffModulusModPlainModulus()).toBe(0n)
    expect(contextData.plainNttTables()).toEqual([])
  })
  test('It should return independent copies of context constants', () => {
    const contextData = bfvContext.keyContextData()
    const total = contextData.totalCoeffModulus()
    const expectedTotal = total.slice()
    const delta = contextData.coeffDivPlainModulus()
    const expectedDelta = delta.map(value => ({ ...value }))

    total[0] = 0n
    delta[0].operand = 0n
    delta[0].quotient = 0n

    expect(contextData.totalCoeffModulus()).toEqual(expectedTotal)
    expect(contextData.coeffDivPlainModulus()).toEqual(expectedDelta)
  })
  test('It should return the coefficient and plaintext NTT tables', () => {
    for (const context of [bfvContext, bgvContext, ckksContext]) {
      const contextData = context.keyContextData()
      const encParms = contextData.parms()
      const primes: bigint[] = seal.jsArrayFromVecModulus(
        encParms.coeffModulus()
      )
      const smallTables = contextData.smallNttTables()
      const plainTables = contextData.plainNttTables()
      const moduli = [...primes]
      if (encParms.scheme().value !== seal.SchemeType.ckks.value) {
        moduli.push(encParms.plainModulus().value())
      }

      expect(smallTables.length).toBe(primes.length)
      expect(plainTables.length).toBe(moduli.length - primes.length)
      const tables = [...smallTables, ...plainTables]
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        const modulus = moduli[i]
        const root = table.getRoot()
        let power = root
        for (let j = 0; j < table.coeffCountPower(); j++) {
          power = (power * power) % modulus
        }
        const inverse = table.invDegreeModulo()

        expect(table.modulus().value()).toBe(modulus)
        expect(table.coeffCount()).toBe(4096)
        expect(table.coeffCountPower()).toBe(12)
        expect(power).toBe(modulus - 1n)
        expect((power * power) % modulus).toBe(1n)
        expect((inverse.operand * 4096n) % modulus).toBe(1n)
        expect(inverse.quotient).toBe((inverse.operand << 64n) / modulus)
        expect(table.getFromRootPowers(2048).operand).toBe(root)
        expect((root * table.getFromInvRootPowers(1).operand) % modulus).toBe(
          1n
        )
      }
    }
  })
  test('It should copy NTT root powers', () => {
    const table = bfvContext.keyContextData().smallNttTables()[0]
    const roots = table.getFromRootPowers()
    const invRoots = table.getFromInvRootPowers()
    const modulus = table.modulus().value()

    expect(roots.length).toBe(4096)
    expect(invRoots.length).toBe(4096)
    for (const index of [0, 1, 2048, 4095]) {
      expect(roots[index]).toEqual(table.getFromRootPowers(index))
      expect(invRoots[index]).toEqual(table.getFromInvRootPowers(index))
      expect(roots[index].quotient).toBe(
        (roots[index].operand << 64n) / modulus
      )
      expect(invRoots[index].quotient).toBe(
        (invRoots[index].operand << 64n) / modulus
      )
    }
    roots[0].operand = 0n
    invRoots[0].operand = 0n
    expect(table.getFromRootPowers(0).operand).toBe(1n)
    expect(table.getFromInvRootPowers(0).operand).toBe(1n)
  })
  test('It should fail to read NTT root powers outside the table', () => {
    const table = bfvContext.keyContextData().smallNttTables()[0]

    expect(() => table.getFromRootPowers(4096)).toThrow()
    expect(() => table.getFromInvRootPowers(4096)).toThrow()
    expect(() => table.getFromRootPowers(-1)).toThrow()
    expect(() => table.getFromInvRootPowers(-1)).toThrow()
  })
  test('It should keep NTT tables alive after deleting the context', () => {
    const context = new seal.SEALContext(
      bfvEncParms,
      true,
      seal.SecLevelType.tc128
    )
    const contextData = context.keyContextData()
    const smallTable = contextData.smallNttTables()[0]
    const plainTable = contextData.plainNttTables()[0]
    const root = smallTable.getRoot()
    const plainRoot = plainTable.getRoot()

    contextData.delete()
    context.delete()

    expect(smallTable.getFromRootPowers(2048).operand).toBe(root)
    expect(plainTable.getFromRootPowers(2048).operand).toBe(plainRoot)
  })
  test('It should return no plaintext NTT tables without batching (bfv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
    )
    encParms.setPlainModulus(new seal.Modulus(17n))
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )
    const contextData = context.keyContextData()

    expect(context.parametersSet()).toBe(true)
    expect(contextData.qualifiers().usingBatching).toBe(false)
    expect(contextData.plainNttTables()).toEqual([])
  })
  test('It should return empty arrays for unavailable precomputations', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )
    const contextData = context.keyContextData()

    expect(contextData.totalCoeffModulus()).toEqual(new BigUint64Array())
    expect(contextData.coeffDivPlainModulus()).toEqual([])
    expect(contextData.plainUpperHalfIncrement()).toEqual(new BigUint64Array())
    expect(contextData.upperHalfThreshold()).toEqual(new BigUint64Array())
    expect(contextData.upperHalfIncrement()).toEqual(new BigUint64Array())
    expect(contextData.smallNttTables()).toEqual([])
    expect(contextData.plainNttTables()).toEqual([])
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
    const parmsId = bfvContext.firstParmsId()
    const contextData = bfvContext.getContextData(parmsId)
    expect(contextData.totalCoeffModulusBitCount()).toBe(72)
  })
  test('It should fail to read missing context data (bfv)', () => {
    const parmsId = new seal.ParmsIdType()
    const contextData = bfvContext.getContextData(parmsId)

    expect(() => contextData.parms()).toThrow()
    expect(() => contextData.parmsId()).toThrow()
    expect(() => contextData.qualifiers()).toThrow()
    expect(() => contextData.totalCoeffModulus()).toThrow()
    expect(() => contextData.totalCoeffModulusBitCount()).toThrow()
    expect(() => contextData.coeffDivPlainModulus()).toThrow()
    expect(() => contextData.plainUpperHalfThreshold()).toThrow()
    expect(() => contextData.plainUpperHalfIncrement()).toThrow()
    expect(() => contextData.upperHalfThreshold()).toThrow()
    expect(() => contextData.upperHalfIncrement()).toThrow()
    expect(() => contextData.coeffModulusModPlainModulus()).toThrow()
    expect(() => contextData.smallNttTables()).toThrow()
    expect(() => contextData.plainNttTables()).toThrow()
    expect(() => contextData.prevContextData()).toThrow()
    expect(() => contextData.nextContextData()).toThrow()
    expect(() => contextData.chainIndex()).toThrow()
  })
  test('It should fail to print an invalid context (bfv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    const context = new seal.SEALContext(
      encParms,
      true,
      seal.SecLevelType.tc128
    )

    try {
      context.toHuman()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'encryption parameters are not set'
      ])
    }
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
    expect(() => contextData.nextContextData().chainIndex()).toThrow()
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
    const parmsId = bgvContext.firstParmsId()
    const contextData = bgvContext.getContextData(parmsId)
    expect(contextData.totalCoeffModulusBitCount()).toBe(72)
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
    expect(() => contextData.nextContextData().chainIndex()).toThrow()
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
    const parmsId = ckksContext.firstParmsId()
    const contextData = ckksContext.getContextData(parmsId)
    expect(contextData.totalCoeffModulusBitCount()).toBe(62)
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
    expect(() => contextData.nextContextData().chainIndex()).toThrow()
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
