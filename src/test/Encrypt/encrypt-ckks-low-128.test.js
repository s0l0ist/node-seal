describe('Encryption on CKKS Scheme', () => {
  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 128})

      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt.__Context.parametersSet()).toBe(true)

      // Gen Keys
      const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spyGenKeys).toHaveBeenCalled()

      // Create data to be encrypted
      const step = Math.pow(2, 32) / (parms.polyModulusDegree / 2)
      const array = Float64Array.from({length: parms.polyModulusDegree / 2})
        .map((x, i) =>  (i * step))

      // Encrypt
      const cipherText = Crypt.encrypt({array})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)

      // Decrypt
      const decryptedArray = Crypt.decrypt({cipherText})
      expect(decryptedArray).toBeInstanceOf(Float64Array)

      // Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.
      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decryptedArray.map(x => 0 + Math.round(x))

      expect(approxDecrypted).toEqual(approxValues)
    })
  })
})
