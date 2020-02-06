# Full Example

CommonJS (but also works with `import`)
```
(async () => {
  // ES6 or CommonJS
  // import { Seal } from 'node-seal'
  // const { Seal } = require('node-seal')

  // Using CommonJS for RunKit
  const { Seal } = require('node-seal')
  const Morfix = await Seal
  const parms = Morfix.EncryptionParameters({
    schemeType: Morfix.SchemeType.BFV
  })

  parms.setPolyModulusDegree({
    polyModulusDegree: 4096
  })

  // Create a suitable set of CoeffModulus primes
  parms.setCoeffModulus({
    coeffModulus: Morfix.CoeffModulus.Create({
      polyModulusDegree: 4096,
      bitSizes: Int32Array.from([36,36,37])
    })
  })

  // Set the PlainModulus to a prime of bitSize 20.
  parms.setPlainModulus({
    plainModulus: Morfix.PlainModulus.Batching({
      polyModulusDegree: 4096,
      bitSize: 20
    })
  })

  const context = Morfix.Context({
    encryptionParams: parms,
    expandModChain: true,
    securityLevel: Morfix.SecurityLevel.tc128
  })

  if (!context.parametersSet) {
    throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
  }

  const encoder = Morfix.BatchEncoder({
    context
  })

  const keyGenerator = Morfix.KeyGenerator({
    context
  })

  const publicKey = keyGenerator.getPublicKey()
  const secretKey = keyGenerator.getSecretKey()
  const encryptor = Morfix.Encryptor({
    context,
    publicKey
  })
  const decryptor = Morfix.Decryptor({
    context,
    secretKey
  })
  const evaluator = Morfix.Evaluator({
    context
  })

  // Create data to be encrypted
  const array = Int32Array.from([1,2,3,4,5])

  // Encode the Array
  const plainText = encoder.encode({
    array
  })

  // Encrypt the PlainText
  const cipherText = encryptor.encrypt({
    plainText
  })

  // Add the CipherText to itself and overwrite its data with the sum
  evaluator.add({
    a: cipherText,
    b: cipherText,
    destination: cipherText
  }) 

  // Decrypt the CipherText
  const decryptedPlainText = decryptor.decrypt({
    cipherText
  })

  // Decode the PlainText
  const decodedArray = encoder.decode({
    plainText: decryptedPlainText
  })

  console.log('decodedArray', decodedArray)
})()
```
