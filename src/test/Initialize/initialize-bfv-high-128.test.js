describe('Initializing library for BFV Scheme', () => {
  describe('computationLevel high', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'high', security: 128})

      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt.__Context.parametersSet()).toBe(true)
    })
  })
})
