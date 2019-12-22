describe.skip('encrypt on CKKS', () => {
  describe('polyModulusDegree 4096', () => {
    test('256-bit security', async () => {
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
          bitSizes: Morfix.Vector({array: new Int32Array([58]) }),
          securityLevel: Morfix.SecurityLevel.tc256
        })
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc256
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
        length: 2048
      }).map((x, i) =>  i)

      // Convert data to a c++ 'vector'
      const vector = Morfix.Vector({array})

      // Create a plainText variable and encode the vector to it
      const plainText = Morfix.PlainText()

      encoder.encodeVectorDouble({
        vector: vector,
        scale: Math.pow(2, 58),
        plainText: plainText
      })

      // Create a cipherText variable and encrypt the plainText to it
      const cipherText = Morfix.CipherText()
      encryptor.encrypt({
        plainText: plainText,
        cipherText: cipherText
      })

      // Create a new plainText variable to store the decrypted cipherText
      const decryptedPlainText = Morfix.PlainText()
      decryptor.decrypt({
        cipherText: cipherText,
        plainText: decryptedPlainText
      })

      // Create a c++ vector to store the decoded result
      const decodeVector = Morfix.Vector({array: new Float64Array() })

      // Decode the PlainText to the c++ vector
      encoder.decodeVectorDouble({
        plainText: decryptedPlainText,
        vector: decodeVector
      })

      // Convert the vector to a JS array
      const decryptedArray = decodeVector.toArray()

      expect(decryptedArray).toBeInstanceOf(Float64Array)

      // Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.
      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decryptedArray.map(x => 0 + Math.round(x))
      // Check values
      expect(approxDecrypted).toEqual(approxValues)

    })
  })
})
