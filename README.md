# Microsoft SEAL

This is a library wrapper for the Web Assembly port of the C++ Microsoft SEAL library.

It contains high level functions to make using this library easy. There are default parameters
which can be customized and overridden for advanced use cases.

Microsoft SEAL is an easy-to-use homomorphic encryption library developed by researchers in 
the Cryptography Research group at Microsoft Research. Microsoft SEAL is written in modern 
standard C++ and has no external dependencies, making it easy to compile and run in many 
different environments.

For more information about the Microsoft SEAL project, see [http://sealcrypto.org](https://www.microsoft.com/en-us/research/project/microsoft-seal).

# License

Microsoft SEAL is licensed under the MIT license; see [LICENSE](LICENSE).

# Installation

npm:
```
npm install node-seal
```

yarn:
```
yarn install node-seal
```

At this time, the library is not available on a CDN.


# Usage

CommonJS
```
(async () => {
  // Due to limitations with how the WASM file is loaded, 
  // we need to await on the main library in order to have
  // a fully instanciated instance. This limitation mostly
  // because of how chrome limits the size of synchronously
  // loaded WASM files. Therefore, loading must be done 
  // asynchronously.
  const { Seal } = require('node-seal')
  const Crypt = await Seal
  
  // There are 3 different computationLevel's that have been predefined
  // for ease of use. 'low', 'medium', and 'high'. The computation levels
  // allow for more homomorphic operations __on__ encrypted cipherText's
  // at the cost of more CPU/memory.
  //
  // Security is by default 128 bits, but can be changed to 192 or 256 bits again 
  // at the cost of more CPU/memory.
  //
  // (HomomorphicEncryption.org)[http://homomorphicencryption.org/]
  //
  const parms = Crypt.createParams({computationLevel: 'low', security: 128})
  
  // BFV schemeType allows for pure Integer arithmetic
  Crypt.initialize({...parms, schemeType: 'BFV'})
  
  // Generate public and secret keys
  Crypt.genKeys()
  
  // Save the keys so we don't have to generate them again
  // They will be base64 strings
  const publicKey = Crypt.savePublicKey()
  const secretKey = Crypt.saveSecretKey()
  
  // Optionally load them instead of calling `Crypt.genKeys()`
  Crypt.loadPublicKey({encoded: publicKey})
  Crypt.loadSecretKey({encoded: secretKey})
  
  // Create some values in an array. Note the limitations of the array 
  // size, and value size
  const step = parms.plainModulus / parms.polyDegree
  const value = Array.from({length: parms.polyDegree}).map(
  (x, i) =>  {
    if (i >= (parms.polyDegree / 2)) {
      return Math.floor((parms.plainModulus - (step * i)))
    }
    return  Math.ceil(-(step + (step * i)))
  })
  
  // Encrypt the data
  const cipherText = Crypt.encrypt({value, type: 'int32'})
  
  // Send the encrypted data to a 3rd party for 
  // homomorphic operations. But we need more
  // metadata of the cipherText to help  
  // facilitate homomorphic operations involving
  // optional matrix rotations, etc.
  //
  // At this time, homomorphic evaluations are not performed
  // in javascript although there are plans to build this feature
  // in the near future.
  const cipherObject = {
    cipherText: cipherText.save(), // gets the base64 string representation of the cipher
    schemeType: cipherText.getSchemeType(),
    vector: {
      size: cipherText.getVectorSize(),
      type: cipherText.getVectorType(),
    }
  }
  
  // Receive the encrypted result back.
  // ...
  
  // Decrypt the result
  const vector = Crypt.decrypt({cipherText})
  
  // TODO: Convert vector back to JS array so we don't have to operate on C++ vectors
  Crypt.printVector({vector, type: cipherText.getVectorType()})

})()

```

