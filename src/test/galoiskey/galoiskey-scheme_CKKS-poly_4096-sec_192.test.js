describe('galoiskey on CKKS', () => {
  describe('polyModulusDegree 4096', () => {
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 4096
      })
        
      // Create a suitable vector of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 4096,
          bitSizes: Morfix.Vector({array: new Int32Array([29,16,29]) }),
          securityLevel: Morfix.SecurityLevel.tc192
        })
      })
      
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc192
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