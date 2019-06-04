describe.skip('Encrypt BFV', () => {

  describe('Int32', () => {
    test('Valid range', async () => {
      const { Seal } = require('../src')
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
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // GenKeys
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()

      // Create data to be encrypted
      const step = parms.plainModulus / parms.polyDegree
      const value = Int32Array.from({length: parms.polyDegree}).map(
        (x, i) =>  {
          if (i >= (parms.polyDegree / 2)) {
            return Math.floor((parms.plainModulus - (step * i)))
          }
          return  Math.ceil(-(step + (step * i)))
        })

      // Encrypt
      const cipherText = Crypt.encrypt({value, type: 'int32'})
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { Seal } = require('../src')
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
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // GenKeys
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()

      // Create data to be encrypted
      const step = parms.plainModulus / parms.polyDegree
      const value = Int32Array.from({length: parms.polyDegree}).map(
        (x, i) =>  {
          if (i >= (parms.polyDegree / 2)) {
            return Math.ceil((parms.plainModulus - (step * i)))
          }
          return  Math.floor(-(step + (step * i)))
        })

      // Encrypt
      expect(() => {
        Crypt.encrypt({value, type: 'int32'})
      }).toThrow(`Array element out of range: -1/2 * 'plainModulus' (${parms.plainModulus}) <-> +1/2 * 'plainModulus' (${parms.plainModulus})`)
    })
  })

  describe('UInt32', () => {
    test('Valid range', async () => {
      const { Seal } = require('../src')
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
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // GenKeys
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()

      // Create data to be encrypted
      const step = parms.plainModulus / parms.polyDegree
      const value = Uint32Array.from({length: parms.polyDegree})
        .map((x, i) =>  Math.floor(step * i))
      const cipherText = Crypt.encrypt({value, type: 'uint32'})

      // Encrypt
      expect(cipherText).toBeInstanceOf(Crypt._CipherText)
    })

    test('Invalid range', async () => {
      const { Seal } = require('../src')
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
      Crypt.initialize({...parms, schemeType: 'BFV'})
      expect(Crypt._Context.parametersSet()).toBe(true)

      // GenKeys
      const spy = jest.spyOn(Crypt, 'genKeys')
      Crypt.genKeys()
      expect(spy).toHaveBeenCalled()

      // Create data to be encrypted
      const step = parms.plainModulus / parms.polyDegree
      const value = Uint32Array.from({length: parms.polyDegree})
        .map((x, i) =>  -Math.floor(step * i))

      // Encrypt
      expect(() => {
        Crypt.encrypt({value, type: 'uint32'})
      }).toThrow(`Array element out of range: 0 <-> 'plainModulus' (${parms.plainModulus})`)
    })
  })
})
