const fs = require('fs')

const {
  SCHEME_TYPES,
  SECURITY_LEVELS,
  POLYMODULUS_DEGREES,
  BFV_COEFF_MOD_BIT_SIZES,
  CKKS_COEFF_MOD_BIT_SIZES,
  SCHEME_TYPES_CONSTRUCTOR,
  SECURITY_LEVELS_CONSTRUCTOR
} = require('./constants')

const genTests = (verb) => {
  for (let schemeType in SCHEME_TYPES) {
    for (let polyModDeg in POLYMODULUS_DEGREES) {
      for (let secLevel in SECURITY_LEVELS) {
          const folderName = `${verb}`
          const fileName = `${verb}-scheme_${SCHEME_TYPES[schemeType]}-poly_${POLYMODULUS_DEGREES[polyModDeg]}-sec_${SECURITY_LEVELS[secLevel]}.test.js`
          const code = []

          // Skip certain generated tests that are known to fail
          let skip = false
          if (
            // Fails because there's only 1 coeffModulus
            POLYMODULUS_DEGREES[polyModDeg] === POLYMODULUS_DEGREES.BITS_4096 && SECURITY_LEVELS[secLevel] === SECURITY_LEVELS.BITS_256 ||
            // Fails from OOM
            POLYMODULUS_DEGREES[polyModDeg] === POLYMODULUS_DEGREES.BITS_16384 && SECURITY_LEVELS[secLevel] === SECURITY_LEVELS.BITS_128 ||
            POLYMODULUS_DEGREES[polyModDeg] === POLYMODULUS_DEGREES.BITS_32768
          ) {
            skip = true
          }

          code.push(`describe${skip ? '.skip': ''}('${verb} on ${schemeType}', () => {
  describe('polyModulusDegree ${POLYMODULUS_DEGREES[polyModDeg]}', () => {
    test('${SECURITY_LEVELS[secLevel]}-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = ${SCHEME_TYPES_CONSTRUCTOR[schemeType]}
      const securityLevel = ${SECURITY_LEVELS_CONSTRUCTOR[SECURITY_LEVELS[secLevel]]}
      const polyModulusDegree = ${POLYMODULUS_DEGREES[polyModDeg]}
      const bitSizes = [${BFV_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}]${schemeType === SCHEME_TYPES.BFV ? '\n      const bitSize = 20' : ''}
      
      const parms = Morfix.EncryptionParameters(schemeType)

      parms.setPolyModulusDegree(polyModulusDegree)
      
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus(
        Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)) 
      )
`)

        if (schemeType === SCHEME_TYPES.BFV) {
          code.push(`
      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus(
        Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
      )
`)
        }

        code.push(`
      const context = Morfix.Context(
        parms,
        true,
        securityLevel
      )

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator(context)

      const spyGenRelinKeys = jest.spyOn(keyGenerator, 'genRelinKeys')
      const relinKeys = keyGenerator.genRelinKeys()
      expect(spyGenRelinKeys).toHaveBeenCalled()

      const spySaveRelinKeys = jest.spyOn(relinKeys, 'save')
      const base64 = relinKeys.save()
      expect(spySaveRelinKeys).toHaveBeenCalled()

      const spyLoadRelinKeys = jest.spyOn(relinKeys, 'load')
      relinKeys.load(context, base64)
      expect(spyLoadRelinKeys).toHaveBeenCalled()
    })
  })
})
`)
          fs.mkdirSync(`${process.cwd()}/${folderName}/`, {recursive: true})
          fs.writeFileSync(`./${folderName}/${fileName}`, code.join(''))
      }
    }
  }
}

genTests('relinkey')
