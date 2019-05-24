describe('Generate GaloisKeys', () => {

  describe('BFV genGaloisKeys', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genKeys()
      Crypt.genGaloisKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS genGaloisKeys', () => {
    test('low', async () => {
      const { Module } = require('../../src')
      const Crypt = await Module
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genKeys()
      Crypt.genGaloisKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
