describe('Evaluation on BFV Scheme', () => {
  describe('computationLevel high', () => {
    describe('128-bit security', () => {
      test.skip('multiply signed', async () => {
        const {Seal} = require('../../../index.js')
        const Crypt = await Seal
        const parms = Crypt.createParams({computationLevel: 'high', security: 128})
        expect(parms).toEqual({
          polyDegree: 16384,
          coeffModulus: 16384,
          plainModulus: 786433,
          scale: Math.pow(2, 384),
          security: 128
        })
        Crypt.initialize({...parms, schemeType: 'BFV'})
        expect(Crypt._Context.parametersSet()).toBe(true)

        // Gen Keys
        const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
        Crypt.genKeys()
        expect(spyGenKeys).toHaveBeenCalled()

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
        const cipherText = Crypt.encrypt({value})
        const cipherText2 = Crypt.encrypt({value})
        expect(cipherText).toBeInstanceOf(Crypt._CipherText)
        expect(cipherText2).toBeInstanceOf(Crypt._CipherText)

        // Evaluate
        const resultCipher = Crypt.multiply({a: cipherText, b: cipherText2})

        // Decrypt
        const decryptedResult = Crypt.decrypt({cipherText: resultCipher})
        expect(decryptedResult).toBeInstanceOf(Int32Array)

        /* Signed test max values are (+- 1/2 * plainModulus) */
        const Simulator = require('../../../classes/simulator')
        const sim = new Simulator({maxValue: Math.floor(parms.plainModulus / 2), signed: true})
        expect(sim).toBeInstanceOf(Simulator)

        // Create an array of binary strings. We use binary comparison because the values computed
        // are bound to a specific bit length and JS doesn't know how to properly convert them.
        // Ex. A negative 19-bit number will be translated to a positive JS Number,
        // because JS doesn't know how to treat the 19-bit sign bit.
        const plainResStrings = Array.from({length: value.length})
        value.forEach((x,i) => {
          plainResStrings[i] = sim.multiply(x, x)
        })

        // Convert decrypted results to new array of binary strings
        const decryptedResStrings = []
        decryptedResult.forEach((x, i)=> {
          decryptedResStrings[i] = sim.convertNumberToBinaryString(x)
        })
        expect(decryptedResStrings).toEqual(plainResStrings)
      })

      test.skip('multiply unsigned', async () => {
        const {Seal} = require('../../../index.js')
        const Crypt = await Seal

        const parms = Crypt.createParams({computationLevel: 'high', security: 128})
        expect(parms).toEqual({
          polyDegree: 16384,
          coeffModulus: 16384,
          plainModulus: 786433,
          scale: Math.pow(2, 384),
          security: 128
        })
        Crypt.initialize({...parms, schemeType: 'BFV'})
        expect(Crypt._Context.parametersSet()).toBe(true)

        // Gen Keys
        const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
        Crypt.genKeys()
        expect(spyGenKeys).toHaveBeenCalled()

        // Create data to be encrypted
        const step = Math.floor(parms.plainModulus / parms.polyDegree)
        const value = Uint32Array.from({length: parms.polyDegree}).map(
          (x, i) =>  {
            return i * step
          })

        // Encrypt
        const cipherText = Crypt.encrypt({value})
        const cipherText2 = Crypt.encrypt({value})
        expect(cipherText).toBeInstanceOf(Crypt._CipherText)
        expect(cipherText2).toBeInstanceOf(Crypt._CipherText)

        // Evaluate
        const resultCipher = Crypt.multiply({a: cipherText, b: cipherText2})

        // Decrypt
        const decryptedResult = Crypt.decrypt({cipherText: resultCipher})
        expect(decryptedResult).toBeInstanceOf(Uint32Array)

        /* Unsigned test max values are (0 to `plainModulus - 1`) */
        const Simulator = require('../../../classes/simulator')
        const sim = new Simulator({maxValue: Math.floor(parms.plainModulus), signed: false})

        // Create an array of binary strings. We use binary comparison because the values computed
        // are bound to a specific bit length and JS doesn't know how to properly convert them.
        // Ex. A negative 19-bit number will be translated to a positive JS Number,
        // because JS doesn't know how to treat the 19-bit sign bit.
        const plainResStrings = Array.from({length: value.length})
        value.forEach((x,i) => {
          plainResStrings[i] = sim.multiply(x, x)
        })

        // Create an array of binary strings from the decrypted result
        const decryptedResStrings = []
        decryptedResult.forEach((x, i)=> {
          decryptedResStrings[i] = sim.convertNumberToBinaryString(x)
        })
        expect(decryptedResStrings).toEqual(plainResStrings)
      })
    })
  })
})
