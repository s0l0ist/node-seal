describe('encrypt on CKKS', () => {
  describe('polyModulusDegree 32768', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 32768
      })

      // Create a suitable set of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 32768,
          bitSizes: Int32Array.from([55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,56])
        })
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc128
      })

      expect(context.parametersSet).toBe(true)

      const encoder = Morfix.CKKSEncoder({
        context: context
      })

      const keyGenerator = Morfix.KeyGenerator({
        context: context
      })

      const publicKey = keyGenerator.getPublicKey()
      const secretKey = keyGenerator.getSecretKey()
      const encryptor = Morfix.Encryptor({
        context: context,
        publicKey: publicKey
      })
      const decryptor = Morfix.Decryptor({
        context: context,
        secretKey: secretKey
      })

      // Create data to be encrypted
      const array = Float64Array.from({
        length: 16384
      }).map((x, i) =>  i)

      // Create a plainText variable and encode the vector to it
      const plainText = Morfix.PlainText()

      encoder.encode({
        array,
        scale: Math.pow(2, 55),
        plainText
      })

      // Create a cipherText variable and encrypt the plainText to it
      const cipherText = Morfix.CipherText()
      encryptor.encrypt({
        plainText,
        cipherText
      })

      // Create a new plainText variable to store the decrypted cipherText
      const decryptedPlainText = Morfix.PlainText()
      decryptor.decrypt({
        cipherText,
        plainText: decryptedPlainText
      })

      // Decode the PlainText
      const decodedArray = encoder.decode({
        plainText: decryptedPlainText
      })

      expect(decodedArray).toBeInstanceOf(Float64Array)
      // Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.
      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decodedArray.map(x => 0 + Math.round(x))
      // Check values
      expect(approxDecrypted).toEqual(approxValues)

    })
  })
})
