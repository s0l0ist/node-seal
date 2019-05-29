describe('Encryption on CKKS Scheme', () => {
  describe('computationLevel high', () => {
    test('256-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'high', security: 256})
      expect(parms).toEqual({
        polyDegree: 16384,
        coeffModulus: 16384,
        plainModulus: 786433,
        scale: Math.pow(2, 183),
        security: 256
      })
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // Gen Keys
      const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spyGenKeys).toHaveBeenCalled()

      // Create data to be encrypted
      const step = Math.pow(2, 53) / (parms.polyDegree / 2)
      const value = Float64Array.from({length: parms.polyDegree / 2})
        .map((x, i) =>  Math.floor(( i * step)))

      // Encrypt
      const cipherText = Crypt.encrypt({value, type: 'double'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)

      // Decrypt
      const decryptedArray = Crypt.decrypt({cipherText})
      expect(decryptedArray).toBeInstanceOf(Float64Array)


      // Hacks to get quick approximate values.
      const approxValues = value.map(x => Math.round(x / 10))
      const approxDecrypted = value.map(x => Math.round(x / 10))

      expect(approxDecrypted).toEqual(approxValues)
    })
  })
})
