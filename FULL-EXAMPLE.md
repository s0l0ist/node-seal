# Full Example

CommonJS (but also works with `import`)

```javascript
;(async () => {
  // ES6 or CommonJS
  // import { Seal } from 'node-seal'
  // const { Seal } = require('node-seal')

  // Using CommonJS for RunKit
  const { Seal } = require('node-seal')
  const Morfix = await Seal()
  const schemeType = Morfix.SchemeType.BFV
  const securityLevel = Morfix.SecurityLevel.tc128
  const polyModulusDegree = 4096
  const bitSizes = [36, 36, 37]
  const bitSize = 20

  const parms = Morfix.EncryptionParameters(schemeType)

  // Set the PolyModulusDegree
  parms.setPolyModulusDegree(polyModulusDegree)

  // Create a suitable set of CoeffModulus primes
  parms.setCoeffModulus(
    Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  )

  // Set the PlainModulus to a prime of bitSize 20.
  parms.setPlainModulus(
    Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
  )

  const context = Morfix.Context(
    parms, // Encryption Parameters
    true, // ExpandModChain
    securityLevel // Enforce a security level
  )

  if (!context.parametersSet()) {
    throw new Error(
      'Could not set the parameters in the given context. Please try different encryption parameters.'
    )
  }

  const encoder = Morfix.BatchEncoder(context)
  const keyGenerator = Morfix.KeyGenerator(context)
  const publicKey = keyGenerator.publicKey()
  const secretKey = keyGenerator.secretKey()
  const encryptor = Morfix.Encryptor(context, publicKey)
  const decryptor = Morfix.Decryptor(context, secretKey)
  const evaluator = Morfix.Evaluator(context)

  // Create data to be encrypted
  const array = Int32Array.from([1, 2, 3, 4, 5])

  // Encode the Array
  const plainText = encoder.encode(array)

  // Encrypt the PlainText
  const cipherText = encryptor.encrypt(plainText)

  // Add the CipherText to itself and store it in the destination parameter (itself)
  evaluator.add(cipherText, cipherText, cipherText) // Op (A), Op (B), Op (Dest)

  // Or create return a new cipher with the result (omitting destination parameter)
  // const cipher2x = evaluator.add(cipherText, cipherText)

  // Decrypt the CipherText
  const decryptedPlainText = decryptor.decrypt(cipherText)

  // Decode the PlainText
  const decodedArray = encoder.decode(decryptedPlainText)

  console.log('decodedArray', decodedArray)
})()
```
