describe('keypair on BFV', () => {
  describe('polyModulusDegree 16384', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.BFV
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 16384
      })
        
      // Create a suitable vector of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 16384,
          bitSizes: Morfix.Vector({array: new Int32Array([48,48,48,49,49,49,49,49,49]) }),
          securityLevel: Morfix.SecurityLevel.tc128
        })
      })
      
      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: 16384,
          bitSize: 20
        })
      })
      
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc128
      })

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context: context
      })
      
      expect(context.parametersSet).toBe(true)

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