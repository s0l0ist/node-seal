describe('Manual encryption on CKKS Scheme', () => {
  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const {Seal} = require('../../index.js')
      const Morfix = await Seal

      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 4096
      })

      // Create a suitable vector of CoeffModulus primes
      const bitSizesVector = Morfix.Vector({
        array: new Int32Array([46, 16, 46])
      })
      const coeffModulusVector = Morfix.CoeffModulus.Create({
        polyModulusDegree: 4096,
        bitSizes: bitSizesVector,
        securityLevel: Morfix.SecurityLevel.tc192
      })

      parms.setCoeffModulus({
        coeffModulus: coeffModulusVector
      })


      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc192
      })

      // TC192 is not compatible with the bitSizes we have chosen.
      // This will cause SEAL to prevent parameters from being set in the
      // context.
      expect(context.parametersSet()).toBe(false)
    })
  })
})
