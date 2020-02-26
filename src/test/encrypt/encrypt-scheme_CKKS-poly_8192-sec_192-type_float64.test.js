describe('encrypt on CKKS', () => {
  describe('polyModulusDegree 8192', () => {
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.CKKS
      const securityLevel = Morfix.SecurityLevel.tc192
      const polyModulusDegree = 8192
      const bitSizes = [38,38,38,38]

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

      const encoder = Morfix.CKKSEncoder(context)
      const keyGenerator = Morfix.KeyGenerator(context)
      const publicKey = keyGenerator.getPublicKey()
      const secretKey = keyGenerator.getSecretKey()
      const encryptor = Morfix.Encryptor(context, publicKey)
      const decryptor = Morfix.Decryptor(context, secretKey)

      // Create data to be encrypted
      const array = Float64Array.from({
        length: 4096
      }).map((x, i) =>  i)

      // Encode the Array
      const plainText = encoder.encode(
        array,
        Math.pow(2, 20)
      )

      // Encrypt the PlainText
      const cipherText = encryptor.encrypt(plainText)

      // Decrypt the CipherText
      const decryptedPlainText = decryptor.decrypt(cipherText)

      // Decode the PlainText
      const decodedArray = encoder.decode(decryptedPlainText)

      expect(decodedArray).toBeInstanceOf(Float64Array)
      // Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.
      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decodedArray.map(x => 0 + Math.round(x))
      // Check values
      expect(approxDecrypted).toEqual(approxValues)
    })
  })
})
