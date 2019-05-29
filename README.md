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

Microsoft SEAL is licensed under the MIT license.

# Installation

npm:
```
npm install node-seal
```

yarn:
```
yarn install node-seal
```

At this time, the library is not available on a CDN. This is a TODO.

# Source
Source will be posted on a public repository in the future with 
plans on also releasing the C++ fork from Microsoft SEAL.

My goal is to take this library to the browser, but there will be limitations.

Several limitations include:
- Dealing with 2^53 numbers (not true 64 bit)
- We can control nodejs heap size, but not inside a user's browser
- 

# Usage

There are a lot of assumptions made to help ease the burden of learning 
SEAL all at once. Instead, you can refer to the sample code below.

For those who are curious about the security of Microsoft SEAL, please
refer to [HomomorphicEncryption.org](http://homomorphicencryption.org/)

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
  // The computation level and security settings that you choose 
  // here limit the total number of elements in an array as well
  // as their min/max values.
  
  const parms = Crypt.createParams({computationLevel: 'low', security: 128})
  
  // BFV schemeType allows for pure Integer arithmetic
  Crypt.initialize({...parms, schemeType: 'BFV'})
  
  // Generate public and secret keys
  Crypt.genKeys()
  
  // Save the keys so we don't have to generate them again
  // They will be base64 strings
  const publicKey = Crypt.savePublicKey()
  const secretKey = Crypt.saveSecretKey()
  
  // You can skip `Crypt.genKeys()` by loading them instead 
  Crypt.loadPublicKey({encoded: publicKey})
  Crypt.loadSecretKey({encoded: secretKey})
  
  // Create some values in an array. Note the limitations of the array 
  // size, and value size
  const step = parms.plainModulus / parms.polyDegree
  
  // Could be a regular JS array or a TypedArray
  // `const value = Int32Array.from...`
  const value = Array.from({length: parms.polyDegree}).map(
  (x, i) =>  {
    if (i >= (parms.polyDegree / 2)) {
      return Math.floor((parms.plainModulus - (step * i)))
    }
    return  Math.ceil(-(step + (step * i)))
  })
  
  // Encrypt the data
  // We auto detect the 'type' for JS Arrays, but if the hint is specified
  // it will speed up encryption slightly.
  // TypedArrays will set the type automatically.
  const oldCipherText = Crypt.encrypt({value, type: 'int32'})
  
  // You can save the cipherText for later as a base64 string
  const savedRawCipher = oldCipherText.save()
  
  // And reload it later using the helper
  const cipherText = Crypt.reviveCipher({encoded: savedRawCipher})
  
  // But you will need to reinitialize some values. It would be best
  // to also serialize this data in combination witht the raw cipherText
  // so that you may retrieve all the related information in one go.
  cipherText.setSchemeType({scheme: 'BFV'})
  cipherText.setVectorSize({size: oldCipherText.getVectorSize()})
  cipherText.setVectorType({type: 'int32'})

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
  
  // Decrypt the result which returns a TypedArray
  const int32Array = Crypt.decrypt({cipherText})
  
})()

```

# Testing

You can find the list of tests in `package.json`. Some of the tests will
take a long time to complete and consume a lot of memory.

If you're seeing `Javascript heap out of memory`, please file a 
bug report.

Saving keys is very memory intensive especially for `computationLevel`s above low. 
This is because there's currently no way to use streams across JS and WASM, so
the strings have to be buffered completely in RAM and they can be very, very large.
