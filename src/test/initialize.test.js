describe('Initializing library for all Scheme Types', () => {

  describe('BFV Scheme', () => {
    test('low', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../../index.js') : require('../../dist/bundle.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

  describe('CKKS Scheme', () => {
    test('low', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../../index.js') : require('../../dist/bundle.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)
    })
  })

})
