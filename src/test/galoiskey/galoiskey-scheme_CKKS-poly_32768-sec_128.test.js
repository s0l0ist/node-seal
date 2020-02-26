describe.skip('galoiskey on CKKS', () => {
  describe('polyModulusDegree 32768', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.CKKS
      const securityLevel = Morfix.SecurityLevel.tc128
      const polyModulusDegree = 32768
      const bitSizes = [55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,56]
      
      const parms = Morfix.EncryptionParameters(schemeType)

      parms.setPolyModulusDegree(polyModulusDegree)
      
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus(
        Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)) 
      )

      const context = Morfix.Context(
        parms,
        true,
        securityLevel
      )

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator(context)

      const spyGenGaloisKeys = jest.spyOn(keyGenerator, 'genGaloisKeys')
      const galoisKeys = keyGenerator.genGaloisKeys()
      expect(spyGenGaloisKeys).toHaveBeenCalled()

      const spySaveGaloisKeys = jest.spyOn(galoisKeys, 'save')
      const base64 = galoisKeys.save()
      expect(spySaveGaloisKeys).toHaveBeenCalled()

      const spyLoadGaloisKeys = jest.spyOn(galoisKeys, 'load')
      galoisKeys.load(context, base64)
      expect(spyLoadGaloisKeys).toHaveBeenCalled()
    })
  })
})
