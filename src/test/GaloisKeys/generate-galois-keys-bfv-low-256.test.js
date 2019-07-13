describe('Generate GaloisKeys BFV Scheme', () => {
  describe('computationLevel low', () => {
    test('256-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 256})

      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt.__Context.parametersSet()).toBe(true)

      // Gen Galois Keys
      const spyGenGaloisKeys = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genGaloisKeys()
      expect(spyGenGaloisKeys).toHaveBeenCalled()

      // // Save / Load keys
      // const spySaveGaloisKeys = jest.spyOn(Crypt, 'saveGaloisKeys')
      // const galoisKeys = Crypt.saveGaloisKeys()
      // expect(spySaveGaloisKeys).toHaveBeenCalled()
      //
      // const spyLoadGaloisKeys = jest.spyOn(Crypt, 'loadGaloisKeys')
      // Crypt.loadGaloisKeys({encoded: galoisKeys})
      // expect(spyLoadGaloisKeys).toHaveBeenCalled()
    })
  })
})
