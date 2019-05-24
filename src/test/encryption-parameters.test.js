describe('Creating Encryption Parameters', () => {
  test('low', async () => {
    const { Module } = require('../../src')
    const Crypt = await Module
    const parms = Crypt.createParams({security: 'low'})
    expect(parms).toEqual({
      polyDegree: 4096,
      coeffModulus: 4096,
      plainModulus: 786433,
      scale: Math.pow(2, 54)
    })
  })
})
