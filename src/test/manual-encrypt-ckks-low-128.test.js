describe('Manual encryption on CKKS Scheme', () => {
  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../index.js')
      const Morfix = await Seal

      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 4096
      })

      // Create a suitable vector of CoeffModulus primes
      const bitSizesVector = Morfix.Vector({
        array: new Int32Array([46, 16, 46])
      })
      const coeffModulusVector = Morfix.CoeffModulus.Create({
        polyModulusDegree: 4096,
        bitSizes: bitSizesVector,
        securityLevel: Morfix.SecurityLevel.tc128
      })

      parms.setCoeffModulus({
        coeffModulus: coeffModulusVector
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc128
      })

      expect(context.parametersSet()).toBe(true)

      const ckksEncoder = Morfix.CKKSEncoder({
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
      const evaluator = Morfix.Evaluator({
        context: context
      })

      // Create data to be encrypted
      const step = Math.pow(2, 32) / (parms.polyModulusDegree / 2)
      const array = Float64Array.from({length: parms.polyModulusDegree / 2})
        .map((x, i) =>  (i * step))


      // Convert data to a c++ 'vector'
      const vector = Morfix.Vector({array})

      // Create a plainText variable and encode the vector to it
      const plainText = Morfix.PlainText()
      ckksEncoder.encodeVectorDouble({
        vector: vector,
        scale: Math.pow(2, 16),
        plainText: plainText
      })

      // Create a cipherText variable and encrypt the plainText to it
      const cipherText = Morfix.CipherText()
      cipherText.setVectorType({type: vector.type})
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
      const decodeVector = Morfix.Vector({array: new (cipherText.getVectorType())})

      // Decode the plaintext to the c++ vector
      ckksEncoder.decodeVectorDouble({
        plainText: decryptedPlainText,
        vector: decodeVector
      })

      // Convert the vector to a JS array
      const decryptedArray = decodeVector.toArray()

      expect(decryptedArray).toBeInstanceOf(Float64Array)

      // Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.

      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decryptedArray.map(x => 0 + Math.round(x))

      expect(approxDecrypted).toEqual(approxValues)
    })
  })
})
