describe('galoiskey on CKKS', () => {
  describe('polyModulusDegree 8192', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 8192
      })
        
      // Create a suitable vector of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 8192,
          bitSizes: Morfix.Vector({array: new Int32Array([39,20,20,39]) }),
          securityLevel: Morfix.SecurityLevel.tc256
        })
      })
      
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc256
      })

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context: context
      })
      
      expect(context.parametersSet).toBe(true)

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