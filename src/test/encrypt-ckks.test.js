describe('Encrypt CKKS', () => {

  describe('Double', () => {
    test('Valid range', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal

      // Create parameters
      const parms = Crypt.createParams({computationLevel: 'low'})
      expect(parms).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 54),
        security: 128
      })

      // Initialize
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // GenKeys
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()

      // Create data to be encrypted
      const step = Math.pow(2, 53) / (parms.polyDegree / 2)
      const value = Float64Array.from({length: parms.polyDegree / 2})
        .map((x, i) =>  Math.floor(( i * step)))


      // Encrypt
      const cipherText = Crypt.encrypt({value, type: 'double'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { Seal } = require('../index.js')
      const Crypt = await Seal

      // Create parameters
      const parms = Crypt.createParams({computationLevel: 'low'})
      expect(parms).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 54),
        security: 128
      })

      // Initialize
      Crypt.initialize({...parms, schemeType: 'CKKS'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // GenKeys
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()

      // Create data to be encrypted
      const step = Math.pow(2, 53) / (parms.polyDegree / 2)
      const value = Float64Array.from({length: parms.polyDegree / 2})
        .map((x, i) =>  Math.floor(( 2 * i * step)))

      // Encrypt
      expect(() => {
        Crypt.encrypt({value, type: 'double'})
      }).toThrow(`Cannot encrypt elements with values greater than 'Number.MAX_SAFE_INTEGER' (${Number.MAX_SAFE_INTEGER})`)
    })
  })
})
