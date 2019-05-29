describe('Generate RelinKeys BFV Scheme', () => {
  describe('computationLevel medium', () => {
    test('256-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'medium', security: 256})
      expect(parms).toEqual({
        polyDegree: 8192,
        coeffModulus: 8192,
        plainModulus: 786433,
        scale: Math.pow(2, 64),
        security: 256
      })
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // Gen Relin Keys
      const spyGenRelinKeys = jest.spyOn(Crypt, 'genRelinKeys')
      Crypt.genRelinKeys()
      expect(spyGenRelinKeys).toHaveBeenCalled()

      // // Save / Load keys
      // const spySaveRelinKeys = jest.spyOn(Crypt, 'saveRelinKeys')
      // const relinKeys = Crypt.saveRelinKeys()
      // expect(spySaveRelinKeys).toHaveBeenCalled()
      //
      // const spyLoadRelinKeys = jest.spyOn(Crypt, 'loadRelinKeys')
      // Crypt.loadRelinKeys({encoded: relinKeys})
      // expect(spyLoadRelinKeys).toHaveBeenCalled()
    })
  })
})
