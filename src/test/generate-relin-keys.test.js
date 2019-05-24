describe.skip('Generate RelinKeys', () => {

  describe('BFV genRelinKeys', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genRelinKeys')
      Crypt.genKeys()
      Crypt.genRelinKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS genRelinKeys', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genRelinKeys')
      Crypt.genKeys()
      Crypt.genRelinKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
