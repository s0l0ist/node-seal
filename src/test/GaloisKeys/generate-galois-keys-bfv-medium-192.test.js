describe('Generate GaloisKeys BFV Scheme', () => {
  describe('computationLevel medium', () => {
    test('192-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'medium', security: 192})
      expect(parms).toEqual({
        polyDegree: 8192,
        coeffModulus: 8192,
        plainModulus: 786433,
        scale: Math.pow(2, 98),
        security: 192
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
