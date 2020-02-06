# The Basics

### Import / require the library

Due to limitations with how the WASM file is loaded, 
we need to await on the main library in order to have
a fully instantiated instance. This limitation mostly
because of how some browsers limit the size of synchronously
loaded WASM files. Therefore, loading must be done 
asynchronously.

```
// ES6 import
// import { Seal } from 'node-seal'
const { Seal } = require('node-seal')
const Morfix = await Seal
```

### Encryption Parameters

Creating encryption parameters is the first step, but can have 
drastic affects on the performance of your application as well as
impose some limitations. There is no generic rule for creating a set
of parameters for an application, but there is a methodology behind optimization.

* Determine the scheme type the application requires.
* Start with a 128 bit security context. Higher bit-strength options are available,
  but come at the cost of reduced homomorphic operations.
* Choose the lowest level for `polyModulusDegree` first and increase 
  when you cannot successfully execute desired functions.
* Modify the bit-sizes for each prime in the `coeffModulus` for fine tuning.
* If using `BFV` scheme (not applicable to `CKKS`), set the `plainModulus` to a reasonable value (`20`) and tweak
  when you encounter correct decoding of some values, but not for others. 

There are two `SchemeTypes`:
```
Morfix.SchemeType.BFV
Morfix.SchemeType.CKKS
```
A security level determines the bit level security of the encrypted data. 
There are 3 modes you should be primarily concerned with:

```
Morfix.SchemeType.none // Use unless you know what you're doing
Morfix.SchemeType.tc128
Morfix.SchemeType.tc192
Morfix.SchemeType.tc256
``` 

PolyModulusDegree needs to be a power of 2. We've set up initial helpers on the demo to create the following:
```
    1024 Bits,
    2048 Bits,
    4096 Bits,
    8192 Bits,
    16384 Bits,
    32768 Bits,
    etc...
```

CoeffModulus need to be set by a string of integers representing the bit-sizes of each prime number. We've 
auto generated a list of bit-lengths in the demo, but they can easily be overridden manually.

Example:
```
////////////////////////
// Encryption Parameters
////////////////////////

// Create a new EncryptionParameters
const encParms = Morfix.EncryptionParameters({
  schemeType: Morfix.SchemeType.BFV
})


// Assign Poly Modulus Degree
encParms.setPolyModulusDegree({
  polyModulusDegree: 4096
})

// Create a suitable set of CoeffModulus primes
encParms.setCoeffModulus({
  coeffModulus: Morfix.CoeffModulus.Create({
    polyModulusDegree: 4096,
    bitSizes: Int32Array.from([36,36,37])
  })
})

// Assign a PlainModulus (only for BFV scheme type)
encParms.setPlainModulus({
  plainModulus: Morfix.PlainModulus.Batching({
    polyModulusDegree: 4096,
    bitSize: 20
  })
})
```

### Context

After encryption parameters are created, we need to use them to create a Context. A Context is used to create all
other instances which execute within the same **context** as the encryption parameters we specify.
```
////////////////////////
// Context
////////////////////////

// Create a new Context
const context = Morfix.Context({
  encryptionParams: encParms,
  expandModChain: true,
  securityLevel: Morfix.SecurityLevel.tc128 // Enforces a 128-bit security context
})

// Helper to check if the Context was created successfully
if (!context.parametersSet) {
  throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
}
```
### Generate Keys

A KeyGenerator is used to create all the keys necessary for encryption and decryption:

* **Secret Key**: Used for decryption
* **Public Key**: Used for encryption
* **Relinearization Key**: Used for `relinearization`, a technique used in HE to reduce the size of a CipherText after
 multiplication.
* **Galois Key**: Used for rotating values cyclically left or right.

You may generate a new Public Key (or even Relin/Galois Keys) from an existing Secret key.

```
////////////////////////
// Keys
////////////////////////

// Create a new KeyGenerator (creates a new keypair internally)
const keyGenerator = Morfix.KeyGenerator({ 
  context
})

const secretKey = keyGenerator.getSecretKey()
const publicKey = keyGenerator.getPublicKey()
const relinKey = keyGenerator.genRelinKeys()
// Generating Galois keys takes a while compared to the others
const galoisKey = keyGenerator.genGaloisKeys()

// Saving a key to a string is the same for each type of key
const secretBase64Key = secretKey.save()
const publicBase64Key = publicKey.save()
const relinBase64Key = relinKey.save()
// Please note saving Galois keys can take an even longer time and the output is **very** large.
const galoisBase64Key = galoisKey.save()

// Loading a key from a base64 string is the same for each type of key
// Load from the base64 encoded string
const UploadedSecretKey = Morfix.SecretKey()
UploadedSecretKey.load({ context, encoded: secretBase64Key })
...


// NOTE
//
// A KeyGenerator can also be instantiated with existing keys. This allows you to generate
// new Relin/Galois keys with a previously generated SecretKey.

// Uploading a SecretKey: first, create an Empty SecretKey to load
const UploadedSecretKey = Morfix.SecretKey()

// Load from the base64 encoded string
UploadedSecretKey.load({ context, encoded: secretBase64Key })

// Create a new KeyGenerator (use uploaded secretKey)
const keyGenerator = Morfix.KeyGenerator({ 
  context,
  secretKey: UploadedSecretKey
})

// Similarly, you may also create a KeyGenerator with a PublicKey. However, the benefit is purley to
// save time by not generating a new PublicKey

// Uploading a PublicKey: first, create an Empty PublicKey to load
const UploadedPublicKey = Morfix.PublicKey()

// Load from the base64 encoded string
UploadedPublicKey.load({ context, encoded: publicBase64Key })

// Create a new KeyGenerator (use both uploaded keys)
const keyGenerator = Morfix.KeyGenerator({ 
  context,
  secretKey: UploadedSecretKey,
  publicKey: UploadedPublicKey
})


```

