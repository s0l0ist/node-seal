describe('Encryption on BFV Scheme', () => {
  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 128})
      expect(parms).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 54),
        security: 128
      })
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // Gen Keys
      const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spyGenKeys).toHaveBeenCalled()

      // Create data to be encrypted
      const step = parms.plainModulus / parms.polyDegree
      const value = Int32Array.from({length: parms.polyDegree}).map(
        (x, i) =>  {
          if (i >= (parms.polyDegree / 2)) {
            return Math.floor((parms.plainModulus - (step * i)))
          }
          return  Math.ceil(-(step + (step * i)))
        })

      // Encrypt
      const cipherText = Crypt.encrypt({value, type: 'int32'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)

      // Decrypt
      const decryptedArray = Crypt.decrypt({cipherText})
      expect(decryptedArray).toBeInstanceOf(Int32Array)

      // Check values
      expect(decryptedArray).toEqual(value)
    })
  })
})
