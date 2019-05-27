describe('Generate Key Pairs', () => {

  describe('BFV KeyGen', () => {
    test('low', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS KeyGen', () => {
    test('low', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
