# node-seal

A zero-dependency Web Assembly port of the C++ [Microsoft SEAL](https://github.com/microsoft/SEAL) library.

**Now supporting Microsoft SEAL 3.4.4**

It contains high level functions to make using this library easy. There are default parameters
which can be customized and overridden for advanced use cases.

It also exposes a lower level API to be close to the C++ calls from Microsoft SEAL.

# Microsoft SEAL

Microsoft SEAL is an easy-to-use open-source ([MIT licensed](LICENSE)) homomorphic
encryption library developed by the Cryptography and Privacy Research group at
Microsoft. Microsoft SEAL is written in modern standard C++ and has no external
dependencies, making it easy to compile and run in many different environments.
For more information about the Microsoft SEAL project, see
[sealcrypto.org](https://www.microsoft.com/en-us/research/project/microsoft-seal).

This document pertains to Microsoft SEAL version 3.4. Users of previous versions
of the library should look at the [list of changes](https://github.com/microsoft/SEAL/blob/master/Changes.md).

# License

[MIT license](LICENSE)

# Installation

npm:
```
npm install node-seal
```

yarn:
```
yarn add node-seal
```

# Usage

There are a lot of assumptions made to help ease the burden of learning 
SEAL all at once. You can refer to the sample code below.

[Checkout the basics](docs/USAGE.md)

For those who are curious about the security of Microsoft SEAL, please
refer to [HomomorphicEncryption.org](http://homomorphicencryption.org/)

# Examples

Check out this simple example below or for a more in-depth example, look [here](docs/FULL-EXAMPLE.md).

For low level API examples, please check the 'manual-...' tests [here](src/test).

## Simple Example

This showcases the most basic use-case of initializing the library, encrypt data, performing a simple 
evaluation, and then decrypting the result. This example works in browsers as well as NodeJS. 

```
(async () => {

  /*
    First, import the library.
    
    Second, create the parameters for encryption. This configures the library
    to only encrypt / evaluate / decrypt for a given context. These parameters
    can be customized for advanced users in order to fine tune performance.
    
    Third, generate Public / Secret keys. A Public key can be shared and is 
    used to encrypt data. A Secret key should not be shared and is used to 
    decrypt data.
  */
  // If in a browser, skip this next line
  // import { Seal } from 'node-seal'
  const { Seal } = require('node-seal')

  
  const Morfix = await Seal
  
  /*
    Create our parameters with the helper function.
    
    We are using a 'low' `computationLevel` because we are not expecting to
    perform multiple evaluations in a row. This setting reduces the time it
    takes to initialize the library, generate keys, encryption, evaluation, 
    and decryption. In addition, the `security` is set to be 128 bits.
    
    For a list of available settings, please review the full-example in 
    this repository.  
  */
  const parms = Morfix.createParams({computationLevel: 'low', security: 128})
  
  /*
    We are initializing the library with the parameters generated above and 
    finally initializign the library to compute over signed or unsigned Integer
    arithmetic (Int32Array / Uint32Array). 
  */
  Morfix.initialize({...parms, schemeType: 'BFV'})
  
  /*
    This function generates and sets the public and secret keys internally.
    Both keys have helper methods to save to a base64 string and reinitialize
    them from these strings. These strings can be very large.
  */
  Morfix.genKeys()
   
  /* 
    Encrypt some data. We are using TypedArrays for consistency. Here, we
    are using Int32Arrays, but could easily switch to UintArray32.
  */
  const cipherText_a = Morfix.encrypt({array: Int32Array.from([4, 5, 6])})
  const cipherText_b = Morfix.encrypt({array: Int32Array.from([1, 2, 3])})
  
  /* 
    Perform an `Evaluation` (ex homomorphic addition)
    We show 3 methods, but there are more available:
    1. `add`
    2. `sub`
    3. `multiply`
  */
  const sumCipher = Morfix.add({a: cipherText_a, b: cipherText_b})
  const subCipher = Morfix.sub({a: cipherText_a, b: cipherText_b})
  const productCipher = Morfix.multiply({a: cipherText_a, b: cipherText_b})
  

  /*
    Decrypt the cipher text results
  */
  const decryptedSum = Morfix.decrypt({cipherText: sumCipher})
  const decryptedSub = Morfix.decrypt({cipherText: subCipher})
  const decryptedMultiply = Morfix.decrypt({cipherText: productCipher})
  
  console.log('decryptedSum', decryptedSum)
  // decryptedSum Int32Array(3) [5, 7, 9]
  
  console.log('decryptedSub', decryptedSub)
  // decryptedSub Int32Array(3) [3, 3, 3]

  console.log('decryptedMultiply', decryptedMultiply)
  // decryptedMultiply Int32Array(3) [4, 10, 18]
  
})()

```

# Changes

[See the version changes](Changes.md)

# Testing

You can find the list of tests in `package.json`. They can be useful to see different
parameters and how they affect execution time. Some of the tests will
take a long time to complete and consume a lot of memory.

# Caveats

Conversion from C++ to Web Assembly has some limitations. In addition, the 
SEAL library itself demands some constraints on the size of arrays as well as
their max / min values.

[See limitations](docs/CAVEATS.md)


# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
