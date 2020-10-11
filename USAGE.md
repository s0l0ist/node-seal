# The Basics

### Import / require the library

Due to limitations with how the WASM file is loaded,
we need to await on the main library in order to have
a fully instantiated instance. This limitation mostly
because of how some browsers limit the size of synchronously
loaded WASM files. Therefore, loading must be done
asynchronously.

```javascript
// ES6 import
// import { Seal } from 'node-seal'
const SEAL = require('node-seal')
const seal = await SEAL()
```

### Encryption Parameters

Creating encryption parameters is the first step, but can have
drastic affects on the performance of your application as well as
impose some limitations. There is no generic rule for creating a set
of parameters for an application, but there is a methodology behind optimization.

- Determine the scheme type the application requires.
- Start with a 128 bit security context. Higher bit-strength options are available,
  but come at the cost of reduced homomorphic operations.
- Choose a mid-level for `polyModulusDegree` such as `4096` and increase
  if you cannot successfully execute desired functions.
- Modify the bit-sizes for each prime in the `coeffModulus` for fine tuning.
- If using `BFV` scheme (not applicable to `CKKS`), set the `plainModulus` to a reasonable value (`20`) and tweak
  when you encounter correct decoding of some values up to a certain 'ceiling'.

There are two `SchemeTypes`:

```javascript
seal.SchemeType.BFV
seal.SchemeType.CKKS
```

A security level determines the bit level security of the encrypted data.
There are 3 modes you should be primarily concerned with:

```javascript
seal.SecurityLevel.none // Use unless you know what you're doing
seal.SecurityLevel.tc128
seal.SecurityLevel.tc192
seal.SecurityLevel.tc256
```

PolyModulusDegree needs to be a power of 2. We've set up initial helpers on the demo to create the following:

```none
    1024 Bits,
    2048 Bits,
    4096 Bits,
    8192 Bits,
    16384 Bits,
    etc...
```

CoeffModulus need to be set by a string of integers representing the bit-sizes of each prime number. We've
auto generated a list of bit-lengths in the demo, but they can easily be overridden manually.

Example:

```javascript
////////////////////////
// Encryption Parameters
////////////////////////

const schemeType = seal.SchemeType.BFV
const securityLevel = seal.SecurityLevel.tc128
const polyModulusDegree = 4096
const bitSizes = [36, 36, 37]
const bitSize = 20

const encParms = seal.EncryptionParameters(schemeType)

// Set the PolyModulusDegree
encParms.setPolyModulusDegree(polyModulusDegree)

// Create a suitable set of CoeffModulus primes
encParms.setCoeffModulus(
  seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
)

// Set the PlainModulus to a prime of bitSize 20.
encParms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))
```

### Context

After encryption parameters are created, we need to use them to create a Context. A Context is used to create all
other instances which execute within the same **context** as the encryption parameters we specify.

```javascript
////////////////////////
// Context
////////////////////////

// Create a new Context
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
```

### Generate Keys

A KeyGenerator is used to create all the keys necessary for encryption and decryption:

- **Secret Key**: Used for decryption
- **Public Key**: Used for encryption
- **Relinearization Key**: Used for `relinearization`, a technique used in HE to reduce the size of a CipherText after
  multiplication.
- **Galois Key**: Used for rotating values cyclically left or right.

You may generate a new Public Key (or even Relin/Galois Keys) from an existing Secret key.

```javascript
////////////////////////
// Keys
////////////////////////

// Create a new KeyGenerator (creates a new keypair internally)
const keyGenerator = seal.KeyGenerator(context)

const secretKey = keyGenerator.secretKey()
const publicKey = keyGenerator.publicKey()
const relinKey = keyGenerator.relinKeys()
// Generating Galois keys takes a while compared to the others
const galoisKey = keyGenerator.galoisKeys()

// Saving a key to a string is the same for each type of key
const secretBase64Key = secretKey.save()
const publicBase64Key = publicKey.save()
const relinBase64Key = relinKey.save()
// Please note saving Galois keys can take an even longer time and the output is **very** large.
const galoisBase64Key = galoisKey.save()

// Loading a key from a base64 string is the same for each type of key
// Load from the base64 encoded string
const UploadedSecretKey = seal.SecretKey()
UploadedSecretKey.load(context, secretBase64Key)
...


// NOTE
//
// A KeyGenerator can also be instantiated with existing keys. This allows you to generate
// new Relin/Galois keys with a previously generated SecretKey.

// Uploading a SecretKey: first, create an Empty SecretKey to load
const UploadedSecretKey = seal.SecretKey()

// Load from the base64 encoded string
UploadedSecretKey.load(context, secretBase64Key)

// Create a new KeyGenerator (use uploaded secretKey)
const keyGenerator = seal.KeyGenerator(context, UploadedSecretKey)

// Similarly, you may also create a KeyGenerator with a PublicKey. However, the benefit is purley to
// save time by not generating a new PublicKey

// Uploading a PublicKey: first, create an Empty PublicKey to load
const UploadedPublicKey = seal.PublicKey()

// Load from the base64 encoded string
UploadedPublicKey.load(context, publicBase64Key)

// Create a new KeyGenerator (use both uploaded keys)
const keyGenerator = seal.KeyGenerator(context, UploadedSecretKey, UploadedPublicKey)


```

