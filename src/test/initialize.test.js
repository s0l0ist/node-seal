describe('Initializing library for all Scheme Types', () => {

  describe('BFV Scheme', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

  describe('CKKS Scheme', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

})
