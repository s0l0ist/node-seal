describe('relinkey on BFV', () => {
  describe('polyModulusDegree 8192', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.BFV
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 8192
      })
        
      // Create a suitable vector of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 8192,
          bitSizes: Morfix.Vector({array: new Int32Array([43,43,44,44,44]) }),
          securityLevel: Morfix.SecurityLevel.tc128
        })
      })
      
      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: 8192,
          bitSize: 20
        })
      })
      
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc128
      })

      expect(context.parametersSet()).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context: context
      })
      
      expect(context.parametersSet()).toBe(true)

      const spyGenRelinKeys = jest.spyOn(keyGenerator, 'genRelinKeys')
      const relinKeys = keyGenerator.genRelinKeys()
      expect(spyGenRelinKeys).toHaveBeenCalled()
      
      const spySaveRelinKeys = jest.spyOn(relinKeys, 'save')
      const base64 = relinKeys.save()
      expect(spySaveRelinKeys).toHaveBeenCalled()
      
      const spyLoadRelinKeys = jest.spyOn(relinKeys, 'load')
      relinKeys.load({context, encoded: base64})
      expect(spyLoadRelinKeys).toHaveBeenCalled()
    })
  })
})