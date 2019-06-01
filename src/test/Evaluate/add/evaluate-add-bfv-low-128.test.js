describe('Evaluation on BFV Scheme', () => {
  describe('computationLevel low', () => {
    describe('128-bit security', () => {
      test('add signed', async () => {
        const {Seal} = require('../../../index.js')
        const Crypt = await Seal
        const parms = Crypt.createParams({computationLevel: 'low', security: 128})
        expect(parms).toEqual({
          polyDegree: 4096,
          coeffModulus: 4096,
          plainModulus: 786433,
          scale: Math.pow(2, 55),
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
        const resultCipher = Crypt.add({a: cipherText, b: cipherText2})

        // Decrypt
        const decryptedResult = Crypt.decrypt({cipherText: resultCipher})
        expect(decryptedResult).toBeInstanceOf(Int32Array)

        /* Signed test max values are (+- 1/2 * plainModulus) */
        const Simulator = require('../../../classes/simulator')
        const sim = new Simulator({maxValue: Math.floor(parms.plainModulus / 2), signed: true})
        expect(sim).toBeInstanceOf(Simulator)

        // Create new array of simulated binary strings
        const plainResStrings = Array.from({length: value.length})
        value.map((x,i) => {
          plainResStrings[i] = sim.add(x, x)
        })

        // Convert decrypted results to new array of binary strings
        const decryptedResStrings = []
        decryptedResult.map((x, i)=> {
          decryptedResStrings[i] = sim.convertNumberToBinaryString(x)
        })
        expect(decryptedResStrings).toEqual(plainResStrings)
      })

      test('add unsigned', async () => {
        const {Seal} = require('../../../index.js')
        const Crypt = await Seal

        const parms = Crypt.createParams({computationLevel: 'low', security: 128})
        expect(parms).toEqual({
          polyDegree: 4096,
          coeffModulus: 4096,
          plainModulus: 786433,
          scale: Math.pow(2, 55),
          security: 128
        })
        Crypt.initialize({...parms, schemeType: 'BFV'})
        expect(Crypt._Context.parametersSet()).toBe(true)

        // Gen Keys
        const spyGenKeys = jest.spyOn(Crypt, 'genKeys')
        Crypt.genKeys()
        expect(spyGenKeys).toHaveBeenCalled()

        // Create data to be encrypted
        const value = Uint32Array.from({length: parms.polyDegree}).map(
          (x, i) =>  {
            return i * 192
          })

        // Encrypt
        const cipherText = Crypt.encrypt({value})
        const cipherText2 = Crypt.encrypt({value})
        expect(cipherText).toBeInstanceOf(Crypt._CipherText)
        expect(cipherText2).toBeInstanceOf(Crypt._CipherText)

        // Evaluate
        const resultCipher = Crypt.add({a: cipherText, b: cipherText2})

        // Decrypt
        const decryptedResult = Crypt.decrypt({cipherText: resultCipher})
        expect(decryptedResult).toBeInstanceOf(Uint32Array)

        /**
         * Perform simulated execution
         */
        const Simulator = require('../../../classes/simulator')
        const sim = new Simulator({maxValue: Math.floor(parms.plainModulus), signed: false})

        const plainResStrings = Array.from({length: value.length})

        value.map((x,i) => {
          plainResStrings[i] = sim.add(x, x)
        })
        const decryptedResStrings = []

        decryptedResult.map((x, i)=> {
          decryptedResStrings[i] = sim.convertNumberToBinaryString(x)
        })
        expect(decryptedResStrings).toEqual(plainResStrings)
      })
    })
  })
})
