describe('Generate GaloisKeys BFV Scheme', () => {
  describe('computationLevel high', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'high', security: 128})
      expect(parms).toEqual({
        polyDegree: 16384,
        coeffModulus: 16384,
        plainModulus: 786433,
        scale: Math.pow(2, 384),
        security: 128
      })
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // Gen Keys
      const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spyGenKeys).toHaveBeenCalled()

      // Gen Galois Keys
      const spyGenGaloisKeys = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genGaloisKeys()
      expect(spyGenGaloisKeys).toHaveBeenCalled()

      // Save / Load keys
      const spySaveGaloisKeys = jest.spyOn(Crypt, 'saveGaloisKeys')
      const galoisKeys = Crypt.saveGaloisKeys()
      expect(spySaveGaloisKeys).toHaveBeenCalled()

      const spyLoadGaloisKeys = jest.spyOn(Crypt, 'loadGaloisKeys')
      Crypt.loadGaloisKeys({encoded: galoisKeys})
      expect(spyLoadGaloisKeys).toHaveBeenCalled()
    })
  })
})
