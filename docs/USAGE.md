# The Basics

There are two __Scheme Types__ that SEAL supports:
- `BFV` operates on Int32/UInt32
- `CKKS` operates on JS Float (Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)

`BFV` is used to encrypt/decrypt on real integers whereas `CKKS` is used for floats.
However, the main difference really is in how `CKKS` delivers an _approximate_ result 
back to you. Ex. A decrypted `CKKS` cipher may be a few decimals off depending on 
several factors. If 100% accuracy is needed, use `BFV`. 

There are several __Keys__ in SEAL:
- `PublicKey` used to encrypt data
- `SecretKey` used to decrypt data
- `RelinKeys` used to extend the number of homomorphic evaluations on a given cipher
- `GaloisKeys` used to perform matrix rotations on a cipher

You may generate and share `RelinKeys` and `GaloisKeys` with a 3rd party where
they could be used in an untrusted execution environment. You may also share the `PublicKey`
as the name implies. This allows 3rd parties to perform homomorphic evaluations on the
ciphers that were encrypted by the `SecretKey`. Never share your `SecretKey` unless you _want_
others to decrypt the data.

#### Note on homomorphic evaluations:
Microsoft SEAL is not a fully homomorphic encryption library and as such, encrypted ciphers 
have a limit on the total number of evaluations performed before decryption fails. When designing a 
leveled homomorphic algorithm, you can test the limits to see where decryption fails and where
you can increase the `computationLevel` or manually tweak the parameters.

# Usage

Steps:
1. Import the library
2. Create encryption parameters and initialize the context 
   (sets the library to work in a given constraint of parameters)
3. Create or load previously generated public/secret keys
4. Create some data to encrypt. Save it, send it to a 3rd party for evaluation, or evaluate locally
5. Decrypt the encrypted cipher result

### Import / require the library

Due to limitations with how the WASM file is loaded, 
we need to await on the main library in order to have
a fully instanciated instance. This limitation mostly
because of how chrome limits the size of synchronously
loaded WASM files. Therefore, loading must be done 
asynchronously.

```
(async () => {

  // Due to limitations with how the WASM file is loaded, 
  // we need to await on the main library in order to have
  // a fully instanciated instance. This limitation mostly
  // because of how chrome limits the size of synchronously
  // loaded WASM files. Therefore, loading must be done 
  // asynchronously.
  
  // If you're using a tool to bundle, such as webpack, you may omit 
  // the `require` line for testing inside a browser.
  const { Seal } = require('node-seal')
  const Crypt = await Seal
  
})()
```

### Creating parameters

There are 3 different computationLevel's that have been predefined
for ease of use. `low`, `medium`, and `high`. The computation levels
allow for more homomorphic operations __on__ encrypted cipherText's
at the cost of more CPU/memory.

Security is by default `128` bits, but can be changed to `192` or `256` bits again 
at the cost of more CPU/memory.

The computation level and security settings that you choose 
here limit the total number of elements in an array as well
as their min/max values.

You're free to use this helper to auto generate parameters used to initialize 
SEAL. These can be manually overridden.

```
const parms = Crypt.createParams({computationLevel: 'low', security: 128})
```

### Initialize Seal

SEAL supports two encryption schemes, `BFV` and `CKKS`. Depending on the type of
data you wish to encrypt, select the appropriate scheme.

`BFV` operates on Int32/UInt32

`CKKS` operates on JS Float (Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)

```
  Crypt.initialize({...parms, schemeType: 'BFV'})
  
  // - or - 
  
  Crypt.initialize({...parms, schemeType: 'CKKS'})
```

### Generate Keys

#### Public / Secret Keys

Can be generated, saved to a base64 string, or loaded from a base64 string

```
  Crypt.genKeys()
  
  // Save the keys
  const publicKey = Crypt.savePublicKey()
  const secretKey = Crypt.saveSecretKey()
  
  // You can skip `Crypt.genKeys()` by loading them instead 
  Crypt.loadPublicKey({encoded: publicKey})
  Crypt.loadSecretKey({encoded: secretKey})

```

#### Relin Keys

Can be generated, saved to a base64 string, or loaded from a base64 string

```
  Crypt.genRelinKeys()
  
  // Save the keys
  const relinKeys = Crypt.saveRelinKeys()
  
  // You can skip `Crypt.genRelinKeys()` by loading them instead 
  Crypt.loadRelinKeys({encoded: relinKeys})
```

#### Galois Keys

Can be generated, saved to a base64 string, or loaded from a base64 string.
Please note generating Galois keys can take a long time and the output is very large.

```
  Crypt.genGaloisKeys()
  
  // Save the keys
  const galoisKeys = Crypt.saveGaloisKeys()
  
  // You can skip `Crypt.genGaloisKeys()` by loading them instead 
  Crypt.loadGaloisKeys({encoded: galoisKeys})
```

### Creating data to encrypt

Creating values can be a bit tricky. SEAL has limitations on the length
of the array __and__ a limit on the minimum and maximum values of each
array element depending on the Encryption Parameters and Scheme Type used
to initialize the library.



For `BFV`:
 
Max array length = `polyDegree`.

We have two types __Int32__ and __UInt32__ with the following restrictions:


* Int32, valid range is from `-1/2 * plainModulus` to `1/2 * plainModulus`
* UInt32, valid range is from `0` to `plainModulus - 1`

`BFV` Example Data
```
/*
  Create an array of max length `polyDegree` with elements that
  are in the valid range.
 
  Create data to be encrypted (connect the dots). Saw tooth about the x-axis.
 
   |            .             |   <- (Max value) Y = + 1/2 (plainModulus)
   |                   .      |
   |. _______________________.|   <- Y = 0
   |      .                   |
   |            .             |   <- (Min value) Y =  - 1/2 (plainModulus)
   ^.           ^.            ^.
     `-> X = 0    `-> X = 2048  `-> X = 4095 (max length, `polyDegree`)
 
