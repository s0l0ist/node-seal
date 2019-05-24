describe('Generate Key Pairs', () => {

  describe('BFV KeyGen', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS KeyGen', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
