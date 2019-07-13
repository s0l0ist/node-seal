describe('Generate Keys BFV Scheme', () => {
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

      // Save / Load keys
      const spySavePublicKey = jest.spyOn(Crypt, 'savePublicKey')
      const publicKey = Crypt.savePublicKey()
      expect(spySavePublicKey).toHaveBeenCalled()

      const spySaveSecretKey = jest.spyOn(Crypt, 'saveSecretKey')
      const secretKey = Crypt.saveSecretKey()
      expect(spySaveSecretKey).toHaveBeenCalled()


      const spyLoadPublicKey = jest.spyOn(Crypt, 'loadPublicKey')
      Crypt.loadPublicKey({encoded: publicKey})
      expect(spyLoadPublicKey).toHaveBeenCalled()

      const spyLoadSecretKey = jest.spyOn(Crypt, 'loadSecretKey')
      Crypt.loadSecretKey({encoded: secretKey})
      expect(spyLoadSecretKey).toHaveBeenCalled()
    })
  })
})
