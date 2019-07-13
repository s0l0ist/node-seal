describe('Encryption on BFV Scheme', () => {
  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 128})

      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt.__Context.parametersSet()).toBe(true)

      // Gen Keys
      const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spyGenKeys).toHaveBeenCalled()

      // Create data to be encrypted
      const step = parms.plainModulus.value() / parms.polyModulusDegree
      const array = Int32Array.from({length: parms.polyModulusDegree}).map(
        (x, i) =>  {
          if (i >= (parms.polyModulusDegree / 2)) {
            return Math.floor((parms.plainModulus.value() - (step * i)))
          }
          return  Math.ceil(-(step + (step * i)))
        })

      // Encrypt
      const cipherText = Crypt.encrypt({array})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)

      // Decrypt
      const decryptedArray = Crypt.decrypt({cipherText})
      expect(decryptedArray).toBeInstanceOf(Int32Array)

      // Check values
      expect(decryptedArray).toEqual(array)
    })
  })
})
