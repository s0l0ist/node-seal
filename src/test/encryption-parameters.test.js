describe('Creating Encryption Parameters', () => {
  test('low', async () => {
    const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
    const Crypt = await HCrypt
    const parms = Crypt.createParams({security: 'low'})
    expect(parms).toEqual({
      polyDegree: 4096,
      coeffModulus: 4096,
      plainModulus: 786433,
      scale: Math.pow(2, 54)
    })
  })
})
