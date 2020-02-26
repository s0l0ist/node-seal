describe('relinkey on CKKS', () => {
  describe('polyModulusDegree 16384', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.CKKS
      const securityLevel = Morfix.SecurityLevel.tc256
      const polyModulusDegree = 16384
      const bitSizes = [47,47,47,48,48]
      
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
