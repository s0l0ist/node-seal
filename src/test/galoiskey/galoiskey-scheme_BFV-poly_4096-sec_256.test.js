describe.skip('galoiskey on BFV', () => {
  describe('polyModulusDegree 4096', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.BFV
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 4096
      })

      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 4096,
          bitSizes: Int32Array.from([58])
        })
      })

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: 4096,
          bitSize: 20
        })
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc256
      })

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context
      })

      const spyGenGaloisKeys = jest.spyOn(keyGenerator, 'genGaloisKeys')
      const galoisKeys = keyGenerator.genGaloisKeys()
      expect(spyGenGaloisKeys).toHaveBeenCalled()

      const spySaveGaloisKeys = jest.spyOn(galoisKeys, 'save')
      const base64 = galoisKeys.save()
      expect(spySaveGaloisKeys).toHaveBeenCalled()

      const spyLoadGaloisKeys = jest.spyOn(galoisKeys, 'load')
      galoisKeys.load({context, encoded: base64})
      expect(spyLoadGaloisKeys).toHaveBeenCalled()
    })
  })
})
