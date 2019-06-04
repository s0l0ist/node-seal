# Full Example

CommonJS
```
(async () => {

  // If running in a browser, skip this `require` statement.
  const { Seal } = require('node-seal')
  const Crypt = await Seal
  
  const parms = Crypt.createParams({computationLevel: 'low', security: 128})
  
  Crypt.initialize({...parms, schemeType: 'BFV'})
  
  // Generate public and secret keys
  Crypt.genKeys()
  
  // Create RelinKeys
  Crypt.genRelinKeys()
  
  // Save the keys so we don't have to generate them again
  // They will be base64 strings
  const publicKey = Crypt.savePublicKey()
  const secretKey = Crypt.saveSecretKey()
  
  // You can skip `Crypt.genKeys()` by loading them instead 
  Crypt.loadPublicKey({encoded: publicKey})
  Crypt.loadSecretKey({encoded: secretKey})
  
  // Create sample data for `BFV`
  const step = parms.plainModulus / parms.polyDegree
  
  // Could be a regular JS array or a TypedArray. TypedArrays are the preferred way.
  const value = Int32Array.from([1, 2, 3])
  
  // Encrypt the data
  // We auto detect the 'type' for JS Arrays, but if the hint is specified we will convert it
  // TypedArrays will set the type automatically.
  const oldCipherText = Crypt.encrypt({value})
  
  // You can save the cipherText for later as a base64 string
  const savedRawCipher = oldCipherText.save()
  
  // And reload it later using the helper
  const cipherText = Crypt.reviveCipher({encoded: savedRawCipher})
  
  // Createt a copy to sum later
  const cipherText2 = Crypt.reviveCipher({encoded: savedRawCipher})
  
  // But you will need to reinitialize some values. It would be best
  // to also serialize this data in combination with the raw cipherText
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
  const cipherObject = {
    cipherText: cipherText.save(), // gets the base64 string representation of the cipher
    schemeType: cipherText.getSchemeType(),
    vector: {
      size: cipherText.getVectorSize(),
      type: cipherText.getVectorType(),
    }
  }
  
  const resultCipher = Crypt.add({a: cipherText, b: cipherText2})
  // Attempt decryption now, or after relinearization
  // const resultInt32Array = Crypt.decrypt({cipherText: resultCipher})

  // (Optional) Relinearize the cipher
  const relinearizedCipher = Crypt.relinearize({cipherText: resultCipher})
  
  // Decrypt the result which returns a TypedArray
  const resultInt32Array = Crypt.decrypt({cipherText: relinearizedCipher})
  
  console.log('resultInt32Array', resultInt32Array)
  // resultInt32Array Int32Array(3) [2, 4, 6]
  
})()

```
