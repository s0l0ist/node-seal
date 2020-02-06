describe('keypair on BFV', () => {
  describe('polyModulusDegree 32768', () => {
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.BFV
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 32768
      })

      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 32768,
          bitSizes: Int32Array.from([54,54,54,54,54,55,55,55,55,55,55])
        })
      })

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: 32768,
          bitSize: 20
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