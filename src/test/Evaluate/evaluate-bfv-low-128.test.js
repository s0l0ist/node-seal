describe.skip('Evaluation on BFV Scheme', () => {
  describe('computationLevel low', () => {
    describe('128-bit security', () => {
      test('add', async () => {
        const {Seal} = require('../../index.js')
        const Crypt = await Seal


        const parms = Crypt.createParams({computationLevel: 'low', security: 128})
        // expect(parms).toEqual({
        //   polyDegree: 4096,
        //   coeffModulus: 4096,
        //   plainModulus: 786433,
        //   scale: Math.pow(2, 55),
        //   security: 128
        // })
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
        const cipherText = Crypt.encrypt({value, type: 'int32'})
        const cipherText2 = Crypt.encrypt({value, type: 'int32'})
        // const cipherText3 = Crypt.encrypt({value, type: 'int32'})
        expect(cipherText).toBeInstanceOf(Crypt._CipherText)
        expect(cipherText2).toBeInstanceOf(Crypt._CipherText)
        // expect(cipherText3).toBeInstanceOf(Crypt._CipherText)

        // Evaluate
        const resultCipher = Crypt.add({a: cipherText, b: cipherText2})
        // const resultCiphe1 = Crypt.add({a: cipherText, b: cipherText2})
        // const resultCipher = Crypt.add({a: resultCiphe1, b: cipherText3})

        // Decrypt
        const decryptedResult = Crypt.decrypt({cipherText: resultCipher})
        expect(decryptedResult).toBeInstanceOf(Int32Array)

        /**
         * Perform simulated execution
         */
        const Simulator = require('../../classes/simulator')
        const sim = new Simulator({maxValue: parms.plainModulus / 2, minValue: parms.plainModulus / 2})

        const plainResStrings = Array.from({length: value.length})
        value.map((x,i) => {
          plainResStrings[i] = (sim.add(x, x, 0).s)
        })
        const decryptedResStrings = []

        decryptedResult.map((x, i)=> {
          decryptedResStrings[i] = sim.convertNumberToBinaryString(x)
        })

        console.log('plainResStrings', plainResStrings.slice(0,10))
        console.log('decryptedResStrings', decryptedResStrings.slice(0,10))
        expect(decryptedResStrings).toEqual(plainResStrings)
      })
    })
  })
})
