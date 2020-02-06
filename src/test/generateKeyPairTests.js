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
          POLYMODULUS_DEGREES[polyModDeg] === POLYMODULUS_DEGREES.BITS_4096 && SECURITY_LEVELS[secLevel] === SECURITY_LEVELS.BITS_256
          ) {
            skip = true
          }

          code.push(`describe${skip ? '.skip': ''}('${verb} on ${schemeType}', () => {
  describe('polyModulusDegree ${POLYMODULUS_DEGREES[polyModDeg]}', () => {
    test('${SECURITY_LEVELS[secLevel]}-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: ${SCHEME_TYPES_CONSTRUCTOR[schemeType]}
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]}
      })
`)

        if (schemeType === SCHEME_TYPES.BFV) {
          code.push(`
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSizes: Int32Array.from([${BFV_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}])
        })
      })

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSize: 20
        })
      })
`)
        }

        if (schemeType === SCHEME_TYPES.CKKS) {
          code.push(`
      // Create a suitable set of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSizes: Int32Array.from([${CKKS_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}])
        })
      })
`)
        }


          code.push(`
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: ${SECURITY_LEVELS_CONSTRUCTOR[SECURITY_LEVELS[secLevel]]}
      })

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context
      })

      const spyGetSecretKey = jest.spyOn(keyGenerator, 'getSecretKey')
      const secretKey = keyGenerator.getSecretKey()
      expect(spyGetSecretKey).toHaveBeenCalled()

      const spyGetPublicKey = jest.spyOn(keyGenerator, 'getPublicKey')
      const publicKey = keyGenerator.getPublicKey()
      expect(spyGetPublicKey).toHaveBeenCalled()


      const spySaveSecretKey = jest.spyOn(secretKey, 'save')
      const secretKeyBase64 = secretKey.save()
      expect(spySaveSecretKey).toHaveBeenCalled()

      const spySavePublicKey = jest.spyOn(publicKey, 'save')
      const publicKeyBase64 = publicKey.save()
      expect(spySavePublicKey).toHaveBeenCalled()


      const spyLoadSecretKey = jest.spyOn(secretKey, 'load')
      secretKey.load({context, encoded: secretKeyBase64})
      expect(spyLoadSecretKey).toHaveBeenCalled()

      const spyLoadPublicKey = jest.spyOn(publicKey, 'load')
      publicKey.load({context, encoded: publicKeyBase64})
      expect(spyLoadPublicKey).toHaveBeenCalled()
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

genTests('keypair')