### Variables

Variables hold data we are manipulating. PlainTexts store encoded values of the human readable data that we
 provide. CipherTexts store encrypted values of the encoded PlainText. Homomorphic operations occur on CipherTexts.

```
////////////////////////
// Variables
////////////////////////

// Creating PlainText(s) 
const plainA = Morfix.PlainText()
const plainB = Morfix.PlainText()

// Creating CipherText(s) 
const cipherA = Morfix.CipherText()
const cipherB = Morfix.CipherText()

// Saving
... after some encoding...
const plainAbase64 = plainA.save() // Saves as a base64 string.

// Loading. Create an empty instance, then use the following method
const uploadedPlain = Morfix.PlainText()
uploadedPlain.load({ context, encoded: plainAbase64 })

// Saving
... after some encryption...
const cipherAbase64 = cipherA.save() // Saves as a base64 string.

// Loading. Create an empty instance, then use the following method
const uploadedCipherText = Morfix.CipherText()
uploadedCipherText.load({ context, encoded: cipherAbase64 })
```

### Instances

To perform homomorphic evaluations, we need to construct a few helpers:

* **Evaluator:** Used to perform HE operations.
* **Encoder:** Used to encode to a PlainText or decode a PlainText.
* **Encryptor:** Used to encrypt a PlainText to a CipherText.
* **Decryptor:** Used to decrypt a CipherText to a PlainText.

```
////////////////////////
// Instances
////////////////////////

// Create an Evaluator which will allow HE functions to execute
const evaluator = Morfix.Evaluator({ context })

// Create a BatchEncoder (only BFV SchemeType)
const encoder = Morfix.BatchEncoder({ context })

// Or a CKKSEncoder (only CKKS SchemeType)
// const encoder = Morfix.CKKSEncoder({ context })

// Create an Encryptor to encrypt PlainTexts
const encryptor = Morfix.Encryptor({
  context,
  publicKey
})

// Create a Decryptor to decrypt CipherTexts
const decryptor = Morfix.Decryptor({
  context,
  secretKey
})
```

### Functions

We show homomorphic addition, but more functions are available and the code can
be generated from the [demo](https://morfix.io/sandbox).

```
////////////////////////
// Homomorphic Functions
////////////////////////

// Both types of encoders accept a plainText as an optional parameter.
// If not provided, will return a new plainText conatining the encoded
// data. If one is specified, it will be modified and the function
// will return an undefined.
// Ex:
// 
// // Create a plainText
// const plainTextA = Morfix.PlainText()
// 
// //... some time later ...
//
// batchEncoder.encode({
//   array: Int32Array.from([1,2,3]), // This could also be a Uint32Array
//   plainText: plainTextA
// })
// 
// ... plainTextA contains the encoded array parameter
//

// Encode data to a PlainText
const plainTextA = batchEncoder.encode({
  array: Int32Array.from([1,2,3]) // This could also be a Uint32Array
})



// An encryptor and decryptor also accept a cihperText and plainText
// optional parameter. If not provided, an encryptor will 
// return a new cipherText and a decyprtor will return a new plainText.
// If the optional parameter is specified, it will be modified and both
// methods will return an undefined.
// Ex:
// 
// // Create a plainText
// const cipherTextA = Morfix.CipherText()
// 
// //... some time later ...
//
// encryptor.encrypt({
//   plainText: plainTextA,
//   cipherText: cipherTextA
// })
// 
// ... cipherTextA contains the encrypted plainText parameter
//

// Encrypt a PlainText
const cipherTextA = encryptor.encrypt({
  plainText: plainTextA
})    

// Add CipherText B to CipherText A and store the sum in a destination CipherText
const cipherTextD = Morfix.CipherText()

evaluator.add({
  a: cipherTextA,
  b: cipherTextA,
  destination: cipherTextD
})    

// Decrypt a CipherText
const plainTextD = decryptor.decrypt({
  cipherText: cipherTextD
})    

// `signed` defaults to 'true' if not specified and will return an Int32Array.
// If you have encrypted a Uint32Array and wish to decrypt it, set 
// this to false.
const decoded = batchEncoder.decode({
  plainText: plainTextD
  // signed: true 
})

console.log('decoded', decoded )
```
