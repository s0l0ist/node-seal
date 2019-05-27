describe('Encrypt BFV', () => {

  describe('Int32', () => {
    test('Valid range', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      Crypt.genKeys()

      const step = parms.plainModulus / parms.polyDegree
      const value = Array.from({length: parms.polyDegree}).map(
        (x, i) =>  {
          if (i >= (parms.polyDegree / 2)) {
            return Math.floor((parms.plainModulus - (step * i)))
          }
          return  Math.ceil(-(step + (step * i)))
        })

      const cipherText = Crypt.encrypt({value, type: 'int32'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      Crypt.genKeys()

      const step = parms.plainModulus / parms.polyDegree
      const value = Array.from({length: parms.polyDegree}).map(
        (x, i) =>  {
          if (i >= (parms.polyDegree / 2)) {
            return Math.ceil((parms.plainModulus - (step * i)))
          }
          return  Math.floor(-(step + (step * i)))
        })
      expect(() => {
        Crypt.encrypt({value, type: 'int32'})
      }).toThrow('Array element out of range: -1/2 * `plainModulus` <-> +1/2 * `plainModulus`')
    })
  })

  describe('UInt32', () => {
    test('Valid range', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      Crypt.genKeys()

      const step = parms.plainModulus / parms.polyDegree
      const value = Array.from({length: parms.polyDegree})
        .map((x, i) =>  Math.floor(step * i))
      const cipherText = Crypt.encrypt({value, type: 'uint32'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { HCrypt } = process.env.NODE_ENV === 'development'? require('../index.js') : require('../../dist/hcrypt.node.js')
      const Crypt = await HCrypt
      const parms = Crypt.createParams({computationLevel: 'low'})
      Crypt.initialize({...parms, schemeType: 'BFV'})
      Crypt.genKeys()

      const step = parms.plainModulus / parms.polyDegree
      const value = Array.from({length: parms.polyDegree})
        .map((x, i) =>  -Math.floor(step * i))
      expect(() => {
        Crypt.encrypt({value, type: 'uint32'})
      }).toThrow('Array element out of range: 0 <-> `plainModulus`')
    })
  })
})
