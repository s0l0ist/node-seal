describe('Generate Key Pairs', () => {

  describe('BFV KeyGen', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS KeyGen', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
