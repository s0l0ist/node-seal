describe('Generate RelinKeys CKKS Scheme', () => {
  describe('computationLevel low', () => {
    test('256-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 256})
      expect(parms).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 4),
        security: 256
      })
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // Gen Keys
      const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spyGenKeys).toHaveBeenCalled()

      // Gen Relin Keys
      const spyGenRelinKeys = jest.spyOn(Crypt, 'genRelinKeys')
      Crypt.genRelinKeys()
      expect(spyGenRelinKeys).toHaveBeenCalled()

      // Save / Load keys
      const spySaveRelinKeys = jest.spyOn(Crypt, 'saveRelinKeys')
      const relinKeys = Crypt.saveRelinKeys()
      expect(spySaveRelinKeys).toHaveBeenCalled()

      const spyLoadRelinKeys = jest.spyOn(Crypt, 'loadRelinKeys')
      Crypt.loadRelinKeys({encoded: relinKeys})
      expect(spyLoadRelinKeys).toHaveBeenCalled()
    })
  })
})
