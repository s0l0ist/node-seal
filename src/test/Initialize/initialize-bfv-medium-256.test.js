describe('Initializing library for BFV Scheme', () => {
  describe('computationLevel medium', () => {
    test('256-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'medium', security: 256})

      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt.__Context.parametersSet()).toBe(true)
    })
  })
})
