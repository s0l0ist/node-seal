describe('Encrypt CKKS', () => {

  describe('Double', () => {
    test('Valid range', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      Crypt.genKeys()

      const step = Math.pow(2, 53) / (parms.polyDegree / 2)
      const value = Array.from({length: parms.polyDegree / 2})
        .map((x, i) =>  Math.floor(( i * step)))

      const cipherText = Crypt.encrypt({value, type: 'double'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low'})
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
