describe('Generate RelinKeys BFV Scheme', () => {
  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 128})

      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt.__Context.parametersSet()).toBe(true)

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
