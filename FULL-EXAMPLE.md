# Full Example

CommonJS (but also works with `import`)

```javascript
;(async () => {
  // ES6 or CommonJS
  // import SEAL from 'node-seal'
  // const SEAL = require('node-seal')

  // Using CommonJS for RunKit
  const SEAL = require('node-seal')
  const seal = await SEAL()
  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 4096
  const bitSizes = [36, 36, 37]
  const bitSize = 20

  const parms = seal.EncryptionParameters(schemeType)

  // Set the PolyModulusDegree
  parms.setPolyModulusDegree(polyModulusDegree)

  // Create a suitable set of CoeffModulus primes
  parms.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  )

  // Set the PlainModulus to a prime of bitSize 20.
  parms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))

  const context = seal.Context(
    parms, // Encryption Parameters
    true, // ExpandModChain
    securityLevel // Enforce a security level
  )

  if (!context.parametersSet()) {
    throw new Error(
      'Could not set the parameters in the given context. Please try different encryption parameters.'
    )
  }

  const encoder = seal.BatchEncoder(context)
  const keyGenerator = seal.KeyGenerator(context)
  const publicKey = keyGenerator.createPublicKey()
  const secretKey = keyGenerator.secretKey()
  const encryptor = seal.Encryptor(context, publicKey)
  const decryptor = seal.Decryptor(context, secretKey)
  const evaluator = seal.Evaluator(context)

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
