describe.skip('keypair on BFV', () => {
  describe('polyModulusDegree 4096', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.BFV
      const securityLevel = Morfix.SecurityLevel.tc256
      const polyModulusDegree = 4096
      const bitSizes = [58]
      const bitSize = 20
      
      const parms = Morfix.EncryptionParameters(schemeType)

      parms.setPolyModulusDegree(polyModulusDegree)
      
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus(
        Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)) 
      )

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus(
        Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
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
