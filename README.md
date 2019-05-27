# Microsoft SEAL

This is a port from C++ to Javascript of the Microsoft SEAL library.

It contains most of the functionality 

Microsoft SEAL is an easy-to-use homomorphic encryption library developed by researchers in 
the Cryptography Research group at Microsoft Research. Microsoft SEAL is written in modern 
standard C++ and has no external dependencies, making it easy to compile and run in many 
different environments.

For more information about the Microsoft SEAL project, see [http://sealcrypto.org](https://www.microsoft.com/en-us/research/project/microsoft-seal).

# License

Microsoft SEAL is licensed under the MIT license; see [LICENSE](LICENSE).

# Installation

You can install the library in backend or frontend javascript.

Backend npm:
```
npm install node-seal
```

Backend yarn:
```
yarn install node-seal
```

Frontend:
```
<script src="./dist/hcrypt.js"></script>
```


# Usage

CommonJS
```
(async () => {
  // Due to limitations with how the WASM file is loaded, 
  // we need to await on the main library in order to have
  // a fully instanciated instance.
  const { Hcrypt } = require('node-seal')
  const Crypt = await HCrypt
  
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
  
  // Decrypt the data
  const vector = Crypt.decrypt({cipherText})
  
  // TODO: Convert vector back to JS array so we don't have to operate on C++ vectors
  Crypt.printVector({vector, type: cipherText.getType()})

})()

```

