describe('relinkey on CKKS', () => {
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

      // Create a suitable set of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 4096,
          bitSizes: Int32Array.from([29,16,29])
        })
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc192
      })

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context
      })

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
