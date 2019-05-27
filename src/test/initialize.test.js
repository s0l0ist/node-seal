describe('Initializing library for all Scheme Types', () => {

  describe('BFV Scheme', () => {
    test('low', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

  describe('CKKS Scheme', () => {
    test('low', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

})
