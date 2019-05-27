describe.skip('Generate GaloisKeys', () => {

  describe('BFV genGaloisKeys', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      const spy = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genKeys()
      Crypt.genGaloisKeys()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('CKKS genGaloisKeys', () => {
    test('low', async () => {
      const { HCrypt } = require('../index.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      const spy = jest.spyOn(Crypt, 'genGaloisKeys')
      Crypt.genKeys()
      Crypt.genGaloisKeys()
      expect(spy).toHaveBeenCalled()
    })
  })
})
