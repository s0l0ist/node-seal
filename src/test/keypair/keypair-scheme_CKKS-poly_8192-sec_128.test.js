describe('keypair on CKKS', () => {
  describe('polyModulusDegree 8192', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.CKKS
      const securityLevel = Morfix.SecurityLevel.tc128
      const polyModulusDegree = 8192
      const bitSizes = [43,43,44,44,44]
      
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
      secretKey.load(context, secretKeyBase64)
      expect(spyLoadSecretKey).toHaveBeenCalled()

      const spyLoadPublicKey = jest.spyOn(publicKey, 'load')
      publicKey.load(context, publicKeyBase64)
      expect(spyLoadPublicKey).toHaveBeenCalled()
    })
  })
})