*/
const step = parms.plainModulus / parms.polyDegree // ~192.00024
const value = Int32Array.from({length: parms.polyDegree}).map(
 (x, i) =>  {
   if (i >= (parms.polyDegree / 2)) {
     return Math.floor((parms.plainModulus - (step * i)))
   }
   return  Math.ceil(-(step + (step * i)))
 })
})
```

For `CKKS`:

Max array length = `polyDegree / 2`.

There is only one type, __Double__ with the following restrictions:

* A JS Number between -(2^53 - 1) <-> + (2^53 - 1)

`CKKS` Example Data
```
/*
  Create an array of max length `polyDegree / 2` with elements that
  are in the valid range.
 
  Create data to be encrypted (connect the dots). Saw tooth about the x-axis.
 
   |            .             |   <- (Max value) Y = (2^53 - 1)
   |                   .      |
   |.________________________.|   <- Y = 0
   |      .                   |
   |            .             |   <- (Min value) Y = -(2^53 - 1)
   ^.           ^.            ^.
     `-> X = 0    `-> X = 1024  `-> X = 2048 (max length, `polyDegree` / 2)
 
*/

// Create data to be encrypted
const arraySize = parms.polyDegree / 2
const step = Number.MAX_SAFE_INTEGER / arraySize // (2^53 - 1) / (polyDegree / 2)

const value = Float64Array.from({length: arraySize})
  .map( (x, i) =>  {
    if (i >= (arraySize / 2)) {
      return Number.MAX_SAFE_INTEGER - (step * i)
    }
    return -(step * i)
})
```

### Encrypt data

Encryption is easily performed by passing an array to the `value` parameter
of the `encrypt` function.

There are helper methods to save and revitalize a cipher. When reviving a cipher, there
will need to be additional attributes set on the instance using the `set...` functions.
This is to ensure decryption will go smoothly.

```

const oldCipherText = Crypt.encrypt({value: Int32Array.from([1,2,3]})

  
// You can save the oldCipherText as a base64 string
const base64Cipher = oldCipherText.save()

// Revive a cipher from a cipherText base64 string
const revivedCipherText = Crypt.reviveCipher({encoded: base64Cipher})

// But you will need to reinitialize some values. It would be best
// to also serialize this data in combination with the raw cipherText
// so that you may retrieve all the related information in one go.

revivedCipherText.setSchemeType({scheme: oldCipherText.getSchemeType()})
revivedCipherText.setVectorSize({size: oldCipherText.getVectorSize()})
revivedCipherText.setVectorType({type: oldCipherText.getVectorType()})
```

### Decrypt data

Decryption is performed similarly to encryption. The returned Array is a type
of TypedArray that was originally encrypted. 

```
const cipherText = Crypt.encrypt({value: Int32Array.from([1,2,3]})

const decryptedResult = Crypt.decrypt({cipherText})

console.log(decryptedResult)
// Int32Array(3) [1, 2, 3]

```
# Evaluations on encrypted data


### Add

Adding two ciphers results in another cipher.
```

// Create two cipherTexts from a `value` array
const cipherText = Crypt.encrypt({value: Uint32Array.from([1,2,3]})
const cipherText2 = Crypt.encrypt({value: Uint32Array.from([1,2,3]})

const resultCipher = Crypt.add({a: cipherText, b: cipherText2})
const resultInt32Array = Crypt.decrypt({cipherText: resultCipher})

console.log(resultInt32Array)
// Uint32Array(3) [2, 4, 6]

```

### Subtract

Subtracting two ciphers results in another cipher.
```

// Create two cipherTexts from a `value` array
const cipherText = Crypt.encrypt({value: Uint32Array.from([5,5,5]})
const cipherText2 = Crypt.encrypt({value: Uint32Array.from([1,2,3]})

const resultCipher = Crypt.sub({a: cipherText, b: cipherText2})
const resultUInt32Array = Crypt.decrypt({cipherText: resultCipher})

console.log(resultUInt32Array)
// Uint32Array(3) [4, 3, 2]

```

### Multiply

Multiplying two ciphers results in another cipher.
```

// Create two cipherTexts from a `value` array
const cipherText = Crypt.encrypt({value: Int32Array.from([1,2,3]})
const cipherText2 = Crypt.encrypt({value: Int32Array.from([1,2,3]})

const resultCipher = Crypt.multiply({a: cipherText, b: cipherText2})
const resultInt32Array = Crypt.decrypt({cipherText: resultCipher})

console.log(resultInt32Array)
// Int32Array(3) [1, 4, 9]

```

### Relinearize

Relinearization is needed to help extend the number of evaluations on a cipherText. Too many
evaluations will not decrypt correctly. This method is most useful after multiplication, but it 
is *not* the same as bootstrapping.

```

// Create two cipherTexts from a `value` array
const cipherText = Crypt.encrypt({value: Int32Array.from([1,2,3]})
const cipherText2 = Crypt.encrypt({value: Int32Array.from([1,2,3]})

const resultCipher = Crypt.multiply({a: cipherText, b: cipherText2})
// Attempt decryption now, or after relinearization
// const resultInt32Array = Crypt.decrypt({cipherText: resultCipher})

// (Optional) Relinearize the cipher
const relinearizedCipher = Crypt.relinearize({cipherText: resultCipher})
const resultInt32Array = Crypt.decrypt({cipherText: relinearizedCipher})

console.log('resultInt32Array', resultInt32Array)
// Int32Array(3) [1, 4, 9]

```
