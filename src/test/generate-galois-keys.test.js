describe.skip('Generate GaloisKeys', () => {

  describe('BFV genGaloisKeys', () => {
    test('low', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
      const Crypt = await HCrypt
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
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genKeys()
      Crypt.genGaloisKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
