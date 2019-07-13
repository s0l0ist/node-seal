describe('Initializing library for BFV Scheme', () => {
  describe('computationLevel high', () => {
    test('192-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'high', security: 192})

      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt.__Context.parametersSet()).toBe(true)
    })
  })
})
