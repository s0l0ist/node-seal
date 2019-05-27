describe.skip('Generate RelinKeys', () => {

  describe('BFV genRelinKeys', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genRelinKeys')
      Crypt.genKeys()
      Crypt.genRelinKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS genRelinKeys', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genRelinKeys')
      Crypt.genKeys()
      Crypt.genRelinKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
