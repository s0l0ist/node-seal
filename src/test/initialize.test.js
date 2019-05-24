describe('Initializing library for all Scheme Types', () => {

  describe('BFV Scheme', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

  describe('CKKS Scheme', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

})
