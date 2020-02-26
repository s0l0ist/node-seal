describe('encrypt on BFV', () => {
  describe('polyModulusDegree 4096', () => {
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.BFV
      const securityLevel = Morfix.SecurityLevel.tc192
      const polyModulusDegree = 4096
      const bitSizes = [25,25,25]
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

      const encoder = Morfix.BatchEncoder(context)
      const keyGenerator = Morfix.KeyGenerator(context)
      const publicKey = keyGenerator.getPublicKey()
      const secretKey = keyGenerator.getSecretKey()
      const encryptor = Morfix.Encryptor(context, publicKey)
      const decryptor = Morfix.Decryptor(context, secretKey)

      // Create data to be encrypted
      const array = Uint32Array.from({
        length: 4096
      }).map((x, i) =>  i)

      // Encode the Array
      const plainText = encoder.encode(
        array
      )

      // Encrypt the PlainText
      const cipherText = encryptor.encrypt(plainText)

      // Decrypt the CipherText
      const decryptedPlainText = decryptor.decrypt(cipherText)

      // Decode the PlainText
      const decodedArray = encoder.decode(decryptedPlainText,
        false)

      expect(decodedArray).toBeInstanceOf(Uint32Array)
      // Check values
      expect(decodedArray).toEqual(array)
    })
  })
})
