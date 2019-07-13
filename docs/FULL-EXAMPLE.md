# Full Example

CommonJS
```
(async () => {

  // If running in a browser, skip this `require` statement.
  const { Seal } = require('node-seal')
  const Morfix = await Seal
  
  const parms = Morfix.createParams({computationLevel: 'low', security: 128})
  
  Morfix.initialize({...parms, schemeType: 'BFV'})
  
  // Generate public and secret keys
  Morfix.genKeys()
  
  // Create RelinKeys
  Morfix.genRelinKeys()
  
  // Save the keys so we don't have to generate them again
  // They will be base64 strings
  const publicKey = Morfix.savePublicKey()
  const secretKey = Morfix.saveSecretKey()
  
  // You can skip `Morfix.genKeys()` by loading them instead 
  Morfix.loadPublicKey({encoded: publicKey})
  Morfix.loadSecretKey({encoded: secretKey})
  
  // Create sample data for `BFV`
  const step = parms.plainModulus / parms.polyModulusDegree
  
  const array = Int32Array.from([1, 2, 3])
  
  // Encrypt the data
  const oldCipherText = Morfix.encrypt({array})
  
  // You can save the cipherText for later as a base64 string
  const savedRawCipher = oldCipherText.save()
  
  // And reload it later using the helper
  const cipherText = Morfix.loadCipher({encoded: savedRawCipher})
  
  // Createt a copy to sum later
  const cipherText2 = Morfix.loadCipher({encoded: savedRawCipher})
  
  // But you will need to reinitialize some values. 
  // You should also store  this data in combination with the raw cipherText
  // so that you may retrieve all the related information in one go.
  cipherText.setSchemeType({scheme: oldCipherText.getSchemeType()})
  cipherText.setVectorSize({size: oldCipherText.getVectorSize()})
  cipherText.setVectorType({type: oldCipherText.getVectorType()})
  
  cipherText2.setSchemeType({scheme: oldCipherText.getSchemeType()})
  cipherText2.setVectorSize({size: oldCipherText.getVectorSize()})
  cipherText2.setVectorType({type: oldCipherText.getVectorType()})

  // Send the encrypted data to a 3rd party for 
  // homomorphic operations. But we need more
  // metadata of the cipherText to help  
  // facilitate homomorphic operations involving
  // optional matrix rotations, etc.
  //
  // const cipherObject = {
  //   cipherText: cipherText.save(), // gets the base64 string representation of the cipher
  //   schemeType: cipherText.getSchemeType(),
  //   vector: {
  //     size: cipherText.getVectorSize(),
  //     type: cipherText.getVectorType(),
  //   }
  // }
  
  const resultCipher = Morfix.multiply({a: cipherText, b: cipherText2})
  // Attempt decryption now, or after relinearization
  // const resultInt32Array = Morfix.decrypt({cipherText: resultCipher})

  // (Optional) Relinearize the cipher
  const relinearizedCipher = Morfix.relinearize({cipherText: resultCipher})
  
  // Decrypt the result which returns a TypedArray
  const resultInt32Array = Morfix.decrypt({cipherText: relinearizedCipher})
  
  console.log('resultInt32Array', resultInt32Array)
  // resultInt32Array Int32Array(3) [1, 4, 9]
  
})()

```