### Variables

Variables hold data we are manipulating. PlainTexts store encoded values of the human readable data that we
provide. CipherTexts store encrypted values of the encoded PlainText. Homomorphic operations occur on CipherTexts.

```javascript
////////////////////////
// Variables
////////////////////////

// Creating PlainText(s)
const plainA = seal.PlainText()
const plainB = seal.PlainText()

// Creating CipherText(s)
const cipherA = seal.CipherText()
const cipherB = seal.CipherText()

// Saving
// ... after some encoding...
const plainAbase64 = plainA.save() // Saves as a base64 string.

// Loading. Create an empty instance, then use the following method
const uploadedPlain = seal.PlainText()
uploadedPlain.load(context, plainAbase64)

// Saving
// ... after some encryption...
const cipherAbase64 = cipherA.save() // Saves as a base64 string.

// Loading. Create an empty instance, then use the following method
const uploadedCipherText = seal.CipherText()
uploadedCipherText.load(context, cipherAbase64)
```

### Instances

To perform homomorphic evaluations, we need to construct a few helpers:

- **Evaluator:** Used to perform HE operations.
- **Encoder:** Used to encode to a PlainText or decode a PlainText.
- **Encryptor:** Used to encrypt a PlainText to a CipherText.
- **Decryptor:** Used to decrypt a CipherText to a PlainText.

```javascript
////////////////////////
// Instances
////////////////////////

// Create an Evaluator which will allow HE functions to execute
const evaluator = seal.Evaluator(context)

// Create a BatchEncoder (only BFV SchemeType)
const encoder = seal.BatchEncoder(context)

// Or a CKKSEncoder (only CKKS SchemeType)
// const encoder = seal.CKKSEncoder(context)

// Create an Encryptor to encrypt PlainTexts
const encryptor = seal.Encryptor(context, publicKey)

// Create a Decryptor to decrypt CipherTexts
const decryptor = seal.Decryptor(context, secretKey)
```

### Functions

We show homomorphic addition, but more functions are available and the code can
be generated from the [demo](https://morfix.io/sandbox).

```javascript
////////////////////////
// Homomorphic Functions
////////////////////////

// Both types of encoders accept a plainText as an optional parameter.
// If not provided, will return a new plainText conatining the encoded
// data. If one is specified, it will be modified and the function
// will return void.
// Ex:
//
// // Create a plainText
// const plainTextA = seal.PlainText()
//
// //... some time later ...
//
// batchEncoder.encode(
//   Int32Array.from([1,2,3]), // This could also be a Uint32Array
//   plainTextA
// )
//
// ... plainTextA contains the encoded array parameter
//

// Encode data to a PlainText
const plainTextA = batchEncoder.encode(
  Int32Array.from([1, 2, 3]) // This could also be a Uint32Array
)

// An encryptor and decryptor also accept a cihperText and plainText
// optional parameter. If not provided, an encryptor will
// return a new cipherText and a decyprtor will return a new plainText.
// If the optional parameter is specified, it will be modified and both
// methods will return void.
// Ex:
//
// // Create a plainText
// const cipherTextA = seal.CipherText()
//
// //... some time later ...
//
// encryptor.encrypt(
//   plainTextA,
//   cipherTextA
// )
//
// ... cipherTextA contains the encrypted plainText parameter
//

// Encrypt a PlainText
const cipherTextA = encryptor.encrypt(plainTextA)

// Add CipherText B to CipherText A and store the sum in a destination CipherText
const cipherTextD = seal.CipherText()

evaluator.add(cipherTextA, cipherTextA, cipherTextD)

// Decrypt a CipherText
const plainTextD = decryptor.decrypt(cipherTextD)

// `signed` defaults to 'true' if not specified and will return an Int32Array.
// If you have encrypted a Uint32Array and wish to decrypt it, set
// this to false.
const decoded = batchEncoder.decode(
  plainTextD,
  true // Can be omitted since this defaults to true.
)

console.log('decoded', decoded)
```
