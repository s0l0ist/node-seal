const fs = require('fs')

const {
  SCHEME_TYPES,
  SECURITY_LEVELS,
  POLYMODULUS_DEGREES,
  BFV_COEFF_MOD_BIT_SIZES,
  CKKS_COEFF_MOD_BIT_SIZES,
  ARRAY_SIZES,
  SCHEME_TYPES_CONSTRUCTOR,
  SECURITY_LEVELS_CONSTRUCTOR,
  ENCODERS_CONSTRUCTOR,
  TYPES,
  TYPES_CONSTRUCTOR,
  ENCODE_ACTIONS_CONSTRUCTOR,
  DECODE_ACTIONS_CONSTRUCTOR
} = require('./constants')

const genTests = (verb) => {
  for (let schemeType in SCHEME_TYPES) {
    for (let polyModDeg in POLYMODULUS_DEGREES) {
      for (let secLevel in SECURITY_LEVELS) {
        for (let type in TYPES) {

          // Skip data types that the Scheme doesn't support
          if (!TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]) {
            continue
          }
          const folderName = `${verb}`
          const fileName = `${verb}-scheme_${SCHEME_TYPES[schemeType]}-poly_${POLYMODULUS_DEGREES[polyModDeg]}-sec_${SECURITY_LEVELS[secLevel]}-type_${TYPES[type]}.test.js`
          const code = []
          code.push(`describe('${verb} on ${schemeType}', () => {
  describe('polyModulusDegree ${POLYMODULUS_DEGREES[polyModDeg]}', () => {
    test('${SECURITY_LEVELS[secLevel]}-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: ${SCHEME_TYPES_CONSTRUCTOR[schemeType]}
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]}
      })
        `)

          if (schemeType === SCHEME_TYPES.BFV) {
            code.push(`
      // Create a suitable vector of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSizes: Morfix.Vector({array: new Int32Array([${BFV_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}]) }),
          securityLevel: ${SECURITY_LEVELS_CONSTRUCTOR[SECURITY_LEVELS[secLevel]]}
        })
      })
      
      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSize: 20
        })
      })
      `)
          }

          if (schemeType === SCHEME_TYPES.CKKS) {
            code.push(`
      // Create a suitable vector of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSizes: Morfix.Vector({array: new Int32Array([${CKKS_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}]) }),
          securityLevel: ${SECURITY_LEVELS_CONSTRUCTOR[SECURITY_LEVELS[secLevel]]}
        })
      })
      `)
          }


          code.push(`
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: ${SECURITY_LEVELS_CONSTRUCTOR[SECURITY_LEVELS[secLevel]]}
      })

      expect(context.parametersSet()).toBe(true)

      const encoder = ${ENCODERS_CONSTRUCTOR[SCHEME_TYPES[schemeType]]}({
        context: context
      })

      const keyGenerator = Morfix.KeyGenerator({
        context: context
      })

      const publicKey = keyGenerator.getPublicKey()
      const secretKey = keyGenerator.getSecretKey()
      const encryptor = Morfix.Encryptor({
        context: context,
        publicKey: publicKey
      })
      const decryptor = Morfix.Decryptor({
        context: context,
        secretKey: secretKey
      })
      `)

          // Data to encode
          code.push(`
      // Create data to be encrypted
      const array = ${TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}.from({
        length: ${ARRAY_SIZES[SCHEME_TYPES[schemeType]][POLYMODULUS_DEGREES[polyModDeg]]}
      }).map((x, i) =>  i)
      `)
          // Create Vector and PlainText
          code.push(`
      // Convert data to a c++ 'vector'
      const vector = Morfix.Vector({array})

      // Create a plainText variable and encode the vector to it
      const plainText = Morfix.PlainText()
      `)

          // If BFV don't include the scale
          // Encode the data
          code.push(`
      encoder.${ENCODE_ACTIONS_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}({
        vector: vector,${schemeType === SCHEME_TYPES.CKKS ? `\n        scale: Math.pow(2, ${Math.min(...CKKS_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]])}),` : ''}
        plainText: plainText
      })
      `)
          code.push(`
      // Create a cipherText variable and encrypt the plainText to it
      const cipherText = Morfix.CipherText()
      encryptor.encrypt({
        plainText: plainText,
        cipherText: cipherText
      })

      // Create a new plainText variable to store the decrypted cipherText
      const decryptedPlainText = Morfix.PlainText()
      decryptor.decrypt({
        cipherText: cipherText,
        plainText: decryptedPlainText
      })

      // Create a c++ vector to store the decoded result
      const decodeVector = Morfix.Vector({array: new ${TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}() })

      // Decode the plaintext to the c++ vector
      encoder.${DECODE_ACTIONS_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}({
        plainText: decryptedPlainText,
        vector: decodeVector
      })

      // Convert the vector to a JS array
      const decryptedArray = decodeVector.toArray()

      expect(decryptedArray).toBeInstanceOf(${TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]})
      ${schemeType === SCHEME_TYPES.CKKS ? `
      // Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.
      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decryptedArray.map(x => 0 + Math.round(x))
      // Check values
      expect(approxDecrypted).toEqual(approxValues)
      ` : 
      `// Check values
      expect(decryptedArray).toEqual(array)`}
    })
  })
})`)
          fs.mkdirSync(`${process.cwd()}/${folderName}/`, {recursive: true})
          fs.writeFileSync(`./${folderName}/${fileName}`, code.join(''))
        }
      }
    }
  }
}

genTests('encrypt')
