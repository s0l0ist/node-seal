describe('Encrypt CKKS', () => {

  describe('Double', () => {
    test('Valid range', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../../index.js') : require('../../dist/bundle.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      Crypt.genKeys()

      const step = Math.pow(2, 53) / (parms.polyDegree / 2)
      const value = Array.from({length: parms.polyDegree / 2})
        .map((x, i) =>  Math.floor(( i * step)))

      const cipherText = Crypt.encrypt({value, type: 'double'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../../index.js') : require('../../dist/bundle.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({security: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      Crypt.genKeys()

      const step = Math.pow(2, 53) / (parms.polyDegree / 2)

      const value = Array.from({length: parms.polyDegree / 2})
        .map((x, i) =>  Math.floor(( 2 * i * step)))
      expect(() => {
        Crypt.encrypt({value, type: 'double'})
      }).toThrow('Array element out of range: -2^53 <-> +2^53')
    })
  })
})
